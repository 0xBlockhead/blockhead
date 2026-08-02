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
	fetchTransferStatus,
} from '$/sources/Lifi/Rest/queries.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'
import type {
	LifiQuoteStep,
	LifiToken,
} from '$/sources/Lifi/Rest/types.ts'
import bindings from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'

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

const fromToken = {
	address: request.fromToken,
	decimals: 18,
	symbol: 'ETH',
	chainId: request.fromChain,
	name: 'Ether',
} satisfies LifiToken

const toToken = {
	address: request.toToken,
	decimals: 6,
	symbol: 'USDC',
	chainId: request.toChain,
	name: 'USD Coin',
} satisfies LifiToken

const quote = {
	id: 'quote-step',
	type: 'cross',
	tool: 'across',
	action: {
		fromChainId: request.fromChain,
		toChainId: request.toChain,
		fromAmount: request.fromAmount,
		fromToken,
		toToken,
		fromAddress: request.fromAddress,
		toAddress: request.toAddress,
		slippage: request.slippage,
	},
	estimate: {
		tool: 'across',
		fromAmount: request.fromAmount,
		toAmount: '999999999999999999999999999999999999',
		toAmountMin: '990000000000000000000000000000000000',
		approvalAddress: '0x4444444444444444444444444444444444444444',
		executionDuration: 90,
		feeCosts: [{
			name: 'LI.FI fee',
			amount: '1',
			amountUSD: '0.000000000000000001',
			percentage: '0.000000000000000001',
			token: fromToken,
			included: true,
		}],
		gasCosts: [{
			type: 'SEND',
			amount: '2',
			amountUSD: '0.000000000000000002',
			token: fromToken,
		}],
	},
	transactionRequest: {
		to: '0x4444444444444444444444444444444444444444',
		data: '0xdeadbeef',
	},
} satisfies LifiQuoteStep

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

	it('preserves endpoint-native chain, token, bridge, and exchange identities', async () => {
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

		await expect(fetchChains({ chainTypes: 'EVM' })).resolves.toMatchObject({ chains: [{ id: 1 }] })
		await expect(fetchTokens({
			chains: '1',
			tags: 'stablecoin',
			chainTypes: 'EVM',
			minPriceUSD: 0.01,
		})).resolves.toMatchObject({ tokens: { 1: [{ chainId: 1 }] } })
		await expect(fetchTools()).resolves.toMatchObject({
			bridges: [{
				key: 'across',
				supportedChains: [{
					fromChainId: 1,
					toChainId: 10,
				}],
			}],
			exchanges: [{ key: 'uniswap' }],
		})
		expect(lifiRestFetch).toHaveBeenNthCalledWith(1, '/v1/chains?chainTypes=EVM')
		expect(lifiRestFetch).toHaveBeenNthCalledWith(
			2,
			'/v1/tokens?chains=1&tags=stablecoin&chainTypes=EVM&minPriceUSD=0.01'
		)
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

describe('LI.FI transfer status', () => {
	beforeEach(() => {
		vi.mocked(lifiRestFetch).mockReset()
	})

	it('uses the exact official status query and preserves its discriminated response', async () => {
		const status = {
			sending: {
				txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				txLink: 'https://example.com/source',
				amount: '100',
				token: fromToken,
				chainId: 1,
			},
			receiving: {
				txHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				txLink: 'https://example.com/destination',
				amount: '98',
				token: toToken,
				chainId: 10,
			},
			status: 'DONE',
			substatus: 'COMPLETED',
			tool: 'across',
			transactionId: 'lifi-transfer-id',
		} as const
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify(status)))

		await expect(fetchTransferStatus({
			txHash: status.sending.txHash,
			bridge: 'across',
			fromChain: '1',
			toChain: '10',
		})).resolves.toEqual(status)
		expect(lifiRestFetch).toHaveBeenCalledWith(
			`/v1/status?txHash=${status.sending.txHash}&bridge=across&fromChain=1&toChain=10`
		)
	})

	it('shares the canonical LI.FI REST source binding', () => {
		expect(Object.keys(bindings)).toEqual([Source.Lifi_Rest])
		expect(bindings[Source.Lifi_Rest][0].source).toBe(Source.Lifi_Rest)
	})

	it('rejects an empty transfer identifier before transport', async () => {
		await expect(fetchTransferStatus({ txHash: ' ' })).rejects.toThrow(
			'transfer status requires'
		)
		expect(lifiRestFetch).not.toHaveBeenCalled()
	})
})
