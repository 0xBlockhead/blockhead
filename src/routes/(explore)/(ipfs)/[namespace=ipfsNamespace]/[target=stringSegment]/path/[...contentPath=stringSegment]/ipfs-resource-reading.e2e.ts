import { expect, test } from '@playwright/test'

const target = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a'
const contentPath = 'guides/readme.txt'

for (const fixture of [
	{ name: 'preserves CID identity while showing the gateway that served inspected content', status: 200, body: 'hello ipfs' },
	{ name: 'reports all gateways unavailable without a successful capture', status: 503, body: 'unavailable' },
]) {
test(`IPFS resource ${fixture.name}`, async ({ page }, testInfo) => {
	test.setTimeout(180_000)
	const gatewayRequests: string[] = []
	const runtimeErrors: string[] = []
	page.on('pageerror', (error) => runtimeErrors.push(error.stack ?? error.message))
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `ipfs-resource-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route('**/*', async (route) => {
		const decodedUrl = decodeURIComponent(route.request().url())
		const gatewayUrlStart = decodedUrl.lastIndexOf('/https://') + 1
		const gatewayUrl = gatewayUrlStart === 0 ? decodedUrl : decodedUrl.slice(gatewayUrlStart)
		if (gatewayUrl === `https://ipfs.io/ipfs/${target}/${contentPath}`) {
			gatewayRequests.push(`${route.request().url()} => 503 unavailable`)
			await route.fulfill({
				status: 503,
				body: 'unavailable',
			})
			return
		}
		if (gatewayUrl === `https://dweb.link/ipfs/${target}/${contentPath}`) {
			gatewayRequests.push(`${route.request().url()} => ${fixture.status} ${fixture.body}`)
			await route.fulfill({
				status: fixture.status,
				contentType: 'text/plain',
				body: fixture.body,
			})
			return
		}
		await route.fallback()
	})

	await page.goto(`/ipfs/${target}/path/${contentPath}`, {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main')).toContainText('Canonical URI', {
		timeout: 120_000,
	})
	if (fixture.status === 503) {
		await expect(page.locator('#main [role="alert"]').filter({ hasText: 'Failed to load' }).first()).toBeVisible()
		await expect(page.locator('#main [role="alert"]').first()).toHaveAttribute('aria-label', /https:\/\/ipfs.io \(503.*https:\/\/dweb.link \(503/)
		await expect(page.locator(`#main a[href^="/ipfs/captures/${target}/"]`)).toHaveCount(0)
		await expect(page.locator('#main')).not.toContainText('hello ipfs')
		await page.screenshot({ path: testInfo.outputPath('ipfs-all-unavailable.png'), fullPage: true })
		return
	}
	await expect(page.locator('#main')).toContainText(`ipfs://${target}/${contentPath}`)
	const captureLink = page.locator(`#main a[href^="/ipfs/captures/${target}/"]`).first()
	const before = {
		url: page.url(),
		href: await captureLink.getAttribute('href'),
		rows: await page.locator(`#main a[href^="/ipfs/captures/${target}/"]`).evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), text: link.textContent }))),
		dom: await page.locator('#main').innerHTML(),
		gatewayRequests,
	}
	await testInfo.attach('capture-before.json', { body: JSON.stringify(before, null, 2), contentType: 'application/json' })
	await captureLink.click()
	try {
	await expect(page.locator('#main')).toContainText('https://dweb.link')
	await expect(page.locator('#main')).toContainText('text/plain')
	await expect(page.locator('#main')).toContainText('hello ipfs')
	await page.screenshot({
		path: testInfo.outputPath('ipfs-resource-live-gateway.png'),
		fullPage: true,
	})
	} finally {
		await testInfo.attach('capture-after.json', {
			body: JSON.stringify({ url: page.url(), dom: await page.locator('#main').innerHTML(), runtimeErrors, gatewayRequests }, null, 2),
			contentType: 'application/json',
		})
	}
})
}
