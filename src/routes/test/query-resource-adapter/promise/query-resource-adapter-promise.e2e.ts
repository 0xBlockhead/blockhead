import { expect, test } from '@playwright/test'

test('queryResource maps TanStack DB snapshots to SvelteKit resource promise state', async ({ page }) => {
	await page.goto('/test/query-resource-adapter/promise', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Query resource adapter promise test route')
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')

	await page.getByTestId('adapter-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Ready value')

	await page.getByTestId('adapter-refresh-loading-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')

	await page.getByTestId('adapter-refreshed-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Refreshed value')

	await page.getByTestId('adapter-error-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Adapter failure')

	await page.getByTestId('adapter-recover-loading-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('pending')

	await page.getByTestId('adapter-recovered-ready-button').click()
	await expect(page.getByTestId('adapter-awaited')).toHaveText('Recovered value')
})
