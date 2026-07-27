import { expect, test } from '@playwright/test'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../tests/_e2eBrowserHelpers.ts'
import { nostrNetworkSeedNotes } from '$/constants/Social/Nostr.ts'
import { nostrEventId } from '../../../sources/NostrRelay/Nip01/event.ts'


const profilePubkey = nostrNetworkSeedNotes[0].pubkey
const rootEventId = nostrNetworkSeedNotes[0].eventId

const secretKey = Hex.toBytes(`0x${'03'.repeat(32)}`)
const relayAuthorPubkey = Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2)
const signedRelayNote = (content: string, createdAt: number) => {
	const unsignedEvent = {
		pubkey: relayAuthorPubkey,
		created_at: createdAt,
		kind: 1,
		tags: [],
		content,
	}
	const id = nostrEventId(unsignedEvent)
	return {
		...unsignedEvent,
		id,
		sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secretKey, new Uint8Array(32))).slice(2),
	}
}


test.setTimeout(240_000)

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-nostr-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
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

test('relay-scoped live notes append with stable signed identities', async ({ page }) => {
	const initialNote = signedRelayNote('Initial relay-scoped note', 1_700_000_000)
	const appendedNote = signedRelayNote('Appended relay-scoped note', 1_700_000_001)
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	let publishInitialNote: (() => void) | undefined
	let appendLiveNote: (() => void) | undefined
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.routeWebSocket('wss://relay.damus.io/', (socket) => {
		socket.onMessage((message) => {
			const request = JSON.parse(String(message))
			if (request[0] !== 'REQ')
				return

			const subscriptionId = String(request[1])
			publishInitialNote = () => {
				socket.send(JSON.stringify(['EVENT', subscriptionId, initialNote]))
				socket.send(JSON.stringify(['EVENT', subscriptionId, initialNote]))
				socket.send(JSON.stringify(['EOSE', subscriptionId]))
			}
			appendLiveNote = () => socket.send(JSON.stringify(['EVENT', subscriptionId, appendedNote]))
		})
	})

	await page.goto(`/nostr/relay/${encodeURIComponent('wss://relay.damus.io')}`)
	await expectMainVisible(page)

	const liveSection = page.locator('section[data-scroll-marker-label="Live notes"]')
	const list = liveSection.locator(':scope > article[data-card][data-scroll-container]')
	await expect(list).toHaveCount(1)
	await expect.poll(() => publishInitialNote != null).toBe(true)
	if (publishInitialNote == null)
		throw new Error('Nostr relay subscription request was not observed')
	publishInitialNote()
	await expect(list.locator(`a[href="/nostr/note/${initialNote.id}"]`)).toHaveCount(1)

	if (appendLiveNote == null)
		throw new Error('Nostr relay append publisher was not installed')
	appendLiveNote()

	await expect(list.locator(`a[href="/nostr/note/${appendedNote.id}"]`)).toHaveCount(1)
	await expect(list.getByRole('listitem')).toHaveCount(2)
	await expect(liveSection.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect.poll(() => consoleErrors).toEqual([])
	expect(pageErrors).toEqual([])
	expect(initialNote.pubkey).toBe(relayAuthorPubkey)
	expect(appendedNote.pubkey).toBe(relayAuthorPubkey)
})

test('event thread preserves root and reply context', async ({ page }) => {
	await page.goto(`/nostr/note/${rootEventId}`)
	await expectMainVisible(page)

	await expect(page.locator('#main')).toContainText('Blockhead Nostr seed note', { timeout: 180_000 })
	await expect(page.locator('#main dt', { hasText: 'Event ID' })).toBeAttached()
	await expect(page.locator('#main').getByRole('heading', { name: /Replies/ })).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
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
