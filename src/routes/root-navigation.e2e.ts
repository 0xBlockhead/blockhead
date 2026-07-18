import { expect, test } from '@playwright/test'


test('replaces generated route children after client navigation', async ({ page }) => {
	await page.goto('/~/multiplayer/rooms')
	await expect(page.locator('#main').getByText('Rooms', { exact: true }).first()).toBeVisible()

	await page.locator('a[href="/networks"]').first().click()

	await expect(page).toHaveURL('/networks')
	await expect(page.locator('#main').getByText('Rooms', { exact: true })).not.toBeAttached()
	await expect(page.locator('#main').getByText('Networks', { exact: true }).first()).toBeVisible()
})
