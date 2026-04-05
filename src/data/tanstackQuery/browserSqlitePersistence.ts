import type { PersistedCollectionPersistence } from '@tanstack/browser-db-sqlite-persistence'

/** Row shape for OPFS SQLite persistence (JSON object rows). */
export type SqlitePersistedRow = Record<string, unknown>

/** Argument for TanStack `persistedCollectionOptions({ schemaVersion })` (bump when persisted shape changes). */
export const SQLITE_COLLECTION_SCHEMA_VERSION = 1

/**
 * Shared OPFS handle: row type `Record<string, unknown>` matches
 * `persistedCollectionOptions<Record<string, unknown>, …>` without assertions.
 */
export let browserSqlitePersistence:
	| PersistedCollectionPersistence<SqlitePersistedRow, string>
	| undefined

export async function initBrowserSqlitePersistence(): Promise<void> {
	if (browserSqlitePersistence != null) return
	try {
		const { openBrowserWASQLiteOPFSDatabase, createBrowserWASQLitePersistence } = await import(
			'@tanstack/browser-db-sqlite-persistence',
		)
		const database = await openBrowserWASQLiteOPFSDatabase({
			databaseName: 'blockhead-2026.sqlite',
		})
		browserSqlitePersistence = createBrowserWASQLitePersistence<SqlitePersistedRow, string>({
			database,
		})
	} catch (error) {
		// Worker `error` → PersistenceUnavailableError ("OPFS worker terminated unexpectedly").
		// OPFS sync access handles + wa-sqlite also fail without a capable browser / CSP / worker URL.
		if (import.meta.env.DEV)
			console.warn('[blockhead] SQLite OPFS persistence unavailable; using in-memory collections only.', error)
	}
}
