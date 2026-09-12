import { expect, test, type Page, type Route } from '@playwright/test'
import { stringify } from 'devalue'

import fedimintGatewayBindings from '$/sources/FedimintGatewayd/bindings.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const gatewayId = '02fedimint-gateway-fixture'
const gatewayPath = `/fedimint/gateway/${gatewayId}`
const gatewayApiUrl = 'http://fedimint-gateway.fixture'
const gatewayPassword = 'gateway-password-must-not-reach-the-browser'
const gatewayBindingId = sourceBindingId(fedimintGatewayBindings[Source.FedimintGatewayd_Rest][0])

const gatewayInfo = {
	version_hash: 'fixture-version',
	federations: [],
	gateway_state: 'running',
	lightning_info: {
		not_connected: null,
	},
	lightning_mode: {},
	registrations: {},
}

const gatewayBalances = {
	onchain_balance_sats: 0,
	lightning_balance_msats: 0,
	ecash_balances: [],
	inbound_lightning_liquidity_msats: 0,
}

const gatewayPaymentSummary = {
	outgoing: {
		total_fees: 0,
		total_success: 0,
		total_failure: 0,
	},
	incoming: {
		total_fees: 0,
		total_success: 0,
		total_failure: 0,
	},
}

const gatewayOperations = new Set([
	'getGatewayId',
	'getGatewayInfo',
	'getGatewayBalances',
	'listChannels',
	'getPaymentSummary',
])

const remoteResult = async (
	route: Route,
	remoteId: string,
	payload: string | null,
	result: JsonValue,
) => route.fulfill({
	contentType: 'application/json',
	json: {
		type: 'result',
		data: stringify({
			_: result,
			q: {
				[`${remoteId}/${payload ?? ''}`]: {
					v: result,
				},
			},
		}),
	},
})

const installGatewayRemoteFixture = async (
	page: Page,
	failingOperation?: string,
) => {
	const remoteRequests: string[] = []
	const operationRequests = new Set<string>()
	const unexpectedRequests: string[] = []

	await page.route('**/_app/remote/**', async (route) => {
		const requestUrl = route.request().url()
		const url = new URL(requestUrl)
		const payload = url.searchParams.get('payload')
		const decodedPayload = payload == null ? '' : Buffer.from(payload, 'base64url').toString()
		const remoteId = url.pathname.split('/_app/remote/')[1] ?? ''
		const operation = [...gatewayOperations].find((candidate) => remoteId.endsWith(`/${candidate}`))

		if (remoteId.endsWith('/sourceRuntimeCapabilities') && payload == null) {
			remoteRequests.push(`${route.request().method()} ${requestUrl} sourceRuntimeCapabilities`)
			await remoteResult(route, remoteId, payload, {
				enabledServerBindingIds: [gatewayBindingId],
			})
			return
		}

		if (remoteId.endsWith('/getResolvedGatewayApiUrl') && payload == null) {
			remoteRequests.push(`${route.request().method()} ${requestUrl} getResolvedGatewayApiUrl`)
			await remoteResult(route, remoteId, payload, gatewayApiUrl)
			return
		}

		if (
			operation == null
			|| operation === 'getPaymentSummary' && payload == null
			|| operation !== 'getPaymentSummary' && payload != null
		) {
			unexpectedRequests.push(`${route.request().method()} ${requestUrl} ${decodedPayload}`)
			await route.fulfill({ body: 'Unexpected Fedimint remote fixture request', status: 418 })
			return
		}

		remoteRequests.push(`${route.request().method()} ${requestUrl} ${operation} ${decodedPayload}`)
		operationRequests.add(operation)
		if (operation === failingOperation) {
			await route.fulfill({
				body: 'Fedimint gateway provider fixture failure',
				status: 502,
			})
			return
		}

		const result = operation === 'getGatewayId' ? gatewayId
			: operation === 'getGatewayInfo' ? gatewayInfo
			: operation === 'getGatewayBalances' ? gatewayBalances
			: operation === 'listChannels' ? []
			: gatewayPaymentSummary
		await remoteResult(route, remoteId, payload, result)
	})

	return {
		remoteRequests,
		operationRequests,
		unexpectedRequests,
	}
}

test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-fedimint-gateway-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('renders source-backed gateway identity and one timestamp observation for valid-empty collections', async ({ page }) => {
	const fixture = await installGatewayRemoteFixture(page)
	await page.goto(gatewayPath, { waitUntil: 'domcontentloaded' })

	const main = page.locator('#main')
	await expect(main.getByText(gatewayId, { exact: true }).first()).toBeAttached({ timeout: 120_000 })
	await expect(main.locator(`a[href*="/observations/"][href*="/${Source.FedimintGatewayd_Rest}"]`)).toHaveCount(1)
	await expect(main).toContainText(Source.FedimintGatewayd_Rest)
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
	await expect(main.locator('a[href*="/fedimint/federation/"]')).toHaveCount(0)

	expect(fixture.operationRequests).toEqual(gatewayOperations)
	expect(fixture.unexpectedRequests).toEqual([])
	expect(fixture.remoteRequests.join('\n')).not.toContain(gatewayPassword)
	await expect(page.locator('body')).not.toContainText(gatewayPassword)
})

test('keeps provider failure distinct from valid-empty gateway data', async ({ page }) => {
	const fixture = await installGatewayRemoteFixture(page, 'getGatewayInfo')
	await page.goto(gatewayPath, { waitUntil: 'domcontentloaded' })

	const main = page.locator('#main')
	await expect(main.locator('[data-resource-state="failed"]').first()).toBeAttached({ timeout: 120_000 })
	await expect(main.getByRole('alert').first()).toBeAttached({ timeout: 120_000 })
	await expect(main.locator('a[href*="/observations/"]')).toHaveCount(0)
	await expect(main.locator('a[href*="/fedimint/federation/"]')).toHaveCount(0)

	expect(fixture.operationRequests.has('getGatewayInfo')).toBe(true)
	expect(fixture.unexpectedRequests).toEqual([])
	expect(fixture.remoteRequests.join('\n')).not.toContain(gatewayPassword)
	await expect(page.locator('body')).not.toContainText(gatewayPassword)
})
