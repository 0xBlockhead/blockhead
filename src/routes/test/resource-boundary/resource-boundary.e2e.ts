import { expect, test, type Page } from '@playwright/test'

test.setTimeout(120_000)

const svelteReactivityMessages = [
	'await_reactivity_loss',
	'derived_inert',
	'state_referenced_locally',
]

const expectNoSvelteReactivityWarnings = (
	page: Page,
) => {
	const svelteWarnings: string[] = []
	page.on('console', (message) => {
		const text = message.text()
		if (svelteReactivityMessages.some((svelteMessage) => text.includes(svelteMessage)))
			svelteWarnings.push(text)
	})
	return () => expect(svelteWarnings).toEqual([])
}

test('ResourceBoundary remounts a cached resource through the getter surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	const cachedBoundarySummary = page.locator('summary').filter({ hasText: 'Cached boundary' })
	await expect(page.getByText('Cached value')).toBeVisible()

	await cachedBoundarySummary.click()
	await expect(page.getByText('Cached value')).toHaveCount(0)

	await cachedBoundarySummary.click()
	await expect(page.getByText('Cached value')).toBeVisible()
	await expect(page.locator('[aria-label="Loading cached value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary updates from a mock TanStackLiveQueryResource snapshot', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toBeVisible()
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('pending')

	await page.getByRole('button', { name: 'Resolve subscribed boundary' }).click()
	await expect(page.getByTestId('subscribed-boundary-value')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('Subscribed value')
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update subscribed boundary' }).click()
	await expect(page.getByTestId('subscribed-boundary-value')).toHaveText('Updated subscribed value')
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity scalar fields through getters only', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity scalar boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity scalar value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update real subscribeEntity scalar field' }).click()
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('Updated Boundary Session:Draft', {
		timeout: 120_000,
	})
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity field rows through getters only', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity rows boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveText('2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity count rows through getters only', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity count boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveText('2:2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity count"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped RemoteResource through getters', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading remote value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve remote boundary' }).click()
	await expect(page.getByTestId('remote-boundary-value')).toHaveText('Remote subscribed value')
	await expect(page.locator('[aria-label="Loading remote value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped Query through getters', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading query resource value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve query resource boundary' }).click()
	await expect(page.getByTestId('query-tagged-boundary-value')).toHaveText('Query tagged value')
	await expect(page.locator('[aria-label="Loading query resource value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary renders a rejected resource through the Failed snippet', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('failed-resource-message')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show failed resource' }).click()
	await expect(page.getByTestId('failed-resource-message')).toHaveText('Boundary failure')
	await expect(page.locator('[aria-label="Loading failed value"]')).toHaveCount(0)
	expectNoWarnings()
})
