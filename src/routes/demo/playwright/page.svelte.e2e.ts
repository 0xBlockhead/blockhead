import { expect, test } from '@playwright/test'

declare global {
	interface Window {
		cachedBoundaryLoadingFlashes?: number
		cachedBoundaryLoadingObserver?: MutationObserver
	}
}

test('has expected h1', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Playwright e2e test demo')
})

test('cached boundary remount does not flash loading', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('Cached value')).toBeVisible()

	await page.getByText('Cached boundary').click()
	await expect(page.getByText('Cached value')).toHaveCount(0)

	await page.evaluate(() => {
		window.cachedBoundaryLoadingFlashes = 0
		window.cachedBoundaryLoadingObserver?.disconnect()
		window.cachedBoundaryLoadingObserver = new MutationObserver((mutations) => {
			if (document.querySelector('[aria-label="Loading cached value"]')) {
				window.cachedBoundaryLoadingFlashes = (window.cachedBoundaryLoadingFlashes ?? 0) + 1
				return
			}

			for (const mutation of mutations) {
				for (const addedNode of mutation.addedNodes) {
					if (
						addedNode instanceof Element
						&& (
							addedNode.matches('[aria-label="Loading cached value"]')
							|| addedNode.querySelector('[aria-label="Loading cached value"]')
						)
					) {
						window.cachedBoundaryLoadingFlashes = (window.cachedBoundaryLoadingFlashes ?? 0) + 1
						return
					}
				}
			}
		})
		window.cachedBoundaryLoadingObserver.observe(document.body, {
			childList: true,
			subtree: true,
		})
	})

	await page.getByText('Cached boundary').click()
	await expect(page.getByText('Cached value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading cached value"]')).toHaveCount(0)
	expect(await page.evaluate(() => window.cachedBoundaryLoadingFlashes ?? 0)).toBe(0)
})
