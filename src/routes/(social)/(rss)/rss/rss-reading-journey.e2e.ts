import { expect, test, type Page } from '@playwright/test'
import { Buffer } from 'node:buffer'


const feedUrl = 'https://hnrss.org/frontpage'
const feedPath = `/rss/feed/${encodeURIComponent(feedUrl)}`
const feedImageUrl = 'https://images.example.com/deterministic-rss-feed.png'

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
						image: feedImageUrl,
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
						<image>
							<url>${feedImageUrl}</url>
						</image>
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
	test.beforeEach(async ({ page }) => {
		await installRssFixture(page)
	})

	test('successful feed reads expose their source-owned observation list', async ({ page }) => {
		test.setTimeout(180_000)
		const consoleErrors: string[] = []
		const pageErrors: string[] = []
		page.on('console', (message) => {
			if (message.type() === 'error')
				consoleErrors.push(message.text())
		})
		page.on('pageerror', (error) => pageErrors.push(error.message))
		await page.goto(feedPath, { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#main')).toContainText('Deterministic RSS feed', {
			timeout: 120_000,
		})
		await expect(page.locator(`#main a[href^="${feedPath}/item/"]`)).toContainText('Deterministic item')
		const imageLink = page.getByRole('link', {
			name: feedImageUrl,
			exact: true,
		})
		await expect(imageLink).toBeVisible()
		await expect(imageLink).toHaveAttribute('href', feedImageUrl)
		await expect(imageLink).toHaveAttribute('target', '_blank')
		await expect(imageLink).toHaveAttribute('rel', 'noreferrer noopener')
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

	test('saved subscriptions dedupe, survive reload, export as OPML, and can be removed', async ({ page }, testInfo) => {
		test.setTimeout(180_000)
		await page.addInitScript(({ name, schemaVersion }) => {
			window.__blockheadWaSqliteDatabaseNameOverride = name
			window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
			window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
		}, {
			name: `bh-rss-subscriptions-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
			schemaVersion: Date.now(),
		})
		const providerRequests: string[] = []
		page.on('request', (request) => {
			if (request.url().includes('/api-proxy/'))
				providerRequests.push(request.url())
		})

		await page.goto('/rss', { waitUntil: 'domcontentloaded' })
		const subscriptionControl = page.locator('section[data-card]').filter({
			has: page.getByRole('heading', { name: 'RSS subscriptions', exact: true }),
		})
		const feedUrlInput = subscriptionControl.getByLabel('Feed URL')
		const titleInput = subscriptionControl.getByLabel('Title')
		await expect(feedUrlInput).toBeVisible({
			timeout: 120_000,
		})
		const savedSubscription = page.getByRole('link', {
			name: 'Example subscription https://example.com/feed.xml',
			exact: true,
		})
		await feedUrlInput.fill('https://example.com/feed.xml')
		await titleInput.fill(' Example subscription ')
		await subscriptionControl.getByRole('button', { name: 'Save subscription' }).click()
		await expect(subscriptionControl.getByRole('status')).toHaveText('Subscription saved.')

		await feedUrlInput.fill('https://example.com/feed.xml')
		await titleInput.fill('Example subscription')
		await subscriptionControl.getByRole('button', { name: 'Save subscription' }).click()
		await expect(savedSubscription).toHaveCount(1)

		await page.reload({ waitUntil: 'domcontentloaded' })
		await expect(savedSubscription).toHaveCount(1)
		const downloadPromise = page.waitForEvent('download')
		await subscriptionControl.getByRole('button', { name: 'Export OPML' }).click()
		const download = await downloadPromise
		expect(download.suggestedFilename()).toBe('blockhead-rss-subscriptions.opml')
		const stream = await download.createReadStream()
		const chunks: Buffer[] = []
		for await (const chunk of stream)
			chunks.push(Buffer.from(chunk))
		expect(Buffer.concat(chunks).toString('utf8')).toBe([
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<opml version="2.0">',
			'  <head>',
			'    <title>RSS subscriptions</title>',
			'  </head>',
			'  <body>',
			'    <outline type="rss" text="Example subscription" title="Example subscription" xmlUrl="https://example.com/feed.xml" />',
			'  </body>',
			'</opml>',
		].join('\n') + '\n')

		await feedUrlInput.fill('https://example.com/feed.xml')
		await subscriptionControl.getByRole('button', { name: 'Remove subscription' }).click()
		await expect(subscriptionControl.getByRole('status')).toHaveText('Subscription removed.')
		await expect(savedSubscription).toHaveCount(0)
		expect(providerRequests.some((url) => (
			url.includes('https%3A%2F%2Fexample.com%2Ffeed.xml')
			|| decodeURIComponent(url).includes('https://example.com/feed.xml')
		))).toBe(false)
	})
})
