import type { Plugin } from 'vite'


export const e2eProbeVitePlugin = () => ({
	name: 'blockhead-e2e-probe',
	enforce: 'pre',
	transform: (source, id) => {
		if (!id.endsWith('/src/routes/+layout.svelte'))
			return

		for (const expected of [
			"\t} from '$/client/$client.svelte.ts'\n",
			'\tconst database = await openBrowserWASQLiteOPFSDatabase({\n\t\tdatabaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,\n\t})',
			"\tconst persistence = createBrowserWASQLitePersistence({\n\t\tdatabase,\n\t\tschemaMismatchPolicy: 'reset',\n\t})",
			'\t\t\tpersistence,\n\t\t\tschemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,',
			'\t$effect(() => (',
		]) {
			if (!source.includes(expected))
				throw new Error(`E2E probe injection anchor missing from src/routes/+layout.svelte: ${expected}`)
		}

		return source
			.replace(
				"\t} from '$/client/$client.svelte.ts'\n",
				"\t} from '$/client/$client.svelte.ts'\n\timport {\n\t\tcreateE2EClientInstrumentation,\n\t\te2eDatabaseName,\n\t\te2eSchemaVersion,\n\t\te2eVfsName,\n\t\tinstallAppClientProbe,\n\t\topenBlockheadBrowserDatabase,\n\t} from '/tests/e2e/$e2eProbe.ts'\n"
			)
			.replace(
				'\tconst database = await openBrowserWASQLiteOPFSDatabase({\n\t\tdatabaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,\n\t})',
				'\tconst database = await openBlockheadBrowserDatabase({\n\t\tdatabaseName: e2eDatabaseName(BLOCKHEAD_WA_SQLITE_DATABASE_NAME),\n\t\tvfsName: e2eVfsName(),\n\t})'
			)
			.replace(
				"\tconst persistence = createBrowserWASQLitePersistence({\n\t\tdatabase,\n\t\tschemaMismatchPolicy: 'reset',\n\t})",
				"\tconst basePersistence = createBrowserWASQLitePersistence({\n\t\tdatabase,\n\t\tschemaMismatchPolicy: 'reset',\n\t})\n\tconst e2eInstrumentation = createE2EClientInstrumentation(basePersistence)"
			)
			.replace(
				'\t\t\tpersistence,\n\t\t\tschemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,',
				'\t\t\tpersistence: e2eInstrumentation.persistence,\n\t\t\tschemaVersion: e2eSchemaVersion(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION),\n\t\t\twaitForPersistence: e2eInstrumentation.waitForPersistence,'
			)
			.replace(
				'\t$effect(() => (',
				'\tinstallAppClientProbe(appClient)\n\n\t$effect(() => ('
			)
	},
}) satisfies Plugin
