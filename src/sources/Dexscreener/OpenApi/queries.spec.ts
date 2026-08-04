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
	getTokens,
} from '$/sources/Dexscreener/OpenApi/queries.ts'
import bindings from '$/sources/Dexscreener/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const binding = bindings[Source.Dexscreener_Rest][0]

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
		vi.useRealTimers()
	})

	beforeEach(() => {
		getJson.mockReset()
		vi.useFakeTimers()
		vi.setSystemTime(1_725_000_000_000)
	})

	it('preserves the endpoint pair shape, exact identity, metric units, and resolution clock', async () => {
		getJson.mockResolvedValue({ pairs: [pair] })

		await expect(getLatestPairs({
			chainId: pair.chainId,
			pairId: pair.pairAddress,
		})).resolves.toEqual({
			pairs: [{
				...pair,
				resolvedAtMs: 1_725_000_000_000,
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/latest/dex/pairs/${pair.chainId}/${pair.pairAddress}`
		)
	})

	it('rejects empty latest-pair payloads instead of soft-empty success', async () => {
		getJson.mockResolvedValue({ pairs: [] })
		await expect(getLatestPairs({
			chainId: pair.chainId,
			pairId: pair.pairAddress,
		})).rejects.toThrow('pair not found')
	})

	it('accepts valid empty list envelopes for supported token and search lists', async () => {
		getJson
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({ pairs: [] })

		await expect(getTokenPairs({
			chainId: pair.chainId,
			tokenAddress: pair.baseToken.address,
		})).resolves.toEqual([])
		await expect(getTokens({
			chainId: pair.chainId,
			tokenAddresses: [pair.baseToken.address],
		})).resolves.toEqual([])
		await expect(getPairSearch({
			q: 'no matching pools',
		})).resolves.toEqual({ pairs: [] })
	})

	it('rejects malformed pair-list envelopes instead of treating them as empty lists', async () => {
		getJson
			.mockResolvedValueOnce({ pairs: null })
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce({ pairs: null })

		await expect(getLatestPairs({
			chainId: pair.chainId,
			pairId: pair.pairAddress,
		})).rejects.toThrow('response envelope')
		await expect(getTokenPairs({
			chainId: pair.chainId,
			tokenAddress: pair.baseToken.address,
		})).rejects.toThrow('response envelope')
		await expect(getTokens({
			chainId: pair.chainId,
			tokenAddresses: [pair.baseToken.address],
		})).rejects.toThrow('response envelope')
		await expect(getPairSearch({
			q: 'WETH USDC',
		})).rejects.toThrow('response envelope')
	})

	it('requires token-pair rows to contain the exact requested token', async () => {
		getJson
			.mockResolvedValueOnce([pair])
			.mockResolvedValueOnce([pair])

		await expect(getTokenPairs({
			chainId: pair.chainId,
			tokenAddress: pair.baseToken.address,
		})).resolves.toEqual([{
			...pair,
			resolvedAtMs: 1_725_000_000_000,
		}])
		await expect(getTokenPairs({
			chainId: pair.chainId,
			tokenAddress: '0x4444444444444444444444444444444444444444',
		})).rejects.toThrow('does not match requested identity')
	})

	it('rejects token-list rows outside the requested chain', async () => {
		getJson.mockResolvedValue([{ ...pair, chainId: 'base' }])

		await expect(getTokenPairs({
			chainId: pair.chainId,
			tokenAddress: pair.baseToken.address,
		})).rejects.toThrow('does not match requested identity')
	})

	it('loads multi-token pair rows for the requested addresses', async () => {
		getJson.mockResolvedValue([pair])
		await expect(getTokens({
			chainId: pair.chainId,
			tokenAddresses: [
				pair.baseToken.address,
				pair.quoteToken.address,
			],
		})).resolves.toEqual([{
			...pair,
			resolvedAtMs: 1_725_000_000_000,
		}])
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/tokens/v1/${pair.chainId}/${pair.baseToken.address},${pair.quoteToken.address}`
		)
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
			q: 'WETH USDC',
		})).rejects.toThrow('pair cardinality')
	})
})
