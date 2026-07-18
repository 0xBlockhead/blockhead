import assert from 'node:assert/strict'
import {
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'


const runGenerator = (
	command: 'check' | 'generate',
	generatedOutputRoot: string
) => spawnSync(
	process.execPath,
	[
		'--import',
		'tsx',
		path.join(process.cwd(), 'scripts/app/generate.ts'),
		command,
	],
	{
		cwd: process.cwd(),
		encoding: 'utf8',
		env: {
			...process.env,
			APP_GENERATED_OUTPUT_ROOT: generatedOutputRoot,
		},
		timeout: 180_000,
	}
)

test('check mode terminates for synchronized and stale generated trees without mutation', () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-generator-check-liveness-'))
	const generatedFilePath = path.join(generatedOutputRoot, 'src/schema/EntityType.ts')

	try {
		const generateResult = runGenerator('generate', generatedOutputRoot)
		assert.equal(generateResult.status, 0, generateResult.stderr || generateResult.stdout)
		assert.equal(generateResult.error, undefined)

		const synchronizedResult = runGenerator('check', generatedOutputRoot)
		assert.equal(synchronizedResult.status, 0, synchronizedResult.stderr || synchronizedResult.stdout)
		assert.equal(synchronizedResult.error, undefined)

		const synchronizedSource = readFileSync(generatedFilePath, 'utf8')
		const staleSource = `${synchronizedSource}\n// stale fixture\n`
		writeFileSync(generatedFilePath, staleSource)

		const staleResult = runGenerator('check', generatedOutputRoot)
		assert.notEqual(staleResult.status, 0)
		assert.equal(staleResult.error, undefined)
		assert.match(
			staleResult.stderr || staleResult.stdout,
			/Generated files are stale:[\s\S]*src\/schema\/EntityType\.ts/
		)
		assert.equal(readFileSync(generatedFilePath, 'utf8'), staleSource)
	} finally {
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})
