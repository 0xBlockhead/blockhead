import {
	expect,
	test,
} from '@playwright/test'


test('IBC packet route visibly preserves source commitment identity and state', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/rest.cosmos.directory/cosmoshub/**', async (route) => {
		const url = new URL(route.request().url())
		if (url.pathname.endsWith('/packet_commitments/42')) {
			await route.fulfill({
				json: {
					commitment: 'AQIDBA==',
					proof: 'proof',
					proof_height: {
						revision_number: '4',
						revision_height: '22000000',
					},
				},
			})
			return
		}

		if (url.pathname.endsWith('/channels/channel-141/ports/transfer')) {
			await route.fulfill({
				json: {
					channel: {
						state: 'STATE_OPEN',
						ordering: 'ORDER_UNORDERED',
						counterparty: {
							port_id: 'transfer',
							channel_id: 'channel-0',
						},
						connection_hops: [
							'connection-257',
						],
						version: 'ics20-1',
					},
				},
			})
			return
		}

		if (url.pathname.endsWith('/connections/connection-257')) {
			await route.fulfill({
				json: {
					connection: {
						client_id: '07-tendermint-259',
						state: 'STATE_OPEN',
						counterparty: {
							client_id: '07-tendermint-0',
							connection_id: 'connection-0',
						},
						delay_period: '0',
					},
				},
			})
			return
		}

		if (url.pathname.endsWith('/client_states/07-tendermint-259')) {
			await route.fulfill({
				json: {
					client_state: {
						'@type': '/ibc.lightclients.tendermint.v1.ClientState',
						chain_id: 'osmosis-1',
						trust_level: {
							numerator: '1',
							denominator: '3',
						},
						trusting_period: '1209600s',
						unbonding_period: '1814400s',
						max_clock_drift: '600s',
						frozen_height: {
							revision_number: '0',
							revision_height: '0',
						},
						latest_height: {
							revision_number: '1',
							revision_height: '20000000',
						},
					},
				},
			})
			return
		}

		if (url.pathname.endsWith('/next_sequence_send')) {
			await route.fulfill({ json: { next_sequence_send: '43' } })
			return
		}

		if (url.pathname.endsWith('/next_sequence')) {
			await route.fulfill({ json: { next_sequence_receive: '40' } })
			return
		}

		await route.abort()
	})

	await page.goto('/network/cosmos/ibc-channels/transfer/channel-141/packet/42/source', {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main')).toContainText('Packet #42', { timeout: 120_000 })
	await expect(page.locator('#main')).toContainText('source')
	await expect(page.locator('#main')).toContainText('committed')
	await expect(page.locator('#main')).toContainText('base64:AQIDBA==')
	await expect(page.locator('#main')).toContainText('STATE_OPEN channel-141')
})
