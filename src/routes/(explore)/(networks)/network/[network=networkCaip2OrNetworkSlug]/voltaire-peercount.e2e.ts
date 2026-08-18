import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'


const networkPath = '/network/eip155:1'
const voltaireOrigins = new Set([
	'https://ethereum.publicnode.com',
	'https://eth.drpc.org',
	'https://eth.llamarpc.com',
	'https://mainnet.rpc.buidlguidl.com',
])


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-voltaire-peercount-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('Ethereum network page attaches Voltaire net_peerCount as Execution peerCount 17', async ({ page }) => {
	const voltaireMethods: string[] = []
	await page.route('**/api-proxy/**', async (route) => {
		let providerUrl
		try {
			providerUrl = new URL(decodeURIComponent(
				new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
			))
		} catch {
			await route.fulfill({
				json: {},
			})
			return
		}

		if (!voltaireOrigins.has(providerUrl.origin)) {
			await route.fulfill({
				json: {},
			})
			return
		}

		const request = JSON.parse(route.request().postData() ?? '{}')
		voltaireMethods.push(request.method)
		await route.fulfill({
			json: {
				jsonrpc: '2.0',
				id: request.id,
				result: (
					request.method === 'net_peerCount' ?
						'0x11'
					:
						null
				),
			},
		})
	})

	await page.goto(networkPath, {
		waitUntil: 'load',
	})
	await expectMainVisible(page)

	const observations = page.locator('#main').getByRole('region', {
		name: 'Endpoint observations',
	})
	const executionObservation = observations.locator('article').filter({
		hasText: 'EvmExecutionJsonRpc',
	}).filter({
		hasText: 'Voltaire_JsonRpc',
	}).first()
	const empty = observations.getByText('No endpoint observations.')

	await expect(page.locator('#main').getByRole('heading', {
		name: 'Endpoint observations',
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(executionObservation.or(empty)).toBeAttached({
		timeout: 120_000,
	})
	await expect(executionObservation).toBeAttached()
	await expect(executionObservation.getByText('17', {
		exact: true,
	})).toBeAttached()
	expect(voltaireMethods).toContain('net_peerCount')
})
