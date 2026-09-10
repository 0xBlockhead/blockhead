import { expect, test, type Page } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

test.setTimeout(180_000)

test('native resource switches A to B and rejects a retired source notification', async ({ page }, testInfo) => {
	const events: string[] = []
	page.on('console', (message) => {
		if (message.text().startsWith('[native-subscription] '))
			events.push(message.text().slice('[native-subscription] '.length))
	})
	await openRoute(page)
	await page.getByRole('button', { name: 'Start native A', exact: true }).click()
	for (const surface of ['native-direct', 'native-awaited', 'native-boundary'])
		await expect(page.getByTestId(surface)).toHaveText('Value A')
	await expect.poll(() => events.join(', ')).toBe('subscribe lifecycle-a')
	await page.getByRole('button', { name: 'Switch native A to B', exact: true }).click()
	await expect.poll(() => events.join(', ')).toBe('subscribe lifecycle-a, unsubscribe lifecycle-a, subscribe lifecycle-b')
	await page.getByRole('button', { name: 'Seed native B', exact: true }).click()
	for (const surface of ['native-direct', 'native-awaited', 'native-boundary'])
		await expect(page.getByTestId(surface)).toHaveText('Value B')
	expect(events.join(', ')).toBe('subscribe lifecycle-a, unsubscribe lifecycle-a, subscribe lifecycle-b')
	await page.getByRole('button', { name: 'Deliver retired A notification', exact: true }).click()
	await expect(page.getByTestId('native-retired-value')).toHaveText('Value A')
	for (const surface of ['native-direct', 'native-awaited', 'native-boundary'])
		await expect(page.getByTestId(surface)).toHaveText('Updated B')
	expect(events.join(', ')).toBe('subscribe lifecycle-a, unsubscribe lifecycle-a, subscribe lifecycle-b')
	await page.getByRole('region', { name: 'Native subscription lifecycle' }).screenshot({
		path: testInfo.outputPath('native-subscription-lifecycle.png'),
	})
	await page.getByRole('button', { name: 'Hide native consumer', exact: true }).click()
	await expect(page.getByTestId('native-boundary')).toHaveCount(0)
	await expect.poll(() => events.join(', ')).toBe('subscribe lifecycle-a, unsubscribe lifecycle-a, subscribe lifecycle-b, unsubscribe lifecycle-b')
})

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

const sectionLoading = (
	page: Page,
	sectionTestId: string
) => (
	page.getByTestId(sectionTestId).locator('[aria-label]')
)

const openRoute = async (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: false,
	})
	await diagnostics.step(page.goto('/test/resource-boundary', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
}

test('ResourceBoundary remounts a cached resource through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	const cachedBoundary = page.locator('#main details').first()
	const cachedBoundaryValue = page.getByTestId('cached-boundary-value')
	await expect(cachedBoundaryValue).toBeVisible()

	await cachedBoundary.locator('summary').click()
	await expect(cachedBoundaryValue).toHaveCount(0)

	await cachedBoundary.locator('summary').click()
	await expect(cachedBoundaryValue).toBeVisible()
	await expect(cachedBoundary.locator('[aria-label]')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary updates from a mock TanStackLiveQueryResource snapshot', async ({ page }, testInfo) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(sectionLoading(page, 'selected-boundary-section')).toHaveCount(2)
	await expect(page.getByTestId('selected-awaited-value')).toHaveText('pending')

	await page.getByTestId('resolve-selected-boundary').click()
	await expect(page.getByTestId('selected-direct-current')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-boundary-value')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-boundary-value-secondary')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-awaited-value')).toHaveText('Selected value')
	await expect(sectionLoading(page, 'selected-boundary-section')).toHaveCount(0)

	await page.getByTestId('refresh-selected-boundary').click()
	await expect(page.getByTestId('selected-direct-current')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-boundary-value')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-boundary-value-secondary')).toHaveText('Selected value')
	await expect(page.getByTestId('selected-awaited-value')).toHaveText('Selected value')

	await page.getByTestId('update-selected-boundary').click()
	await expect(page.getByTestId('selected-direct-current')).toHaveText('Updated selected value')
	await expect(page.getByTestId('selected-boundary-value')).toHaveText('Updated selected value')
	await expect(page.getByTestId('selected-boundary-value-secondary')).toHaveText('Updated selected value')
	await expect(page.getByTestId('selected-awaited-value')).toHaveText('Updated selected value')
	await page.screenshot({
		path: testInfo.outputPath('resource-boundary-live-replacement.png'),
		fullPage: true,
	})
	expectNoWarnings()
})

