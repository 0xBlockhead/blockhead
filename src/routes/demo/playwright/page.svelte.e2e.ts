import { expect, test } from '@playwright/test'

declare global {
	interface Window {
		cachedBoundaryLoadingFlashes?: number
		cachedBoundaryLoadingObserver?: MutationObserver
	}
}

test('demo route renders inside the app shell', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Playwright e2e test demo')
})

test('cached QueryLike ResourceBoundary remounts without a loading placeholder', async ({ page }) => {
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

test('live QueryLike ResourceBoundary renders pending state, resolved data, and updates', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve subscribed boundary' }).click()
	await expect(page.getByText('Subscribed value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update subscribed boundary' }).click()
	await expect(page.getByText('Updated subscribed value')).toBeVisible()
	await expect(page.getByText('Subscribed value', { exact: true })).toHaveCount(0)
})

test('RemoteResource ResourceBoundary renders pending state, resolved data, and updates directly', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading remote value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve remote boundary' }).click()
	await expect(page.getByText('Remote subscribed value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading remote value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update remote boundary' }).click()
	await expect(page.getByText('Updated remote value')).toBeVisible()
	await expect(page.getByText('Remote subscribed value', { exact: true })).toHaveCount(0)
})

test('SvelteKit Query-tagged ResourceBoundary renders pending state, resolved data, and updates directly', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading query resource value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve query resource boundary' }).click()
	await expect(page.getByText('Query tagged value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading query resource value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update query resource boundary' }).click()
	await expect(page.getByText('Updated query tagged value')).toBeVisible()
	await expect(page.getByText('Query tagged value', { exact: true })).toHaveCount(0)
})

test('ResourceBoundary renders current data before full readiness', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('Partially ready value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading partially ready value"]')).toHaveCount(0)
})
