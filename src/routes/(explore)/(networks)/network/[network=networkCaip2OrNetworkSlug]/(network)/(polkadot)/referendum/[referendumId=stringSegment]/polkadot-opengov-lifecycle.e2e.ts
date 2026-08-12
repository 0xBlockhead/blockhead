import {
	expect,
	test,
} from '@playwright/test'


test('Polkadot governance visibly connects the native referendum collection to block-anchored lifecycle state', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const upstreamUrl = decodeURIComponent(route.request().url().split('/').at(-1) ?? '')
		if (upstreamUrl.endsWith('/pallets/on-going-referenda')) {
			await route.fulfill({
				json: {
					at: {
						hash: '0xREF_AT_32442435',
						height: '32442435',
					},
					referenda: [
						{
							id: '1284',
							submitted: '32440000',
							deciding: {
								since: '32441000',
								confirming: '32442000',
							},
							enactment: {
								at: '32450000',
							},
						},
						{
							id: '1285',
							submitted: '32440500',
						},
					],
				},
			})
			return
		}

		await route.abort()
	})

	await page.goto('/network/polkadot/referenda', {
		waitUntil: 'domcontentloaded',
	})
	await expect(page.locator('#main')).toContainText('Polkadot referenda', { timeout: 120_000 })
	await expect(page.getByRole('link', { name: '1284' })).toBeAttached()
	await expect(page.getByRole('link', { name: '1285' })).toBeAttached()

	await page.getByRole('link', { name: '1284' }).click()
	await expect(page).toHaveURL(/\/network\/polkadot\/referendum\/1284$/)
	await expect(page.locator('#main')).toContainText('Submitted at block number', { timeout: 120_000 })
	await expect(page.locator('#main')).toContainText('32,440,000')
	await expect(page.locator('#main')).toContainText('Lifecycle observations')
	await expect(page.locator('#main')).toContainText('Ongoing')
	await page.getByText('Ongoing', { exact: true }).click()
	await expect(page.locator('#main')).toContainText('32,442,435')
	await expect(page.locator('#main')).toContainText('0xREF_AT_32442435')
})
