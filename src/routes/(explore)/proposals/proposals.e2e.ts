import { expect, test } from '@playwright/test'

test.describe('/proposals', () => {
	test('page loads and proposal query settles', async ({ page }) => {
		await page.goto('/proposals', { waitUntil: 'domcontentloaded' })

		await expect(page.getByRole('link', { name: 'Proposals' })).toBeVisible()

		const settled = (
			page.getByRole('heading', { name: 'EIPs' }).or(page.getByText('Could not load proposals.'))
		)
		await expect(settled).toBeAttached({ timeout: 120_000 })
	})
})
