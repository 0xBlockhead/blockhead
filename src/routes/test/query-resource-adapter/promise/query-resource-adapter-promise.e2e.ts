import { expect, test, type Page } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../../tests/_e2eBrowserHelpers.ts'

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

const openRoute = async (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/test/query-resource-adapter/promise', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
}

test('queryResource maps TanStack DB snapshots to SvelteKit resource promise state', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Query resource adapter promise test route')
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('pending')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('0')

	await page.getByTestId('adapter-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('1')

	await page.getByTestId('adapter-refresh-loading-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('pending')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('1')

	await page.getByTestId('adapter-refreshed-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('3')

	await page.getByTestId('adapter-error-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-catch')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('4')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('pending')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('4')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('6')
	expectNoWarnings()
})

test('queryResource rejects before the first ready value and then recovers', async ({ page }) => {
	const expectNoWarnings = expectNoSvelteReactivityWarnings(page)
	await openRoute(page)

	await page.getByTestId('adapter-error-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-catch')).toHaveText('Adapter failure')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('1')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('pending')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('1')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-awaited-second')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-catch')).toHaveText('')
	await expect(page.getByTestId('adapter-finally-count')).toHaveText('3')
	expectNoWarnings()
})
