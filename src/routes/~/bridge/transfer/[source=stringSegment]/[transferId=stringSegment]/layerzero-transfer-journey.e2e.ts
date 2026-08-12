import { expect, test } from '@playwright/test'


test('renders a current LayerZero transfer and source-clocked lifecycle observation', async ({ page, request }, testInfo) => {
	testInfo.setTimeout(180_000)
	const latestResponse = await request.get('https://scan.layerzero-api.com/v1/messages/latest?limit=1')
	expect(latestResponse.ok()).toBe(true)
	const latest = await latestResponse.json() as {
		data: [{
			guid: string
			updated: string
		}]
	}
	expect(latest.data).toHaveLength(1)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-layerzero-transfer-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto(
		`/~/bridge/transfer/${encodeURIComponent('LayerZeroScan_Rest')}/${encodeURIComponent(latest.data[0].guid)}`
	)
	await expect(page.getByRole('heading', { name: latest.data[0].guid })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('LayerZeroScan_Rest', { exact: true }).first()).toBeVisible()
	const observationClockHeading = page.getByRole('heading', {
		level: 4,
		name: /^\d{13}$/,
	})
	await expect(observationClockHeading).toBeAttached()
	expect(Number(await observationClockHeading.textContent())).toBeGreaterThanOrEqual(Date.parse(latest.data[0].updated))
})
