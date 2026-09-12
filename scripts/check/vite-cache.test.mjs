import assert from 'node:assert/strict'
import { realpathSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { loadConfigFromFile } from 'vite'

test('Vite dependency caches belong to the checkout, not shared node_modules', async () => {
	const root = path.resolve(import.meta.dirname, '../..')
	const loaded = await loadConfigFromFile({ command: 'serve', mode: 'development' }, path.join(root, 'vite.config.ts'))
	assert.ok(loaded)
	assert.equal(loaded.config.cacheDir, path.join(root, '.svelte-kit/cache/vite'))
	assert.equal(path.relative(realpathSync(path.join(root, 'node_modules')), loaded.config.cacheDir).startsWith('..'), true)
})
