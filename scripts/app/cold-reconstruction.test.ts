import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

import { app } from '../../APP.ts'
import { compileApp } from './generate.ts'
import { renderGeneratedFile } from './render.ts'


const root = process.cwd()
const canonicalInputPaths = [
	'APP.ts',
	'package.json',
	'scripts/app/generate.ts',
	'scripts/app/inputs/source-target.ts',
	'scripts/app/model.ts',
	'scripts/app/render.ts',
	'scripts/app/source.ts',
	'src/constants/Network.ts',
] as const

const sha256 = (source: string) => createHash('sha256').update(source).digest('hex')

const filesUnder = (rootPath: string, directoryPath = rootPath): string[] => readdirSync(directoryPath, {
	withFileTypes: true,
}).flatMap((entry) => {
	const absolutePath = path.join(directoryPath, entry.name)
	if (entry.isDirectory())
		return filesUnder(rootPath, absolutePath)
	if (entry.isFile())
		return [path.relative(rootPath, absolutePath)]

	return []
}).toSorted()

const fileHashes = (rootPath: string, paths: readonly string[]) => paths
	.map((relativePath) => [
		relativePath,
		sha256(readFileSync(path.join(rootPath, relativePath), 'utf8')),
	] as const)
	.toSorted(([left], [right]) => left.localeCompare(right, 'en'))

test('cold-reconstructs the generated product from only canonical and manual inputs', {
	timeout: 420_000,
}, () => {
	const isolatedRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-cold-reconstruction-'))
	const compiledApp = compileApp(app)
	const generatedSourceByPath = new Map(compiledApp.generatedFiles.map((generatedFile) => [
		generatedFile.path,
		renderGeneratedFile(generatedFile),
	]))
	const generatedPaths = [...generatedSourceByPath.keys()].toSorted()
	const manualInputPaths = [...new Set([...generatedSourceByPath.values()].flatMap((source) => (
		[...source.matchAll(/from '\$\/views\/([^']+\.svelte)'/g)].flatMap((match) => (
			match[1] == null ? [] : [`src/views/${match[1]}`]
		))
	)))].filter((inputPath) => !generatedSourceByPath.has(inputPath)).toSorted()
	const inputPaths = [
		...canonicalInputPaths,
		...manualInputPaths,
	].toSorted()
	const expectedGeneratedHashes = [...generatedSourceByPath]
		.map(([relativePath, source]) => [
			relativePath,
			sha256(source),
		] as const)
		.toSorted(([left], [right]) => left.localeCompare(right, 'en'))
	const runGenerator = (command: 'generate' | 'check') => {
		const result = spawnSync(process.execPath, [
			'--import',
			'tsx',
			'scripts/app/generate.ts',
			command,
		], {
			cwd: isolatedRoot,
			encoding: 'utf8',
			env: Object.fromEntries(Object.entries(process.env).filter(([name]) => name !== 'APP_GENERATED_OUTPUT_ROOT')),
			killSignal: 'SIGKILL',
			maxBuffer: 16 * 1024 * 1024,
			timeout: 180_000,
		})
		assert.equal(result.status, 0, [
			`cold generator ${command} failed`,
			result.error?.stack,
			result.stdout,
			result.stderr,
		].filter((line) => line != null && line !== '').join('\n'))
	}

	try {
		assert.deepEqual(manualInputPaths, ['src/views/BlockheadSessionActionsComposer.svelte'])
		assert.equal(inputPaths.length, 9)
		for (const inputPath of inputPaths) {
			mkdirSync(path.dirname(path.join(isolatedRoot, inputPath)), {
				recursive: true,
			})
			copyFileSync(path.join(root, inputPath), path.join(isolatedRoot, inputPath))
		}
		symlinkSync(path.join(root, 'node_modules'), path.join(isolatedRoot, 'node_modules'), 'dir')

		assert.deepEqual(filesUnder(isolatedRoot), inputPaths)
		const inputHashes = fileHashes(isolatedRoot, inputPaths)

		runGenerator('generate')
		assert.deepEqual(
			filesUnder(isolatedRoot).filter((relativePath) => !inputPaths.includes(relativePath)),
			generatedPaths
		)
		assert.deepEqual(fileHashes(isolatedRoot, generatedPaths), expectedGeneratedHashes)
		assert.deepEqual(fileHashes(isolatedRoot, inputPaths), inputHashes)
		const reconstructedHashes = fileHashes(isolatedRoot, [
			...inputPaths,
			...generatedPaths,
		])

		runGenerator('check')
		assert.deepEqual(fileHashes(isolatedRoot, [
			...inputPaths,
			...generatedPaths,
		]), reconstructedHashes)
	} finally {
		rmSync(isolatedRoot, {
			force: true,
			recursive: true,
		})
	}
})
