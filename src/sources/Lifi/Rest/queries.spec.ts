import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	fetchChains,
	fetchQuote,
	fetchTokens,
	fetchTools,
} from '$/sources/Lifi/Rest/queries.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'

vi.mock('$/sources/Lifi/Rest/client.ts', () => ({
	lifiRestFetch: vi.fn(),
}))

const request = {
	fromChain: 1,
	toChain: 10,
	fromToken: '0x0000000000000000000000000000000000000000',
	toToken: '0x1111111111111111111111111111111111111111',
	fromAmount: '1000000000000000000000000000000000001',
	fromAddress: '0x2222222222222222222222222222222222222222',
	toAddress: '0x3333333333333333333333333333333333333333',
	slippage: 0.005,
}

const quote = {
	id: 'quote-step',
	type: 'cross',
	tool: 'across',
	action: {
		fromChainId: request.fromChain,
		toChainId: request.toChain,
		fromAmount: request.fromAmount,
		fromToken: {
			address: request.fromToken,
			decimals: 18,
			symbol: 'ETH',
			chainId: request.fromChain,
			name: 'Ether',
		},
		toToken: {
			address: request.toToken,
			decimals: 6,
			symbol: 'USDC',
			chainId: request.toChain,
			name: 'USD Coin',
		},
		fromAddress: request.fromAddress,
		toAddress: request.toAddress,
		slippage: request.slippage,
	},
	estimate: {
		tool: 'across',
		fromAmount: request.fromAmount,
		toAmount: '999999999999999999999999999999999999',
		toAmountMin: '990000000000000000000000000000000000',
		executionDuration: 90,
		feeCosts: [{
			amount: '1',
			amountUSD: '0.000000000000000001',
			percentage: '0.000000000000000001',
		}],
		gasCosts: [{
			amount: '2',
			amountUSD: '0.000000000000000002',
		}],
	},
	transactionRequest: {
		to: '0x4444444444444444444444444444444444444444',
		data: '0xdeadbeef',
	},
}

describe('LI.FI public quote observations', () => {
	beforeEach(() => {
		vi.mocked(lifiRestFetch).mockReset()
	})

	it('preserves request identity and lossless units while discarding signing payloads', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify(quote)))

		const result = await fetchQuote(request)

		expect(lifiRestFetch).toHaveBeenCalledWith(
			expect.stringContaining(`fromAmount=${request.fromAmount}`)
		)
		expect(result.estimate).toEqual(quote.estimate)
		expect(result.action).toEqual(quote.action)
		expect(result).not.toHaveProperty('transactionRequest')
	})

	it.each([
		[
			'foreign subject identity',
			{ action: { ...quote.action, toChainId: 137 } },
		],
		[
			'amount bounds',
			{
				estimate: {
					...quote.estimate,
					toAmount: '1',
					toAmountMin: '2',
				},
			},
		],
		[
			'malformed fee units',
			{
				estimate: {
					...quote.estimate,
					feeCosts: [{
						amount: '1.5',
						amountUSD: 'not-a-decimal',
					}],
				},
			},
		],
	])('rejects %s', async (_label, override) => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			...quote,
			...override,
		})))

		await expect(fetchQuote(request)).rejects.toThrow('Lifi_Rest:')
	})

	it('rejects excessive or duplicate included steps', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			...quote,
			includedSteps: Array.from(
				{ length: 33 },
				() => quote
			),
		})))

		await expect(fetchQuote(request)).rejects.toThrow('included quote steps')
	})
})

describe('LI.FI public catalogs', () => {
	beforeEach(() => {
		vi.mocked(lifiRestFetch).mockReset()
	})

	it('preserves exact chain, token, bridge, and exchange identities', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response(JSON.stringify({
				chains: [{
					id: 1,
					key: 'eth',
					name: 'Ethereum',
					coin: 'ETH',
					mainnet: true,
				}],
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tokens: {
					1: [quote.action.fromToken],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				bridges: [{
					key: 'across',
					name: 'Across',
					supportedChains: [{
						fromChainId: 1,
						toChainId: 10,
					}],
				}],
				exchanges: [{
					key: 'uniswap',
					name: 'Uniswap',
					supportedChains: [1],
				}],
			})))

		await expect(fetchChains()).resolves.toMatchObject({ chains: [{ id: 1 }] })
		await expect(fetchTokens()).resolves.toMatchObject({ tokens: { 1: [{ chainId: 1 }] } })
		await expect(fetchTools()).resolves.toMatchObject({
			bridges: [{
				key: 'across',
				supportedChains: [{
					fromChainId: '1',
					toChainId: '10',
				}],
			}],
			exchanges: [{ key: 'uniswap' }],
		})
	})

	it('rejects foreign token buckets and duplicate bridge support pairs', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tokens: {
					10: [quote.action.fromToken],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				bridges: [{
					key: 'across',
					name: 'Across',
					supportedChains: [
						{ fromChainId: '1', toChainId: '10' },
						{ fromChainId: '1', toChainId: '10' },
					],
				}],
			})))

		await expect(fetchTokens()).rejects.toThrow('tokens catalog')
		await expect(fetchTools()).rejects.toThrow('tools catalog')
	})
})
