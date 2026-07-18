import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { e2eProbeVitePlugin } from './_e2eProbeVitePlugin.ts'


test('injects probes at the async bootstrap lifecycle and fails closed on drift', () => {
	const transform = e2eProbeVitePlugin().transform
	if (typeof transform !== 'function')
		throw new Error('E2E probe transform must be a function')

	const source = readFileSync('src/routes/+layout.svelte', 'utf8')
	const transformed = transform(source, '/workspace/src/routes/+layout.svelte')

	assert.equal(typeof transformed, 'string')
	assert.match(transformed, /openBlockheadBrowserDatabase/)
	assert.match(transformed, /persistence: e2eInstrumentation\.persistence/)
	assert.match(transformed, /installAppClientProbe\(appClient\)/)
	assert.throws(
		() => transform(source.replace('return openBrowserWASQLiteOPFSDatabase', 'return missingDatabaseOpen'), '/workspace/src/routes/+layout.svelte'),
		/E2E probe injection anchor missing/
	)
})
