import { expect, test } from '@playwright/test'


const relayPath = '/nostr/relay/wss%3A%2F%2Frelay.nostr.band'

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-nostr-relay-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('shows source-clocked relay identity, software, capabilities, access policy and provenance', async ({ page }) => {
	test.setTimeout(120_000)
	await page.route('**/api-proxy/**', async (route) => {
		await route.fulfill({
			contentType: 'application/nostr+json',
			body: JSON.stringify({
				name: 'Nostr Band Relay',
				description: 'A public relay with explicit read and write limits.',
				pubkey: '20'.repeat(32),
				contact: 'ops@relay.example',
				supported_nips: [1, 9, 11, 40, 50],
				software: 'https://github.com/fiatjaf/relayer',
				version: '1.2.3',
				limitation: {
					max_message_length: 131_072,
					max_subscriptions: 20,
					auth_required: false,
					payment_required: true,
					restricted_writes: true,
				},
				fees: {
					subscription: [{
						amount: 1_000,
						unit: 'msats',
						period: 2_592_000,
					}],
				},
				payments_url: 'https://relay.example/pay',
				terms_of_service: 'https://relay.example/terms',
			}),
		})
	})

	await page.goto(relayPath)
	await expect(page.getByText('wss://relay.nostr.band', { exact: true }).first()).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('Nostr Band Relay NostrRelay_Nip11_Http', { exact: true }).first()).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('true https://github.com/fiatjaf/relayer', { exact: true })).toBeVisible()
	const observationCard = page.locator('main li').filter({
		hasText: 'Nostr Band Relay NostrRelay_Nip11_Http',
	}).first()
	await expect(observationCard).toContainText(`Limitations: ${JSON.stringify({
		maxMessageLength: 131_072,
		maxSubscriptions: 20,
		authenticationRequired: false,
		paymentRequired: true,
		restrictedWrites: true,
	})}`)
	await expect(observationCard).toContainText(`Fees: ${JSON.stringify({
		subscription: [{
			amount: 1_000,
			unit: 'msats',
			period: 2_592_000,
		}],
	})}`)
	await expect(observationCard).toContainText(/\d{13}/)
})

test('surfaces malformed relay metadata as failure instead of an empty capability snapshot', async ({ page }) => {
	test.setTimeout(120_000)
	await page.route('**/api-proxy/**', async (route) => {
		await route.fulfill({
			contentType: 'application/nostr+json',
			body: JSON.stringify({
				supported_nips: [1, 'eleven'],
			}),
		})
	})

	await page.goto(relayPath)
	await expect(page.getByRole('alert', { name: 'Internal Error' }).first()).toContainText('Failed to load', { timeout: 120_000 })
	await expect(page.getByText('No latest observation available.')).toHaveCount(0)
})
