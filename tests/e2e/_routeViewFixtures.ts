import type { Page } from '@playwright/test'

/** Install the isolated browser database used by route-view journeys. */
export const installRouteViewSqliteIsolation = async (
	page: Page,
	name: string
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name,
		schemaVersion: Date.now(),
	})
}
