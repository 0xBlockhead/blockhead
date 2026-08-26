import type { Plugin } from 'vite'


export const e2eProbeVitePlugin = () => ({
	name: 'blockhead-e2e-probe',
	enforce: 'pre',
	transform: (source, id) => {
		if (id.endsWith('/src/lib/db/browserPersistenceSingleton.ts')) {
			for (const expected of [
				"import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'\n",
				'\t\tname: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,',
				'\t\t\tconst database = await openBrowserWASQLiteOPFSDatabase({\n\t\t\t\tdatabaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,\n\t\t\t})',
			]) {
				if (!source.includes(expected))
					throw new Error(`E2E probe injection anchor missing from src/lib/db/browserPersistenceSingleton.ts: ${expected}`)
			}

			return source
				.replace(
					"import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'\n",
					"import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'\nimport {\n\te2eDatabaseName,\n\te2eVfsName,\n\topenBlockheadBrowserDatabase,\n} from '/tests/e2e/$e2eDatabaseRuntime.ts'\n"
				)
				.replace(
					'\t\tname: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,',
					'\t\tname: e2eDatabaseName(BLOCKHEAD_WA_SQLITE_DATABASE_NAME),'
				)
				.replace(
					'\t\t\tconst database = await openBrowserWASQLiteOPFSDatabase({\n\t\t\t\tdatabaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,\n\t\t\t})',
					'\t\t\tconst database = await openBlockheadBrowserDatabase({\n\t\t\t\tdatabaseName: e2eDatabaseName(BLOCKHEAD_WA_SQLITE_DATABASE_NAME),\n\t\t\t\tvfsName: e2eVfsName(),\n\t\t\t})'
				)
		}

		if (id.endsWith('/src/routes/applicationClientBootstrap.ts')) {
			for (const expected of [
				"} from '$/client/$client.svelte.ts'\n",
				'\t\t\tpersistence,\n\t\t\tschemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,',
				'\t\t\tschemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,',
				'\treturn client(',
				'\t)\n}',
			]) {
				if (!source.includes(expected))
					throw new Error(`E2E probe injection anchor missing from src/routes/applicationClientBootstrap.ts: ${expected}`)
			}

			return source
				.replace(
					"} from '$/client/$client.svelte.ts'\n",
					"} from '$/client/$client.svelte.ts'\nimport {\n\tcreateE2EClientInstrumentation,\n\te2eSchemaVersion,\n\tinstallAppClientProbe,\n} from '/tests/e2e/$e2eProbe.ts'\n"
				)
				.replace(
					'\t\t\tpersistence,\n\t\t\tschemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,',
					'\t\t\tpersistence: createE2EClientInstrumentation(persistence).persistence,\n\t\t\tschemaVersion: e2eSchemaVersion(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION),'
				)
				.replace('\treturn client(', '\tconst appClient = client(')
				.replace('\t)\n}', '\t)\n\tinstallAppClientProbe(appClient)\n\n\treturn appClient\n}')
		}
	},
}) satisfies Plugin
