import {
	createBrowserWASQLitePersistence,
	openBrowserWASQLiteOPFSDatabase,
} from '@tanstack/browser-db-sqlite-persistence'

import { BLOCKHEAD_WA_SQLITE_DATABASE_NAME } from '$/constants/Persistence.ts'
import { BrowserPersistenceRuntime } from './browserPersistenceRuntime.ts'

let persistenceRuntime: BrowserPersistenceRuntime | undefined

export function getBrowserPersistenceRuntime() {
	persistenceRuntime ??= new BrowserPersistenceRuntime({
		name: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,
		openOwner: async () => {
			await import.meta.hot?.data.databaseClose
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

import.meta.hot?.dispose((data) => {
	data.databaseClose = persistenceRuntime?.close()
})
