import { expect, test, type Page } from '@playwright/test'

test.setTimeout(120_000)

const svelteReactivityMessages = [
	'await_reactivity_loss',
	'derived_inert',
	'state_referenced_locally',
]

const expectNoSvelteReactivityWarnings = (
	page: Page
) => {
	const svelteWarnings: string[] = []
	page.on('console', (message) => {
		const text = message.text()
		if (svelteReactivityMessages.some((svelteMessage) => text.includes(svelteMessage)))
			svelteWarnings.push(text)
	})
	return () => expect(svelteWarnings).toEqual([])
}

test('ResourceBoundary remounts a cached resource through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
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
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toBeVisible()
	await expect(page.locator('[aria-label="Loading subscribed duplicate value"]')).toBeVisible()
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('pending')

	await page.getByRole('button', { name: 'Resolve subscribed boundary' }).click()
	await expect(page.getByTestId('subscribed-direct-current')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value-secondary')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('Subscribed value')
	await expect(page.locator('[aria-label="Loading subscribed value"]')).toHaveCount(0)
	await expect(page.locator('[aria-label="Loading subscribed duplicate value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Refresh subscribed boundary' }).click()
	await expect(page.getByTestId('subscribed-direct-current')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value-secondary')).toHaveText('Subscribed value')
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('Subscribed value')

	await page.getByRole('button', { name: 'Update subscribed boundary' }).click()
	await expect(page.getByTestId('subscribed-direct-current')).toHaveText('Updated subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value')).toHaveText('Updated subscribed value')
	await expect(page.getByTestId('subscribed-boundary-value-secondary')).toHaveText('Updated subscribed value')
	await expect(page.getByTestId('subscribed-awaited-value')).toHaveText('Updated subscribed value')
	expectNoWarnings()
})

test('ResourceBoundary retries a failed mock TanStackLiveQueryResource without route reload', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading failable value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Fail failable boundary' }).click()
	await expect(page.getByTestId('failable-boundary-error')).toHaveText(/Failable boundary failure|Internal Error/)
	await expect(page.getByTestId('failable-boundary-retry')).toBeVisible()

	await page.getByRole('button', { name: 'Recover failable boundary' }).click()
	await page.getByTestId('failable-boundary-retry').click()
	await expect(page.getByTestId('failable-boundary-value')).toHaveText('Recovered failable value')
	await expect(page.locator('[aria-label="Loading failable value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity scalar fields through direct, native await, and boundary reads', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity scalar boundary' }).click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity scalar value"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update real subscribeEntity scalar field' }).click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText('Updated Boundary Session:Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText('Updated Boundary Session:Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('Updated Boundary Session:Draft', {
		timeout: 120_000,
	})
	expectNoWarnings()
})

test('direct subscribeEntity getters update without await or ResourceBoundary consumers', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })

	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-direct-only-loading')).toHaveText('false')
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true')
	await expect(page.getByTestId('real-resource-direct-only-error')).toHaveText('')

	await page.getByRole('button', { name: 'Update direct-only live subscription field' }).click()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('Updated Direct Only Session:Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-direct-only-loading')).toHaveText('false')
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true')
	await expect(page.getByTestId('real-resource-direct-only-error')).toHaveText('')
	expectNoWarnings()
})

test('ResourceBoundary updates from a real subscribeEntity live subscription without companion getter reads', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveCount(0)

	await expect(page.getByTestId('real-resource-boundary-only-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity boundary-only live subscription"]')).toHaveCount(0)

	await page.getByRole('button', { name: 'Update boundary-only live subscription field' }).click()
	await expect(page.getByTestId('real-resource-boundary-only-scalars')).toHaveText('Updated Boundary Only Session:Draft', {
		timeout: 120_000,
	})
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity field rows through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity rows boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveText('2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary updates from real subscribeEntity count rows through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show real subscribeEntity count boundary' }).click()
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveText('2:2', {
		timeout: 120_000,
	})
	await expect(page.locator('[aria-label="Loading real subscribeEntity count"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped RemoteResource through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading remote value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve remote boundary' }).click()
	await expect(page.getByTestId('remote-boundary-value')).toHaveText('Remote subscribed value')
	await expect(page.locator('[aria-label="Loading remote value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped Query through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.locator('[aria-label="Loading query resource value"]')).toBeVisible()

	await page.getByRole('button', { name: 'Resolve query resource boundary' }).click()
	await expect(page.getByTestId('query-tagged-boundary-value')).toHaveText('Query tagged value')
	await expect(page.locator('[aria-label="Loading query resource value"]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary renders a rejected resource through the Failed snippet', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByTestId('failed-resource-message')).toHaveCount(0)

	await page.getByRole('button', { name: 'Show failed resource' }).click()
	await expect(page.getByTestId('failed-resource-message')).toHaveText('Internal Error')
	await expect(page.locator('[aria-label="Loading failed value"]')).toHaveCount(0)
	expectNoWarnings()
})
