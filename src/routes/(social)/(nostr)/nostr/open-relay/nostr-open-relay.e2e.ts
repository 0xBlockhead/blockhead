import { expect, test } from '@playwright/test'


test('renders relay ingress and submits to the canonical local relay', async ({ page }) => {
	await page.goto('/nostr/open-relay')
	await expect(page.getByRole('heading', { name: 'Open Nostr relay' })).toBeVisible()

	await page.getByLabel('Relay URL').fill('HTTPS://Relay.Example:443/path?limit=20')
	await page.getByRole('button', { name: 'Open relay' }).click()

	await expect(page).toHaveURL('/nostr/relay/wss%3A%2F%2Frelay.example%2Fpath%3Flimit%3D20')
})
