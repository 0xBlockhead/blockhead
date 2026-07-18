import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../tests/_e2eBrowserHelpers.ts'


const profilePubkey = '82341f880b9929660a178be448011edd0e5839858c4fc1480b5fd4b6205d127b'
const rootEventId = '69be3416ed20ce50dea9cdd5471dbef55d320df41d97e1e999108321c2c3e3df'


test.setTimeout(240_000)

test.beforeEach(async ({ page }) => {
	await installChainlistRpcsJsonStub(page)
})

test('relay provenance remains separate from note and profile identity', async ({ page }) => {
	await page.goto(`/nostr/relay/${encodeURIComponent('wss://relay.damus.io')}`)
	await expectMainVisible(page)

	await expect(page.getByRole('navigation', { name: 'Nostr navigation' })).toBeVisible()
	await expect(page.locator('#main')).toContainText('relay.damus.io', { timeout: 180_000 })
	await expect(page.locator('#main')).toContainText('Latest observation')
	await expect(page.locator('#main')).not.toContainText(rootEventId)
	await expect(page.locator('#main')).not.toContainText(profilePubkey)
})

test('event thread preserves root and reply context', async ({ page }) => {
	await page.goto(`/nostr/note/${rootEventId}`)
	await expectMainVisible(page)

	await expect(page.locator('#main')).toContainText('Blockhead Nostr seed note', { timeout: 180_000 })
	await expect(page.locator('#main dt', { hasText: 'Event ID' })).toBeAttached()
	await expect(page.locator('#main').getByRole('heading', { name: /Replies/ })).toBeAttached()
})

test('profile context carries authored notes into event reading', async ({ page }) => {
	await page.goto(`/nostr/profile/${profilePubkey}`)
	await expectMainVisible(page)

	const noteLink = page.getByRole('link', { name: /Blockhead Nostr seed note/ }).first()
	await expect(page.locator('#main')).toContainText(profilePubkey, { timeout: 180_000 })
	await expect(noteLink).toBeVisible({ timeout: 180_000 })
	await noteLink.click()
	await expect(page).toHaveURL(new RegExp(`/nostr/note/${rootEventId}/?$`))
	await expect(page.locator('#main')).toContainText('Blockhead Nostr seed note', { timeout: 180_000 })
	await expect(page.getByRole('navigation', { name: 'Nostr navigation' })).toBeVisible()
})