test('lazy real selection resolves through direct getter, promise, and ResourceBoundary reads', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveCount(0)

	await page.getByTestId('show-real-selection-scalar-boundary').click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText('', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText('', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('', {
		timeout: 120_000,
	})
	await expect(sectionLoading(page, 'real-selection-boundary-section')).toHaveCount(0)

	await page.getByTestId('seed-real-selection-scalar-field').click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText('Boundary Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText('Boundary Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('Boundary Session', {
		timeout: 120_000,
	})
	await page.getByTestId('update-real-selection-scalar-field').click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText('Updated Boundary Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText('Updated Boundary Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText('Updated Boundary Session', {
		timeout: 120_000,
	})
	expectNoWarnings()
})

test('getter-only direct getter observes real source notifications without route reload', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveCount(0)
	await page.locator('body').evaluate((body) => {
		body.dataset.resourceObservationRouteInstance = 'open'
	})

	await page.getByTestId('show-direct-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('')
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true', {
		timeout: 120_000,
	})

	await page.getByTestId('seed-direct-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('Direct Only Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true')
	await expect(page.getByTestId('real-resource-direct-only-error')).toHaveText('')

	await page.getByTestId('update-direct-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('Updated Direct Only Session', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true')
	await expect(page.getByTestId('real-resource-direct-only-error')).toHaveText('')
	await expect(page.locator('body')).toHaveAttribute('data-resource-observation-route-instance', 'open')
	expectNoWarnings()
})

test('ResourceBoundary updates from real source notifications without direct getter reads or route reload', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveCount(0)
	await page.locator('body').evaluate((body) => {
		body.dataset.resourceObservationRouteInstance = 'open'
	})

	await page.getByTestId('seed-boundary-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-boundary-only-value')).toHaveText('Boundary Only Session', {
		timeout: 120_000,
	})
	await page.getByTestId('update-boundary-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-boundary-only-value')).toHaveText('Updated Boundary Only Session', {
		timeout: 120_000,
	})
	await expect(page.locator('body')).toHaveAttribute('data-resource-observation-route-instance', 'open')
	expectNoWarnings()
})

test('ResourceBoundary updates from real selection field rows through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveCount(0)

	await page.getByTestId('show-real-selection-rows-boundary').click()
	await expect(page.getByTestId('real-resource-boundary-rows')).toHaveText('2', {
		timeout: 120_000,
	})
	await expect(sectionLoading(page, 'real-selection-boundary-section')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary keeps count row totals authoritative through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveCount(0)

	await page.getByTestId('show-real-selection-count-boundary').click()
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveText('2', {
		timeout: 120_000,
	})
	await expect(sectionLoading(page, 'real-selection-boundary-section')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped RemoteResource through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(sectionLoading(page, 'remote-resource-boundary-section')).toBeVisible()

	await page.getByTestId('resolve-remote-boundary').click()
	await expect(page.getByTestId('remote-boundary-value')).toHaveText('Remote selected value')
	await expect(sectionLoading(page, 'remote-resource-boundary-section')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary consumes a SvelteKit-shaped Query through the await surface', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(sectionLoading(page, 'query-resource-boundary-section')).toBeVisible()

	await page.getByTestId('resolve-query-resource-boundary').click()
	await expect(page.getByTestId('query-tagged-boundary-value')).toHaveText('Query tagged value')
	await expect(sectionLoading(page, 'query-resource-boundary-section')).toHaveCount(0)
	expectNoWarnings()
})

test('ResourceBoundary renders a rejected resource through the Failed snippet', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('failed-resource-message')).toHaveCount(0)

	await page.getByTestId('show-failed-resource').click()
	await expect(page.getByTestId('failed-resource-message')).toBeAttached()
	await expect(sectionLoading(page, 'failed-resource-boundary-section')).toHaveCount(0)
	expectNoWarnings()
})
