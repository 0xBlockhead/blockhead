import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

const {
	sourceFetch,
	throwHttpError,
} = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	throwHttpError: vi.fn(async () => {
		throw new Error('http error')
	}),
}))

vi.mock('$/sources/FedimintGatewayd/bindings.ts', () => ({
	default: {
		FedimintGatewayd_Rest: [
			{
				source: 'FedimintGatewayd_Rest',
				target: { key: 'fedimint-gatewayd' },
				endpoints: [{
					endpointKind: 'HttpUrl',
					locator: 'env:FEDIMINT_GATEWAYD_URL',
					corsEnabled: false,
				}],
			},
		],
	},
}))
vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$/sources/_runtime/http.ts')>()
	return {
		...actual,
		sourceFetch,
		sourceGetJson: vi.fn(),
	}
})
vi.mock('$/lib/http.ts', () => ({
	throwHttpError,
}))

const {
	getGatewayBalances,
	getGatewayId,
	getGatewayInfo,
	getPaymentSummary,
	listChannels,
	resolvedGatewayApiUrl,
} = await import('$/sources/FedimintGatewayd/Rest/queries.ts')

const publicEnv = {
	FEDIMINT_GATEWAYD_URL: 'http://127.0.0.1:8175',
	FEDIMINT_GATEWAYD_PASSWORD: 'gateway-pass',
}

const jsonResponse = (
	body: unknown
) => ({
	ok: true,
	json: async () => body,
})

beforeEach(() => {
	sourceFetch.mockReset()
})

it('reads public gateway id without Bearer auth', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse('02abc'))

	await expect(getGatewayId({
		publicEnv,
	})).resolves.toBe('02abc')

	expect(sourceFetch.mock.calls[0]?.[1]).toBe('http://127.0.0.1:8175/v1/id')
	expect(sourceFetch.mock.calls[0]?.[2]?.headers?.authorization).toBeUndefined()
})

it('reads authenticated info / balances / channels with Bearer and fails closed on malformed envelopes', async () => {
	const info = {
		version_hash: 'abc',
		federations: [],
		gateway_state: 'running',
		lightning_info: {
			not_connected: null,
		},
		lightning_mode: {
			Ldk: {
				lightning_port: 9735,
				alias: 'gw',
			},
		},
		registrations: {},
	}
	sourceFetch
		.mockResolvedValueOnce(jsonResponse(info))
		.mockResolvedValueOnce(jsonResponse({
			onchain_balance_sats: 1,
			lightning_balance_msats: 2,
			ecash_balances: [],
			inbound_lightning_liquidity_msats: 3,
		}))
		.mockResolvedValueOnce(jsonResponse([]))
		.mockResolvedValueOnce(jsonResponse({
			keysets: true,
		}))

	await expect(getGatewayInfo({
		publicEnv,
	})).resolves.toMatchObject({
		version_hash: 'abc',
		gateway_state: 'running',
	})
	await expect(getGatewayBalances({
		publicEnv,
	})).resolves.toMatchObject({
		onchain_balance_sats: 1,
		lightning_balance_msats: 2,
	})
	await expect(listChannels({
		publicEnv,
	})).resolves.toEqual([])
	await expect(getGatewayInfo({
		publicEnv,
	})).rejects.toThrow('FedimintGatewayd_Rest: invalid gateway info response envelope')

	expect(sourceFetch.mock.calls[0]?.[1]).toBe('http://127.0.0.1:8175/v1/info')
	expect(sourceFetch.mock.calls[0]?.[2]?.redirect).toBe('manual')
	expect(sourceFetch.mock.calls[0]?.[2]?.headers?.authorization).toBe('Bearer gateway-pass')
	expect(sourceFetch.mock.calls[1]?.[1]).toBe('http://127.0.0.1:8175/v1/balances')
	expect(sourceFetch.mock.calls[2]?.[1]).toBe('http://127.0.0.1:8175/v1/list_channels')
})

