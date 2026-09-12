import {
	createBrowserWASQLitePersistence,
	openBrowserWASQLiteOPFSDatabase,
} from '@tanstack/browser-db-sqlite-persistence'

import { BLOCKHEAD_WA_SQLITE_DATABASE_NAME } from '$/constants/Persistence.ts'
import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'

let persistenceRuntime: BrowserPersistenceRuntime | undefined
let databaseClose: Promise<void> | undefined = import.meta.hot?.data.databaseClose

export function getBrowserPersistenceRuntime() {
	const previousDatabaseClose = databaseClose
	persistenceRuntime ??= new BrowserPersistenceRuntime({
		name: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,
		openOwner: async () => {
			await previousDatabaseClose
			const database = await openBrowserWASQLiteOPFSDatabase({
				databaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,
			})
			return {
				persistence: createBrowserWASQLitePersistence({
					database,
					schemaMismatchPolicy: 'throw',
				}),
				close: () => database.close?.(),
			}
		},
	})
	return persistenceRuntime
}

export const releaseBrowserPersistenceRuntime = (runtime: BrowserPersistenceRuntime) => {
	if (runtime === persistenceRuntime) {
		persistenceRuntime = undefined
		databaseClose = Promise.all([databaseClose, runtime.close()]).then(() => {})
		return databaseClose
	}

	return runtime.close()
}

import.meta.hot?.dispose((data) => {
	data.databaseClose = persistenceRuntime === undefined ? databaseClose : releaseBrowserPersistenceRuntime(persistenceRuntime)
})
