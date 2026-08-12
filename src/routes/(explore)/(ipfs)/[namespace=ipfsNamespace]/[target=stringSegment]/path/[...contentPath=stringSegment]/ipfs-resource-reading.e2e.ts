import { expect, test } from '@playwright/test'


const target = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a'
const contentPath = 'guides/readme.txt'

test('IPFS resource preserves CID identity while showing the gateway that served inspected content', async ({ page }, testInfo) => {
	test.setTimeout(180_000)
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `ipfs-resource-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route(`https://ipfs.io/ipfs/${target}/${contentPath}`, async (route) => {
		await route.fulfill({
			status: 503,
			body: 'unavailable',
		})
	})
	await page.route(`https://dweb.link/ipfs/${target}/${contentPath}`, async (route) => {
		await route.fulfill({
			contentType: 'text/plain',
			headers: {
				'content-length': '11',
			},
			body: 'hello ipfs',
		})
	})

	await page.goto(`/ipfs/${target}/path/${contentPath}`, {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main')).toContainText('Canonical URI', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText(`ipfs://${target}/${contentPath}`)
	await expect(page.locator('#main')).toContainText('https://dweb.link')
	await expect(page.locator('#main')).toContainText('text/plain')
	await expect(page.locator('#main')).toContainText('hello ipfs')
})
