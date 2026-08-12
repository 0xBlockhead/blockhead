import { expect, test, type Page } from '@playwright/test'


const feedUrl = 'https://hnrss.org/frontpage'
const feedPath = `/rss/feed/${encodeURIComponent(feedUrl)}`

const installRssFixture = async (page: Page) => {
	await page.route('**/api-proxy/**', async (route) => {
		if (route.request().url().includes('api.rss2json.com')) {
			const providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
			const requestedFeedUrl = providerUrl.searchParams.get('rss_url')
			if (requestedFeedUrl == null)
				throw new Error('RSS2JSON fixture missing requested feed URL')
			await route.fulfill({
				json: {
					status: 'ok',
					feed: {
						title: 'Deterministic RSS feed',
						link: 'https://example.com/',
						url: requestedFeedUrl,
					},
					items: [{
						title: 'Deterministic item',
						guid: 'deterministic-item',
						link: 'https://example.com/items/1',
						description: 'Deterministic summary',
						content: 'Deterministic full text',
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
							<description>Deterministic summary</description>
							<content:encoded><![CDATA[Deterministic full text]]></content:encoded>
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
		const consoleErrors: string[] = []
		const pageErrors: string[] = []
		page.on('console', (message) => {
			if (message.type() === 'error')
				consoleErrors.push(message.text())
		})
		page.on('pageerror', (error) => pageErrors.push(error.message))
		await installRssFixture(page)
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#main')).toContainText('Deterministic RSS feed', {
			timeout: 120_000,
		})
		await expect(page.locator(`#main a[href^="${feedPath}/item/"]`)).toContainText('Deterministic item')
		await expect(page.getByRole('heading', { name: /^Observations/ })).toBeVisible()
		await expect(page.locator('#timestamps').getByRole('listitem')).toHaveCount(2)
		await expect(page.locator('#timestamps')).toContainText(feedUrl)
		expect(consoleErrors).toEqual([])
		expect(pageErrors).toEqual([])
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
		await expect(page.locator('#main')).toContainText('Deterministic full text', {
			timeout: 120_000,
		})
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
