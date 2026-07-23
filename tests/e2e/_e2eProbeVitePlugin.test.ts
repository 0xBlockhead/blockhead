import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { e2eProbeVitePlugin } from './_e2eProbeVitePlugin.ts'


test('injects observational probes at the async bootstrap lifecycle and fails closed on drift', () => {
	const transform = e2eProbeVitePlugin().transform
	if (typeof transform !== 'function')
		throw new Error('E2E probe transform must be a function')

	const source = readFileSync('src/routes/+layout.svelte', 'utf8')
	const probeSource = readFileSync('tests/e2e/$e2eProbe.ts', 'utf8')
	const transformed = transform(source, '/workspace/src/routes/+layout.svelte')

	assert.equal(typeof transformed, 'string')
	assert.match(transformed, /openBlockheadBrowserDatabase/)
	assert.match(transformed, /createE2EClientInstrumentation\([\s\S]+?\)\.persistence/)
	assert.match(transformed, /waitForPersistence,/)
	assert.match(transformed, /installAppClientProbe\(appClient\)/)
	assert.match(probeSource, /await collectionPersistence\.adapter\.applyCommittedTx\(collectionId, tx\)/)
	assert.doesNotMatch(
		probeSource,
		/persistenceQueue|runSerializedPersistence|pendingPersistenceByCollection|transactionComplete/
	)
	assert.throws(
		() => transform(source.replace('return openBrowserWASQLiteOPFSDatabase', 'return missingDatabaseOpen'), '/workspace/src/routes/+layout.svelte'),
		/E2E probe injection anchor missing/
	)
})
