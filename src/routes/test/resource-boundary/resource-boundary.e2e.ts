import { expect, test, type Page } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

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

test('ResourceBoundary updates from a mock TanStackLiveQueryResource snapshot', async ({ page }) => {
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
	expectNoWarnings()
})

test('real selection scalar fields resolve through direct, native await, and boundary reads', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveCount(0)

	await page.getByTestId('show-real-selection-scalar-boundary').click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-awaited-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-boundary-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	await expect(sectionLoading(page, 'real-selection-boundary-section')).toHaveCount(0)
	await page.getByTestId('update-real-selection-scalar-field').click()
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
	expectNoWarnings()
})

test('getter-only direct getter lazy source notification updates without route reload, await, or ResourceBoundary consumers', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	const initialUrl = page.url()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('')

	await page.getByTestId('update-direct-only-live-subscription-field').click()
	await expect(page.getByTestId('real-resource-direct-only-current')).toHaveText('Updated direct-only value', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('real-resource-direct-only-ready')).toHaveText('true')
	await expect(page.getByTestId('real-resource-direct-only-error')).toHaveText('')
	await expect(page).toHaveURL(initialUrl)
	expectNoWarnings()
})

test('ResourceBoundary resolves a real selection live subscription without companion getter reads', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('real-resource-direct-scalars')).toHaveCount(0)

	await expect(page.getByTestId('real-resource-boundary-only-scalars')).toHaveText(':Draft', {
		timeout: 120_000,
	})
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
	await expect(page.getByTestId('real-resource-boundary-count')).toHaveText('2:', {
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
