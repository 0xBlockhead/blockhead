import { expect, test, type Page } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../../tests/_e2eBrowserHelpers.ts'

test.setTimeout(180_000)

const openRoute = async (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/test/query-resource-adapter/getters', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await diagnostics.step(expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Query resource adapter getter test route',
		{ timeout: 120_000 }
	))
}

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

test('queryResource maps TanStack DB snapshots to SvelteKit resource getters', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	const routeUrl = page.url()
	await expect(page.getByTestId('adapter-current')).toHaveText('')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('false')
	await expect(page.getByTestId('adapter-error')).toHaveText('')
	await expect(page.getByTestId('initialized-resource-current')).toHaveText('')
	await expect(page.getByTestId('initialized-resource-loading')).toHaveText('true')
	await expect(page.getByTestId('initialized-resource-ready')).toHaveText('false')

	await page.getByTestId('initialized-resource-resolve').click()
	await expect(page.getByTestId('initialized-resource-current')).toHaveText('Initialized value')
	await expect(page.getByTestId('initialized-resource-loading')).toHaveText('false')
	await expect(page.getByTestId('initialized-resource-ready')).toHaveText('true')

	await page.getByTestId('adapter-ready-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-refresh-loading-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-refreshed-ready-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')

	await page.getByTestId('adapter-error-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('Adapter failure')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')

	await page.getByTestId('adapter-disabled-ready-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Disabled value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')
	expectNoWarnings()
})

test('queryResource construction stays lazy until a direct getter is observed', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByTestId('lazy-resource-source-subscription-count')).toHaveText('0')
	await expect(page.getByTestId('lazy-resource-initialization-count')).toHaveText('0')
	await expect(page.getByTestId('lazy-resource-current')).toHaveCount(0)

	await page.getByTestId('show-lazy-resource-getter').click()
	await expect(page.getByTestId('lazy-resource-source-subscription-count')).toHaveText('1')
	await expect(page.getByTestId('lazy-resource-initialization-count')).toHaveText('1')
	await expect(page.getByTestId('lazy-resource-current')).toHaveText('Lazy getter value')
	expectNoWarnings()
})

test('queryResource keeps getters unready when the first settled snapshot is an error', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	const routeUrl = page.url()

	await page.getByTestId('adapter-error-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('false')
	await expect(page.getByTestId('adapter-error')).toHaveText('Adapter failure')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('false')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page).toHaveURL(routeUrl)
	await expect(page.getByTestId('adapter-current')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')
	expectNoWarnings()
})
