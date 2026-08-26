import {
	openBrowserWASQLiteOPFSDatabase,
	type BrowserWASQLiteDatabase,
} from '@tanstack/browser-db-sqlite-persistence'
import {
	e2eProfileDatabaseName,
	e2eProfileVfsName,
} from './$e2eDatabaseProfile.ts'


declare global {
	interface Window {
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadWaSqliteVfsNameOverride?: string
		__blockheadWaSqliteDatabasePromiseByKey?: Record<string, Promise<BrowserWASQLiteDatabase>>
	}
}

export const e2eDatabaseName = (
	defaultDatabaseName: string
) => (
	typeof window !== 'undefined' ?
		window.__blockheadWaSqliteDatabaseNameOverride == null ?
			defaultDatabaseName
		:
			e2eProfileDatabaseName(window.__blockheadWaSqliteDatabaseNameOverride)
	:
		defaultDatabaseName
)

export const e2eVfsName = (
	defaultVfsName?: string
) => (
	typeof window !== 'undefined' ?
		window.__blockheadWaSqliteVfsNameOverride == null ?
			defaultVfsName
		:
			e2eProfileVfsName(window.__blockheadWaSqliteVfsNameOverride)
	:
		defaultVfsName
)

export const openBlockheadBrowserDatabase = (
	options: {
		databaseName: string
		vfsName?: string
	}
) => {
	const key = `${options.vfsName ?? 'opfs'}:${options.databaseName}`
	const openDatabase = () => openBrowserWASQLiteOPFSDatabase(options)
	if (typeof window === 'undefined')
		return openDatabase()

	window.__blockheadWaSqliteDatabasePromiseByKey ??= {}
	window.__blockheadWaSqliteDatabasePromiseByKey[key] ??= openDatabase()
	return window.__blockheadWaSqliteDatabasePromiseByKey[key]
}
