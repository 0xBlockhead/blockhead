import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getLatestPairs,
	getPairSearch,
	getTokenPairs,
} from '$/sources/Dexscreener/OpenApi/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const binding = {
	provider: SourceProvider.Dexscreener,
	source: Source.Dexscreener_OpenApi,
	target: {
		kind: SourceTargetKind.Global,
		key: 'dexscreener-openapi',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.dexscreener.com',
		origin: 'https://api.dexscreener.com',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.OpenApiHttp,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.None,
	}],
	proxyId: 'Dexscreener_OpenApi-0',
} as const satisfies SourceBinding

const pair = {
	chainId: 'ethereum',
	dexId: 'uniswap',
	pairAddress: '0x1111111111111111111111111111111111111111',
	url: 'https://dexscreener.com/ethereum/0x1111111111111111111111111111111111111111',
	labels: ['v3'],
	baseToken: {
		address: '0x2222222222222222222222222222222222222222',
		name: 'Wrapped Ether',
		symbol: 'WETH',
	},
	quoteToken: {
		address: '0x3333333333333333333333333333333333333333',
		name: 'USD Coin',
		symbol: 'USDC',
	},
	priceNative: '0.000000000000000001',
	priceUsd: '3500.123456789012345678',
	txns: {
		h24: {
			buys: 123,
			sells: 45,
		},
	},
	volume: {
		h24: 1_234_567.89,
	},
	priceChange: {
		h24: -1.25,
	},
	liquidity: {
		usd: 9_876_543.21,
		base: 1_000,
		quote: 3_500_000,
	},
	fdv: 4_000_000_000,
	marketCap: 3_900_000_000,
	pairCreatedAt: 1_700_000_000_000,
}

describe('Dexscreener public pair observations', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	beforeEach(() => {
		getJson.mockReset()
	})

	it('preserves exact pair/token/dex identity and metric units with provenance', async () => {
		getJson.mockResolvedValue({ pairs: [pair] })

		await expect(getLatestPairs({
			binding,
			chainId: pair.chainId,
			pairId: pair.pairAddress,
			resolvedAtMs: 1_725_000_000_000,
		})).resolves.toEqual({
			pairs: [{
				source: Source.Dexscreener_OpenApi,
				resolvedAtMs: 1_725_000_000_000,
				...pair,
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/latest/dex/pairs/${pair.chainId}/${pair.pairAddress}`
		)
	})

	it('requires token-pair rows to contain the exact requested token', async () => {
		getJson
			.mockResolvedValueOnce([pair])
			.mockResolvedValueOnce([pair])

		await expect(getTokenPairs({
			binding,
			chainId: pair.chainId,
			tokenAddress: pair.baseToken.address,
		})).resolves.toHaveLength(1)
		await expect(getTokenPairs({
			binding,
			chainId: pair.chainId,
			tokenAddress: '0x4444444444444444444444444444444444444444',
		})).rejects.toThrow('does not match requested identity')
	})

	it.each([
		[
			'foreign pair identity',
			{ pairs: [{ ...pair, chainId: 'base' }] },
			'requested identity',
		],
		[
			'noncanonical price units',
			{ pairs: [{ ...pair, priceUsd: '1e18' }] },
			'price units',
		],
		[
			'fractional transaction counts',
			{
				pairs: [{
					...pair,
					txns: { h24: { buys: 1.5, sells: 2 } },
				}],
			},
			'h24 buys',
		],
	])('rejects %s', async (_label, response, message) => {
		getJson.mockResolvedValue(response)
		await expect(getLatestPairs({
			binding,
			chainId: pair.chainId,
			pairId: pair.pairAddress,
		})).rejects.toThrow(message)
	})

	it('bounds and deduplicates search results', async () => {
		getJson.mockResolvedValue({
			pairs: [
				pair,
				pair,
			],
		})
		await expect(getPairSearch({
			binding,
			q: 'WETH USDC',
		})).rejects.toThrow('pair cardinality')
	})

	it.each([
		[
			'foreign source',
			{
				...binding,
				source: Source.Axelarscan_Rest,
			},
		],
		[
			'direct delivery',
			{
				...binding,
				delivery: SourceDelivery.BrowserDirect,
			},
		],
	])('rejects a %s binding without transport', async (_label, invalidBinding) => {
		const directFetch = vi.fn()
		vi.stubGlobal('fetch', directFetch)

		await expect(getLatestPairs({
			binding: invalidBinding,
			chainId: pair.chainId,
			pairId: pair.pairAddress,
		})).rejects.toThrow('canonical proxied source binding')
		expect(getJson).not.toHaveBeenCalled()
		expect(directFetch).not.toHaveBeenCalled()
	})
})
