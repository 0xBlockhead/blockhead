import { expect, test } from '@playwright/test'

test.describe('/proposals', () => {
	test('page loads and proposal query settles', async ({ page }) => {
		await page.goto('/proposals', { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#nav-menu').getByRole('link', { name: 'Proposals' })).toBeVisible()

		const proposals = page.locator('#proposals')
		await expect(
			proposals.getByText('EIPs', { exact: true }).or(
				proposals.getByText('Failed to load proposals.'),
			),
		).toBeAttached({ timeout: 5_000 })
	})
})
