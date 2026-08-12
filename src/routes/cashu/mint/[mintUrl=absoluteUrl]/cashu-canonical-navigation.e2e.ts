import { expect, test } from '@playwright/test'


const mintUrl = 'https://8333.space:3338'
const mintPath = `/cashu/mint/${encodeURIComponent(mintUrl)}`
const keysetId = '009a1f293253e41e'

test('navigates from the mint hierarchy to a keyset without losing the opaque URL selector', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-cashu-route-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route('**/api-proxy/**', async (route) => {
		const upstreamUrl = decodeURIComponent(route.request().url().split('/').at(-1) ?? '')
		if (upstreamUrl.endsWith('/v1/keysets')) {
			await route.fulfill({
				json: {
					keysets: [{
						id: keysetId,
						unit: 'sat',
						active: true,
					}],
				},
			})
			return
		}

		await route.fulfill({
			json: {
				keysets: [{
					id: keysetId,
					unit: 'sat',
					active: true,
					keys: {
						1: `02${'11'.repeat(32)}`,
					},
				}],
			},
		})
	})

	await page.goto(mintPath)
	const keysetLink = page.getByRole('link', { name: keysetId }).first()
	await expect(keysetLink).toHaveAttribute(
		'href',
		`${mintPath}/keyset/${keysetId}`,
		{ timeout: 120_000 }
	)
	await page.goto(`${mintPath}/keyset/${keysetId}`)
	await expect(page).toHaveURL(`${mintPath}/keyset/${keysetId}`)
	await expect(page.getByRole('heading', { name: keysetId })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('sat', { exact: true }).first()).toBeVisible()
})
