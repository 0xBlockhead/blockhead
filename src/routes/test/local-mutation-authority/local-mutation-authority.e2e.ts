import {
	expect,
	test,
} from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'


const openFixture = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `local-mutation-authority-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}`,
		schemaVersion: Date.now(),
	})
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnTanStackWarnings: true,
	})
	await diagnostics.step(page.goto('/test/local-mutation-authority', {
		waitUntil: 'domcontentloaded',
		timeout: 120_000,
	}))
	await expectMainVisible(page, 120_000, diagnostics)

	return diagnostics
}

test('runtime session authority survives re-entry and deletes atomically', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	await expect(page.getByTestId('session-awaited')).toBeAttached()

	await diagnostics.step(page.getByRole('button', {
		name: 'Create sessions',
	}).click())
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session A')
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session B')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session A')
	await expect(page.getByTestId('session-awaited')).toContainText('Authority Session B')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session A')

	await diagnostics.step(page.getByRole('button', {
		name: 'Delete first session',
	}).click())
	await expect(page.getByTestId('session-direct')).not.toContainText('Authority Session A')
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).not.toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).not.toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session B')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('session-direct')).toHaveText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).toHaveText('Authority Session B')
	await expect(page.locator('#local-authority-sessions')).not.toContainText('Authority Session A')
	await expect(page.locator('#main')).not.toContainText('Local_Internal')
})

test('runtime wallet authority survives re-entry and deletes atomically', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	await expect(page.getByTestId('wallet-awaited')).toBeAttached()

	await diagnostics.step(page.getByRole('button', {
		name: 'Create wallet connections',
	}).click())
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-b')
	await expect(page.getByTestId('wallet-awaited')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-hydration-wallet')).toHaveText('authority-wallet-a')
	await expect(page.getByTestId('wallet-hydration-active-account')).toHaveText(
		'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	)
	await expect(page.getByTestId('wallet-hydration-account-count')).toHaveText('1')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-awaited')).toContainText('authority-connection-b')
	await expect(page.getByTestId('wallet-hydration-wallet')).toHaveText('authority-wallet-a')
	await expect(page.getByTestId('wallet-hydration-active-account')).toHaveText(
		'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	)
	await expect(page.getByTestId('wallet-hydration-account-count')).toHaveText('1')

	await diagnostics.step(page.getByRole('button', {
		name: 'Delete first wallet connection',
	}).click())
	await expect(page.getByTestId('wallet-direct')).not.toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-b')
	await expect(page.getByTestId('wallet-awaited')).not.toContainText('authority-connection-a')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('wallet-direct')).toHaveText('authority-connection-b')
	await expect(page.getByTestId('wallet-awaited')).toHaveText('authority-connection-b')
	await expect(page.locator('#main')).not.toContainText('Local_Internal')
})
