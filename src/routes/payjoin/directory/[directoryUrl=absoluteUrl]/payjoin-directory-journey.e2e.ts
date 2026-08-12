import { expect, test } from '@playwright/test'


test('renders public Payjoin directory OHTTP key provenance without starting negotiation', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-payjoin-directory-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto(`/payjoin/directory/${encodeURIComponent('https://payjo.in')}`)
	await expect(page.getByRole('heading', { name: 'https://payjo.in' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('https://payjo.in/.well-known/ohttp-gateway', { exact: true }).first()).toBeVisible()
	await expect(page.getByText('ohttp key config', { exact: true })).toBeVisible()
})
