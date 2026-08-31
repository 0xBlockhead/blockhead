import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import {
	partitionTypeScriptRoots,
	readCanonicalFileManifest,
} from './svelte-check.mjs'


const projectRoot = path.resolve(import.meta.dirname, '../..')
const tsconfigPath = path.join(projectRoot, 'tsconfig.e2e.json')

test('the E2E type project contains authored roots without generated route roots', async () => {
	const config = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'))
	assert.equal(config.include.some((pattern) => pattern.includes('.svelte-kit/types')), false)
	assert.equal(config.include.includes('src/**/*.e2e.ts'), true)
	assert.equal(config.include.includes('tests/**/*.ts'), true)
	assert.equal(config.include.includes('src/routes/api/e2e/**/*.ts'), false)

	const manifest = readCanonicalFileManifest(projectRoot, tsconfigPath)
	assert.equal(manifest.typeScriptRoots.length > 0, true)
	assert.equal(
		manifest.typeScriptRoots.some((filePath) => filePath.includes(`${path.sep}.svelte-kit${path.sep}types${path.sep}`)),
		false
	)
	assert.equal(
		manifest.typeScriptRoots.some((filePath) => filePath.endsWith(`${path.sep}_runProbes.ts`)),
		false
	)
	assert.equal(
		manifest.typeScriptRoots.some((filePath) => filePath.includes(`${path.sep}src${path.sep}routes${path.sep}api${path.sep}e2e${path.sep}`)),
		false
	)
})

test('E2E type shards assign every authored root exactly once', async () => {
	const roots = readCanonicalFileManifest(projectRoot, tsconfigPath).typeScriptRoots
	const shards = await partitionTypeScriptRoots(roots, 64)
	const assigned = shards.flatMap((shard) => shard.roots)
	assert.deepEqual([...assigned].sort(), [...roots].sort())
	assert.equal(new Set(assigned).size, roots.length)
})
