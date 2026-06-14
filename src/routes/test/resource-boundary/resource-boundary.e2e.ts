import { expect, test } from '@playwright/test'

test.setTimeout(120_000)

declare global {
	interface Window {
		cachedBoundaryLoadingFlashes?: number
		cachedBoundaryLoadingObserver?: MutationObserver
	}
}

test('ResourceBoundary remounts a cached resource without flashing pending UI', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
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

test('ResourceBoundary updates from a mock TanStackLiveQueryResource snapshot', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toBeVisible()
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('pending')

	await page.getByRole('button', { name: 'Resolve subscribed boundary' }).click()
	await expect(page.getByText('Subscribed value').first()).toBeVisible()
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('Subscribed value')
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update subscribed boundary' }).click()
	await expect(page.getByText('Updated subscribed value').first()).toBeVisible()
	await expect(page.getByText('Subscribed value', { exact: true })).toHaveCount(0)
})

test('ResourceBoundary updates from real subscribeEntity scalar fields through getters only', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity scalar boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('Ethereum:ethereum', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity scalar value"]')).toHaveCount(0)
})

test('ResourceBoundary updates from real subscribeEntity field rows through getters only', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity rows boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveText('2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity value"]')).toHaveCount(0)
})

test('ResourceBoundary updates from real subscribeEntity count rows through getters only', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity count boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveText('2:2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity count"]')).toHaveCount(0)
})

test('ResourceBoundary consumes SvelteKit-shaped RemoteResource directly', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading remote value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve remote boundary' }).click()
	await expect(page.getByText('Remote subscribed value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading remote value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update remote boundary' }).click()
	await expect(page.getByText('Updated remote value')).toBeVisible()
	await expect(page.getByText('Remote subscribed value', { exact: true })).toHaveCount(0)
})

test('ResourceBoundary consumes SvelteKit-shaped Query resources directly', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading query resource value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve query resource boundary' }).click()
	await expect(page.getByText('Query tagged value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading query resource value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update query resource boundary' }).click()
	await expect(page.getByText('Updated query tagged value')).toBeVisible()
	await expect(page.getByText('Query tagged value', { exact: true })).toHaveCount(0)
})

test('ResourceBoundary renders current data before full resource readiness', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('Partially ready value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading partially ready value"]')).toHaveCount(0)
})

test('ResourceBoundary renders an explicit failed resource through the Failed snippet', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('failed-resource-message')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show failed resource' }).click()
	await expect(page.getByTestId('failed-resource-message')).toHaveText('Boundary failure')
	await expect(page.locator('[aria-label="Loading failed value"]')).toHaveCount(0)
})
