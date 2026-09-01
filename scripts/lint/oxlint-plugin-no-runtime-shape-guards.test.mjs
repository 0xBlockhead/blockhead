import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const oxlint = path.join(projectRoot, 'node_modules/.bin/oxlint')
const plugin = fileURLToPath(new URL('./oxlint-plugin-no-runtime-shape-guards.mjs', import.meta.url))

const lintFixture = (configPath, fixturePath) => spawnSync(
	oxlint,
	[
		'--config',
		configPath,
		'--disable-nested-config',
		fixturePath,
	],
	{
		cwd: projectRoot,
		encoding: 'utf8',
	}
)

test('the runtime-shape-guard rule rejects shape workarounds and permits environment checks', async () => {
	const fixtureDir = await mkdtemp(path.join(tmpdir(), 'blockhead-oxlint-shape-guards-'))
	try {
		const configPath = path.join(fixtureDir, '.oxlintrc.json')
		await writeFile(configPath, `${JSON.stringify({
			jsPlugins: [plugin],
			categories: {
				correctness: 'off',
				nursery: 'off',
				pedantic: 'off',
				perf: 'off',
				restriction: 'off',
				style: 'off',
				suspicious: 'off',
			},
			rules: {
				'no-runtime-shape-guards/guards': 'error',
			},
		}, null, '\t')}\n`)

		const rejectedPath = path.join(fixtureDir, 'rejected.ts')
		await writeFile(rejectedPath, `
declare const value: unknown
void (typeof value)
void Array.isArray(value)
void Array['isArray'](value)
void Reflect.get(value, 'field')
void Reflect['get'](value, 'field')
`)
		const rejected = lintFixture(configPath, rejectedPath)
		assert.notEqual(rejected.status, 0)
		assert.equal(
			(rejected.stdout + rejected.stderr).match(/Runtime shape guard/g)?.length,
			5
		)

		const permittedPath = path.join(fixtureDir, 'permitted.ts')
		await writeFile(permittedPath, `
declare const value: { field?: string }
void (typeof window)
void (typeof document.body)
void (typeof globalThis.location)
void Array.from([])
void value.field
`)
		const permitted = lintFixture(configPath, permittedPath)
		assert.equal(permitted.status, 0, permitted.stdout + permitted.stderr)
	} finally {
		await rm(fixtureDir, { recursive: true, force: true })
	}
})
