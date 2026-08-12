import { expect, test } from '@playwright/test'


const transactionId = 'A'.repeat(43)
const contentPath = 'demo.txt'
const observedAtMs = '1735689600000'
const resourcePath = `/arweave/resource/${transactionId}/${contentPath}/observations/${observedAtMs}/Arweave_Rest`

test('Arweave resource observation renders gateway provenance and inspected content', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route(`https://arweave.net/${transactionId}/${contentPath}`, async (route) => {
		await route.fulfill({
			contentType: 'text/plain',
			headers: {
				'content-length': '13',
			},
			body: 'hello arweave',
		})
	})

	await page.goto(resourcePath, { waitUntil: 'domcontentloaded' })

	await expect(page.locator('#main')).toContainText('gateway origin', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('https://arweave.net')
	await expect(page.locator('#main')).toContainText('reachable')
	await expect(page.locator('#main')).toContainText('text/plain')
	await expect(page.locator('#main')).toContainText('hello arweave')
})
