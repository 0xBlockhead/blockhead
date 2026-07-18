import { expect, test } from '@playwright/test'


test('renders URL ingress and submits to a canonical local profile', async ({ page }) => {
	await page.goto('/farcaster/open-cast')
	await expect(page.getByRole('heading', { name: 'Open Farcaster URL' })).toBeVisible()

	await page.getByLabel('Farcaster URL').fill('https://farcaster.xyz/~/profiles/3')
	await page.getByRole('button', { name: 'Open', exact: true }).click()

	await expect(page).toHaveURL(/\/farcaster\/user\/3$/)
})
