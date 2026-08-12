import { expect, test } from '@playwright/test'


const registryServerName = 'ac.inference.sh/mcp'
const packagePath = `/mcp/package/registry/${encodeURIComponent(registryServerName)}`

test('preserves registry identity through package and exact version metadata without invoking the server', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-mcp-registry-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.goto(packagePath)
	await expect(page.getByRole('heading', { name: 'inference.sh' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText(registryServerName, { exact: true })).toBeVisible()

	await page.goto(`${packagePath}/version/1.0.0`)
	await expect(page.getByRole('heading', { name: '1.0.0' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('active', { exact: true }).first()).toBeVisible()
	await expect(page.getByText('4/13/2026, 10:32:20 AM', { exact: true })).toBeVisible()
})
