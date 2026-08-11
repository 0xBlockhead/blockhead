import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { fetchBridgeRouteBundleForQuoteId } from '$/resolvers/Lifi/Rest/routes.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'

const fetchQuote = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Lifi/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Lifi/Rest/queries.ts')>(),
	fetchQuote,
}))

const quoteId = {
	fromChainId: 1,
	toChainId: 10,
	fromToken: '0x0000000000000000000000000000000000000000',
	toToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	fromAmount: 1_000_000_000_000_000_000n,
	fromAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	slippage: 0.005,
	toAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
} as const

const quoteStep = {
	id: 'quote-step',
	type: 'cross',
	tool: 'across',
	action: {
		fromChainId: quoteId.fromChainId,
		toChainId: quoteId.toChainId,
		fromAmount: String(quoteId.fromAmount),
		fromToken: {
			address: quoteId.fromToken,
			decimals: 18,
			symbol: 'ETH',
			chainId: quoteId.fromChainId,
			name: 'Ether',
		},
		toToken: {
			address: quoteId.toToken,
			decimals: 6,
			symbol: 'USDC',
			chainId: quoteId.toChainId,
			name: 'USD Coin',
		},
		fromAddress: quoteId.fromAddress,
		toAddress: quoteId.toAddress,
		slippage: quoteId.slippage,
	},
	estimate: {
		tool: 'across',
		fromAmount: String(quoteId.fromAmount),
		toAmount: '999000000',
		toAmountMin: '990000000',
		executionDuration: 90,
		feeCosts: [{
			name: 'LI.FI fee',
			amount: '1',
			amountUSD: '0.01',
			token: {
				address: quoteId.fromToken,
				decimals: 18,
				symbol: 'ETH',
				chainId: quoteId.fromChainId,
				name: 'Ether',
			},
		}],
		gasCosts: [{
			type: 'SEND',
			amount: '2',
			amountUSD: '0.02',
			token: {
				address: quoteId.fromToken,
				decimals: 18,
				symbol: 'ETH',
				chainId: quoteId.fromChainId,
				name: 'Ether',
			},
		}],
	},
	includedSteps: [{
		id: 'included-step',
		type: 'cross',
		tool: 'across',
		action: {
			fromChainId: quoteId.fromChainId,
			toChainId: quoteId.toChainId,
			fromAmount: String(quoteId.fromAmount),
			fromToken: {
				address: quoteId.fromToken,
				decimals: 18,
				symbol: 'ETH',
				chainId: quoteId.fromChainId,
				name: 'Ether',
			},
			toToken: {
				address: quoteId.toToken,
				decimals: 6,
				symbol: 'USDC',
				chainId: quoteId.toChainId,
				name: 'USD Coin',
			},
		},
		estimate: {
			tool: 'across',
			fromAmount: String(quoteId.fromAmount),
			toAmount: '999000000',
			toAmountMin: '990000000',
			executionDuration: 90,
		},
	}],
} as const

describe('LI.FI bridge route quote bundle', () => {
	beforeEach(() => {
		fetchQuote.mockReset()
	})

	it('maps fetchQuote output into route fields and included steps', async () => {
		fetchQuote.mockResolvedValue(quoteStep)

		const bundle = await fetchBridgeRouteBundleForQuoteId(quoteId)

		expect(fetchQuote).toHaveBeenCalledWith({
			fromChain: quoteId.fromChainId,
			toChain: quoteId.toChainId,
			fromToken: quoteId.fromToken,
			toToken: quoteId.toToken,
			fromAmount: String(quoteId.fromAmount),
			fromAddress: quoteId.fromAddress,
			slippage: quoteId.slippage,
			toAddress: quoteId.toAddress,
		})
		expect(bundle.routeFields).toMatchObject({
			fromAmount: quoteId.fromAmount,
			toAmount: 999_000_000n,
			toAmountMin: 990_000_000n,
			estimatedCostUsd: 0.03,
			estimatedDurationSeconds: 90,
			tags: [],
		})
		expect(bundle.steps).toHaveLength(1)
		expect(bundle.steps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$route: quoteId,
				indexInRoute: 0,
			},
			stepType: 'cross',
			tool: 'across',
		})
	})

	it('does not retain a live quote beyond its resolving request', async () => {
		fetchQuote.mockResolvedValue(quoteStep)

		await fetchBridgeRouteBundleForQuoteId(quoteId)
		await fetchBridgeRouteBundleForQuoteId(quoteId)

		expect(fetchQuote).toHaveBeenCalledTimes(2)
	})

	it('rejects quote transport failures without caching a soft-empty bundle', async () => {
		const failingQuoteId = {
			...quoteId,
			fromChainId: 42161,
			toChainId: 8453,
		}
		fetchQuote.mockRejectedValue(new Error('Lifi_Rest /v1/quote: 404'))

		await expect(fetchBridgeRouteBundleForQuoteId(failingQuoteId)).rejects.toThrow('404')
		await expect(fetchBridgeRouteBundleForQuoteId(failingQuoteId)).rejects.toThrow('404')
		expect(fetchQuote).toHaveBeenCalledTimes(2)
	})
})
