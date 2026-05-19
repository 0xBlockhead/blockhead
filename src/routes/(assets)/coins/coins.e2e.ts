import { expect, test } from '@playwright/test'
import { stringify } from 'devalue'

const marketKeyEthUsdSpotIndex = encodeURIComponent(
	stringify({
		$base: { kind: 'Coin', $coin: { coinId: 'ETH' } },
		$quote: { kind: 'Currency', iso4217: 'USD' },
		$marketVenue: { marketVenueId: 'SpotIndex' },
	}),
)

const relevantConsoleErrors = (consoleErrors: string[]) => (
	consoleErrors.filter((error) => (
		!error.includes('Failed to load resource')
		&& !error.includes('ERR_CONNECTION_REFUSED')
		&& !error.includes('blocked by CORS policy')
	))
)

const assertNoRuntimeErrors = (
	pageErrors: string[],
	consoleErrors: string[],
) => {
	expect(pageErrors, `page errors: ${JSON.stringify(pageErrors, null, 2)}`).toEqual([])
	expect(
		relevantConsoleErrors(consoleErrors),
		`console errors: ${JSON.stringify(consoleErrors, null, 2)}`,
	).toEqual([])
}

test.describe('/coins routes', () => {
	test.describe.configure({ timeout: 150_000 })

	test('coins list renders', async ({ page }) => {
		const pageErrors: string[] = []
		const consoleErrors: string[] = []

		page.on('pageerror', (error) => {
			pageErrors.push(error.message)
		})
		page.on('console', (message) => {
			if (message.type() === 'error') consoleErrors.push(message.text())
		})

		await page.goto('/coins', { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#coins')).toBeVisible()
		await expect(page.getByText('Not found')).toHaveCount(0)

		await expect(page.locator('#coins a[href^="/coin/"]').first()).toBeAttached({
			timeout: 120_000,
		})

		const coinLinks = page.locator('#coins a[href="/coin/BTC"]')
		await expect(coinLinks, 'catalog coin link is not duplicated').toHaveCount(1)

		await expect(page.locator('#coins a[href="/coin/ETH"]')).toBeAttached({ timeout: 120_000 })

		assertNoRuntimeErrors(pageErrors, consoleErrors)
	})

	test('coin detail renders', async ({ page }) => {
		const pageErrors: string[] = []
		const consoleErrors: string[] = []

		page.on('pageerror', (error) => {
			pageErrors.push(error.message)
		})
		page.on('console', (message) => {
			if (message.type() === 'error') consoleErrors.push(message.text())
		})

		await page.goto('/coin/ETH', { waitUntil: 'domcontentloaded' })
		await expect(page.getByText('Not found')).toHaveCount(0)
		await expect(page.getByText('Price', { exact: true })).toBeAttached({ timeout: 120_000 })
		await expect(page.getByText('Coin id', { exact: true })).toBeAttached({ timeout: 120_000 })
		assertNoRuntimeErrors(pageErrors, consoleErrors)
	})

	test('markets list renders', async ({ page }) => {
		const pageErrors: string[] = []
		const consoleErrors: string[] = []

		page.on('pageerror', (error) => {
			pageErrors.push(error.message)
		})
		page.on('console', (message) => {
			if (message.type() === 'error') consoleErrors.push(message.text())
		})

		await page.goto('/coins/markets', { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#coin-markets-page')).toBeVisible({ timeout: 120_000 })
		await expect(page.getByText('Not found')).toHaveCount(0)
		assertNoRuntimeErrors(pageErrors, consoleErrors)
	})

	test('market detail renders', async ({ page }) => {
		const pageErrors: string[] = []
		const consoleErrors: string[] = []

		page.on('pageerror', (error) => {
			pageErrors.push(error.message)
		})
		page.on('console', (message) => {
			if (message.type() === 'error') consoleErrors.push(message.text())
		})

		await page.goto(`/coins/market/${marketKeyEthUsdSpotIndex}`, { waitUntil: 'domcontentloaded' })
		await expect(page.getByText('Not found')).toHaveCount(0)
		await expect(page.getByRole('heading', { name: '500' })).toHaveCount(0)
		await expect(
			page.locator('#main').getByRole('heading', { name: 'Assets' }),
		).toBeAttached({ timeout: 120_000 })
		assertNoRuntimeErrors(pageErrors, consoleErrors)
	})
})
