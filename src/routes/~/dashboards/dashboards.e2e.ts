import { expect, test } from '@playwright/test'
import type { BrowserContext, TestInfo } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'


const installIsolatedLocalDatabase = async (
	context: BrowserContext,
	testInfo: TestInfo
) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-dashboard-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
}


test('creates a local dashboard with a named workspace and empty root panel', async ({ context, page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await installIsolatedLocalDatabase(context, testInfo)
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/dashboards', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByLabel('Workspace name').fill('Research board')
	await page.getByRole('button', {
		name: 'Create dashboard',
	}).click()
	await expect(page).toHaveURL(/\/~\/dashboard\/dashboard-/)
	await expect(page.locator('#main')).toContainText('panels (1)')
	await expect(page.locator('#main')).toContainText('empty 0')
	await page.locator('#main a[href*="/~\/workspace/"]').click()
	await expect(page).toHaveURL(/\/~\/workspace\/workspace-/)
	await expect(page.locator('#main')).toContainText('Research board', {
		timeout: 120_000,
	})
	await page.locator('#main a[href*="/~\/dashboard/"]').click()
	await expect(page).toHaveURL(/\/~\/dashboard\/dashboard-/)
	await expect(page.locator('#main')).toContainText('empty 0')

	await diagnostics.step(page.reload({
		waitUntil: 'load',
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.locator('#main')).toContainText('empty 0')
})
