import { expect, test, type Page } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../../tests/_e2eBrowserHelpers.ts'

const openRoute = async (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/test/query-resource-adapter/getters', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
}

test('queryResource maps TanStack DB snapshots to SvelteKit resource getters', async ({ page }) => {
	await openRoute(page)
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Query resource adapter getter test route')
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
	await expect(page.getByTestId('adapter-current')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-refresh-loading-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Ready value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-refreshed-ready-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')

	await page.getByTestId('adapter-error-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('Adapter failure')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Refreshed value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')

	await page.getByTestId('adapter-disabled-ready-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Disabled value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')
})

test('queryResource keeps getters unready when the first settled snapshot is an error', async ({ page }) => {
	await openRoute(page)

	await page.getByTestId('adapter-error-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('false')
	await expect(page.getByTestId('adapter-error')).toHaveText('Adapter failure')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('')
	await expect(page.getByTestId('adapter-loading')).toHaveText('true')
	await expect(page.getByTestId('adapter-ready')).toHaveText('false')
	await expect(page.getByTestId('adapter-error')).toHaveText('')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page.getByTestId('adapter-current')).toHaveText('Recovered value')
	await expect(page.getByTestId('adapter-loading')).toHaveText('false')
	await expect(page.getByTestId('adapter-ready')).toHaveText('true')
	await expect(page.getByTestId('adapter-error')).toHaveText('')
})
