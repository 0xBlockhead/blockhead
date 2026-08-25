import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

const cardUrl = 'https://example.com/e2e-probe'
const encodedCardUrl = encodeURIComponent(cardUrl)
const taskId = 'e2e-probe-taskId'

const installIsolatedDatabase = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `a2a-lifecycle-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
}

test('preserves canonical A2A parent identity across nested lifecycle routes', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	await installIsolatedDatabase(page, testInfo)
	const diagnostics = setupPageRuntimeDiagnostics(page)

	const cases = [
		{
			label: 'card service',
			pathname: `/agents/a2a/card/${encodedCardUrl}/service/jsonrpc/${encodeURIComponent('https://example.com/a2a')}`,
			expected: [cardUrl, 'jsonrpc', 'https://example.com/a2a'],
		},
		{
			label: 'task artifact',
			pathname: `/agents/a2a/task/${taskId}/artifact/e2e-artifact`,
			expected: [taskId, 'e2e-artifact'],
		},
		{
			label: 'task message part',
			pathname: `/agents/a2a/task/${taskId}/message/e2e-message/part/0`,
			expected: [taskId, 'e2e-message', 'part index 0'],
		},
		{
			label: 'task event',
			pathname: `/agents/a2a/task/${taskId}/event/0`,
			expected: [taskId, '0'],
		},
	] as const

	for (const routeCase of cases) {
		await test.step(routeCase.label, async () => {
			await diagnostics.step(page.goto(routeCase.pathname, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			for (const value of routeCase.expected)
				await expect(page.locator('#main')).toContainText(value)
		})
	}
})

test('rejects an invalid A2A child identity at the route boundary', async ({ page }, testInfo) => {
	await installIsolatedDatabase(page, testInfo)
	const response = await page.goto(`/agents/a2a/task/${taskId}/message/e2e-message/part/-1`, {
		waitUntil: 'domcontentloaded',
	})

	expect(response?.status()).toBe(404)
})
