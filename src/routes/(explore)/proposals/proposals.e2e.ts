import { expect, test } from '@playwright/test'

test.describe('/proposals', () => {
	test('page loads and proposal query settles', async ({ page }) => {
		await page.goto('/proposals', { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#nav-menu').getByRole('link', { name: 'Proposals' })).toBeVisible()

		const proposals = page.locator('#proposal-realms')
		await expect(proposals).toBeVisible()
		await expect(
			proposals.getByText('No proposal realms to show yet.').or(
				proposals.locator('li, section').first(),
			),
		).toBeAttached({ timeout: 15_000 })
	})
})
