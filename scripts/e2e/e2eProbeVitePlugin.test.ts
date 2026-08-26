import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { e2eProbeVitePlugin } from '../../tests/e2e/_e2eProbeVitePlugin.ts'
import {
	e2eProfileDatabaseName,
	e2eProfileVfsName,
} from '../../tests/e2e/$e2eDatabaseProfile.ts'


test('compacts E2E database profiles below wa-sqlite’s pathname limit', () => {
	const profile = 'blockhead-wallet-request-consent-0-0-1787371511508.sqlite'
	const databaseName = e2eProfileDatabaseName(profile)
	const vfsName = e2eProfileVfsName(profile)

	assert.equal(e2eProfileDatabaseName(profile), databaseName)
	assert.equal(e2eProfileVfsName(profile), vfsName)
	assert.notEqual(e2eProfileDatabaseName(`${profile}-other`), databaseName)
	assert.ok(`file:${databaseName}?vfs=${encodeURIComponent(vfsName)}`.length <= 64)
})


test('keys clean E2E database opens and owner election to the same profile identity', () => {
	const transform = e2eProbeVitePlugin().transform
	if (typeof transform !== 'function')
		throw new Error('E2E probe transform must be a function')

	const persistenceSource = readFileSync('src/lib/db/browserPersistenceSingleton.ts', 'utf8')
	const bootstrapSource = readFileSync('src/routes/applicationClientBootstrap.ts', 'utf8')
	const probeSource = readFileSync('tests/e2e/$e2eProbe.ts', 'utf8')
	const transformedPersistence = transform(persistenceSource, '/workspace/src/lib/db/browserPersistenceSingleton.ts')
	const transformedBootstrap = transform(bootstrapSource, '/workspace/src/routes/applicationClientBootstrap.ts')

	assert.equal(typeof transformedPersistence, 'string')
	assert.equal(typeof transformedBootstrap, 'string')
	assert.match(
		transformedPersistence,
		/name: e2eDatabaseName\(BLOCKHEAD_WA_SQLITE_DATABASE_NAME\)/
	)
	assert.equal(
		transformedPersistence.match(/e2eDatabaseName\(BLOCKHEAD_WA_SQLITE_DATABASE_NAME\)/g)?.length,
		2
	)
	assert.match(transformedPersistence, /openBlockheadBrowserDatabase/)
	assert.match(transformedPersistence, /\/tests\/e2e\/\$e2eDatabaseRuntime\.ts/)
	assert.doesNotMatch(transformedPersistence, /\/tests\/e2e\/\$e2eProbe\.ts/)
	assert.match(transformedBootstrap, /createE2EClientInstrumentation\(persistence\)\.persistence/)
	assert.match(transformedBootstrap, /waitForPersistence,/)
	assert.match(transformedBootstrap, /installAppClientProbe\(appClient\)/)
	assert.match(probeSource, /await collectionPersistence\.adapter\.applyCommittedTx\(collectionId, tx\)/)
	assert.doesNotMatch(
		probeSource,
		/persistenceQueue|runSerializedPersistence|pendingPersistenceByCollection|transactionComplete/
	)
	assert.throws(
		() => transform(persistenceSource.replace('\t\tname: BLOCKHEAD_WA_SQLITE_DATABASE_NAME', '\t\tname: missingDatabaseName'), '/workspace/src/lib/db/browserPersistenceSingleton.ts'),
		/E2E probe injection anchor missing/
	)
	assert.throws(
		() => transform(bootstrapSource.replace('\treturn client(', '\treturn missingClient('), '/workspace/src/routes/applicationClientBootstrap.ts'),
		/E2E probe injection anchor missing/
	)
})
