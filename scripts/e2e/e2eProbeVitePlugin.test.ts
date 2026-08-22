import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { e2eProbeVitePlugin } from '../../tests/e2e/_e2eProbeVitePlugin.ts'


test('keys clean E2E database opens and owner election to the same profile identity', () => {
	const transform = e2eProbeVitePlugin().transform
	if (typeof transform !== 'function')
		throw new Error('E2E probe transform must be a function')

	const source = readFileSync('src/routes/+layout.svelte', 'utf8')
	const probeSource = readFileSync('tests/e2e/$e2eProbe.ts', 'utf8')
	const transformed = transform(source, '/workspace/src/routes/+layout.svelte')

	assert.equal(typeof transformed, 'string')
	assert.match(
		transformed,
		/name: e2eDatabaseName\(BLOCKHEAD_WA_SQLITE_DATABASE_NAME\)/
	)
	assert.equal(
		transformed.match(/e2eDatabaseName\(BLOCKHEAD_WA_SQLITE_DATABASE_NAME\)/g)?.length,
		2
	)
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
		() => transform(source.replace('name: BLOCKHEAD_WA_SQLITE_DATABASE_NAME', 'name: missingDatabaseName'), '/workspace/src/routes/+layout.svelte'),
		/E2E probe injection anchor missing/
	)
})
