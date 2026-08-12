import { expect, test } from '@playwright/test'


const reference = '8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1'
const contentPath = 'guides/readme.txt'

test('Swarm resource preserves bzz identity while showing the gateway that served inspected content', async ({ page }, testInfo) => {
	test.setTimeout(180_000)
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `swarm-resource-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route(`https://gateway.ethswarm.org/bzz/${reference}/${contentPath}`, async (route) => {
		await route.fulfill({
			status: 503,
			body: 'unavailable',
		})
	})
	await page.route(`https://bzz.link/bzz/${reference}/${contentPath}`, async (route) => {
		await route.fulfill({
			contentType: 'text/plain',
			headers: {
				'content-length': '11',
			},
			body: 'hello swarm',
		})
	})

	await page.goto(`/swarm/${reference}/path/${contentPath}`, {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main')).toContainText('Canonical URI', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText(`bzz://${reference}/${contentPath}`)
	await expect(page.locator('#main')).toContainText('https://bzz.link')
	await expect(page.locator('#main')).toContainText('text/plain')
	await expect(page.locator('#main')).toContainText('hello swarm')
	await expect(page.getByRole('link', { name: 'Download resolved text' })).toHaveAttribute('download', 'swarm-resource.txt')
})