it('posts payment summary with an explicit observation window', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		outgoing: {
			total_fees: 0,
			total_success: 1,
			total_failure: 0,
		},
		incoming: {
			total_fees: 0,
			total_success: 0,
			total_failure: 0,
		},
	}))

	await expect(getPaymentSummary({
		publicEnv,
		startMs: 10,
		endMs: 20,
	})).resolves.toMatchObject({
		outgoing: {
			total_success: 1,
		},
	})
	expect(sourceFetch.mock.calls[0]?.[1]).toBe('http://127.0.0.1:8175/v1/payment_summary')
	expect(sourceFetch.mock.calls[0]?.[2]?.method).toBe('POST')
	expect(JSON.parse(sourceFetch.mock.calls[0]?.[2]?.body)).toEqual({
		start_millis: 10,
		end_millis: 20,
	})
})

it('rejects duplicate federation balances and invalid payment observation windows before transport', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		onchain_balance_sats: 1,
		lightning_balance_msats: 2,
		ecash_balances: [
			{
				federation_id: 'fed-1',
				ecash_balance_msats: 3,
			},
			{
				federation_id: 'fed-1',
				ecash_balance_msats: 4,
			},
		],
		inbound_lightning_liquidity_msats: 5,
	}))

	await expect(getGatewayBalances({
		publicEnv,
	})).rejects.toThrow('duplicate federation')
	await expect(getPaymentSummary({
		publicEnv,
		startMs: 20,
		endMs: 20,
	})).rejects.toThrow('window end must follow its start')
	await expect(getPaymentSummary({
		publicEnv,
		startMs: -1,
		endMs: 20,
	})).rejects.toThrow('non-negative safe millisecond timestamps')

	expect(sourceFetch).toHaveBeenCalledOnce()
})

it('rejects duplicate federation identities in the gateway information response', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		version_hash: 'abc',
		federations: [
			{
				federation_id: 'fed-1',
				balance_msat: 3,
				config: {
					invite_code: 'invite',
					federation_index: 0,
					lightning_fee: {
						base: 0,
						parts_per_million: 0,
					},
					transaction_fee: {
						base: 0,
						parts_per_million: 0,
					},
				},
			},
			{
				federation_id: 'fed-1',
				balance_msat: 4,
				config: {
					invite_code: 'invite',
					federation_index: 1,
					lightning_fee: {
						base: 0,
						parts_per_million: 0,
					},
					transaction_fee: {
						base: 0,
						parts_per_million: 0,
					},
				},
			},
		],
		gateway_state: 'running',
		lightning_info: {
			not_connected: null,
		},
		lightning_mode: {},
		registrations: {},
	}))

	await expect(getGatewayInfo({
		publicEnv,
	})).rejects.toThrow('duplicate federation')
})

it('fails closed when admin password env is missing', async () => {
	await expect(getGatewayInfo({
		publicEnv: {
			FEDIMINT_GATEWAYD_URL: 'http://127.0.0.1:8175',
		},
	})).rejects.toThrow('FedimintGatewayd_Rest: missing FEDIMINT_GATEWAYD_PASSWORD')
})

it('rejects credentialed and non-HTTP gateway URLs before a remote request or visible API projection', async () => {
	for (const gatewayUrl of [
		'http://operator:password@127.0.0.1:8175',
		'ftp://127.0.0.1:8175',
	]) {
		await expect(getGatewayId({
			publicEnv: {
				FEDIMINT_GATEWAYD_URL: gatewayUrl,
			},
		})).rejects.toThrow('gateway URL must be an unauthenticated HTTP URL')
		expect(() => resolvedGatewayApiUrl({
			FEDIMINT_GATEWAYD_URL: gatewayUrl,
		})).toThrow('gateway URL must be an unauthenticated HTTP URL')
	}

	expect(sourceFetch).not.toHaveBeenCalled()
})
