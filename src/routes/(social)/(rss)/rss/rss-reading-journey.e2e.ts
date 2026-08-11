import { expect, test, type Page } from '@playwright/test'


const feedUrl = 'https://hnrss.org/frontpage'
const feedPath = `/rss/feed/${encodeURIComponent(feedUrl)}`

const installRssFixture = async (page: Page) => {
	await page.route('**/api-proxy/**', async (route) => {
		if (route.request().url().includes('api.rss2json.com')) {
			await route.fulfill({
				json: {
					status: 'ok',
					feed: {
						title: 'Deterministic RSS feed',
						link: 'https://example.com/',
					},
					items: [{
						title: 'Deterministic item',
						guid: 'deterministic-item',
						link: 'https://example.com/items/1',
					}],
				},
			})
			return
		}

		await route.fulfill({
			contentType: 'application/rss+xml',
			body: `
				<rss version="2.0">
					<channel>
						<title>Deterministic RSS feed</title>
						<link>https://example.com/</link>
						<item>
							<title>Deterministic item</title>
							<guid>deterministic-item</guid>
							<link>https://example.com/items/1</link>
						</item>
					</channel>
				</rss>
			`,
		})
	})
}

test.describe('RSS reading journey', () => {
	test('successful feed reads expose their source-owned observation list', async ({ page }) => {
		test.setTimeout(180_000)
		await installRssFixture(page)
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#main')).toContainText('Deterministic RSS feed', {
			timeout: 120_000,
		})
		await expect(page.getByRole('heading', { name: /^Observations/ })).toBeVisible()
		await expect(page.locator('#timestamps').getByRole('listitem')).toHaveCount(2)
		await expect(page.locator('#timestamps')).toContainText(feedUrl)
	})

	test('feedUrl itemIdentityKind itemIdentity remain the canonical route identity', async ({ page }) => {
		test.setTimeout(180_000)
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		await expect(page).toHaveURL((url) => url.pathname === feedPath)
		await expect(page.locator('#main')).toContainText(feedUrl, {
			timeout: 120_000,
		})
		await expect(page.locator('#main a[href^="/rss/item/"], #main a[href*="/feedKey/"]')).toHaveCount(0)
	})

	test('feed to item follows summary cards into a readable detail', async ({ page }) => {
		test.setTimeout(180_000)
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		const item = page.locator(`#main a[href^="${feedPath}/item/"]`).first()
		await expect(item).toBeVisible({
			timeout: 120_000,
		})
		const itemPath = await item.getAttribute('href')
		expect(itemPath).not.toBeNull()
		await item.click()

		await expect(page).toHaveURL((url) => url.pathname === itemPath)
		await expect(page.locator('#main')).toContainText('RSS item')
		await expect(page.locator('#main a[href^="http"]').first()).toBeVisible()
	})

	test('back navigation preserves feed context', async ({ page }) => {
		test.setTimeout(180_000)
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		const item = page.locator(`#main a[href^="${feedPath}/item/"]`).first()
		await expect(item).toBeVisible({
			timeout: 120_000,
		})
		const itemTitle = await item.textContent()
		await item.click()
		await expect(page).toHaveURL(/\/rss\/feed\/.+\/item\/(Guid|Link)\//)

		await page.goBack({ waitUntil: 'domcontentloaded' })
		await expect(page).toHaveURL((url) => url.pathname === feedPath)
		await expect(page.locator(`#main a[href^="${feedPath}/item/"]`).filter({
			hasText: itemTitle ?? '',
		}).first()).toBeVisible()
	})
})
