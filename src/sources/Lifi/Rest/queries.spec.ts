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
					fromChainId: '1',
					toChainId: '10',
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

	it('normalizes mixed string/number tool chain ids without soft-empty success', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			bridges: [{
				key: 'across',
				name: 'Across',
				supportedChains: [{
					fromChainId: '1',
					toChainId: 10,
				}],
			}],
			exchanges: [{
				key: 'uniswap',
				name: 'Uniswap',
				supportedChains: ['1', 10],
			}],
		})))

		await expect(fetchTools()).resolves.toEqual({
			bridges: [{
				key: 'across',
				name: 'Across',
				supportedChains: [{
					fromChainId: '1',
					toChainId: '10',
				}],
			}],
			exchanges: [{
				key: 'uniswap',
				name: 'Uniswap',
				supportedChains: ['1', '10'],
			}],
		})
	})

	it('preserves exact SVM-scale chain ids above Number.MAX_SAFE_INTEGER', async () => {
		const solanaScaleChainId = 9_270_000_000_000_000
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			bridges: [{
				key: 'allbridge',
				name: 'Allbridge',
				supportedChains: [{
					fromChainId: 1,
					toChainId: solanaScaleChainId,
				}],
			}],
			exchanges: [{
				key: 'jupiter',
				name: 'Jupiter',
				supportedChains: [solanaScaleChainId],
			}],
		})))

		await expect(fetchTools()).resolves.toEqual({
			bridges: [{
				key: 'allbridge',
				name: 'Allbridge',
				supportedChains: [{
					fromChainId: '1',
					toChainId: '9270000000000000',
				}],
			}],
			exchanges: [{
				key: 'jupiter',
				name: 'Jupiter',
				supportedChains: ['9270000000000000'],
			}],
		})
	})

	it('hard-fails HTTP errors instead of soft-empty catalogs', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response('missing', { status: 404 }))
			.mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
			.mockResolvedValueOnce(new Response('upstream', { status: 500 }))

		await expect(fetchChains()).rejects.toThrow(/Lifi_Rest \/v1\/chains.*404/)
		await expect(fetchTokens()).rejects.toThrow(/Lifi_Rest \/v1\/tokens.*429/)
		await expect(fetchTools()).rejects.toThrow(/Lifi_Rest \/v1\/tools.*500/)
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

	it('preserves official NOT_FOUND without inventing transfer legs', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			status: 'NOT_FOUND',
		})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).resolves.toEqual({
			status: 'NOT_FOUND',
		})
	})

	it('preserves official INVALID without requiring transfer legs', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response(JSON.stringify({
			status: 'INVALID',
			substatusMessage: 'Unsupported transaction hash.',
		})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).resolves.toEqual({
			status: 'INVALID',
			substatusMessage: 'Unsupported transaction hash.',
		})
	})

	it('rejects empty 200s and nonempty NOT_FOUND envelopes', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response(JSON.stringify({})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'NOT_FOUND',
				sending: {
					txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					amount: '100',
					token: fromToken,
					chainId: 1,
				},
			})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed transfer status')
		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed empty transfer status')
	})

	it('rejects unknown statuses and blank canonical transfer identities', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'FOREIGN',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'PENDING',
				tool: 'across',
				transactionId: ' ',
				sending: {
					txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					txLink: 'https://example.com/source',
					amount: '100',
					token: fromToken,
					chainId: 1,
				},
			})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed transfer status')
		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed transfer status')
	})

	it('validates receiving legs and rejects empty tool names', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'PENDING',
				tool: '',
				sending: {
					txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					txLink: 'https://example.com/source',
					amount: '100',
					token: fromToken,
					chainId: 1,
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'DONE',
				tool: 'across',
				transactionId: 'lifi-transfer-id',
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
					amount: '1.5',
					token: toToken,
					chainId: 10,
				},
			})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed transfer status')
		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('receiving transfer leg')
	})

	it('hard-fails status HTTP errors and incomplete non-NOT_FOUND payloads', async () => {
		vi.mocked(lifiRestFetch)
			.mockResolvedValueOnce(new Response('missing', { status: 404 }))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				status: 'PENDING',
			})))

		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow(/Lifi_Rest \/v1\/status.*404/)
		await expect(fetchTransferStatus({
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})).rejects.toThrow('malformed transfer status')
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

describe('LI.FI quote HTTP failures', () => {
	beforeEach(() => {
		vi.mocked(lifiRestFetch).mockReset()
	})

	it('hard-fails quote HTTP errors instead of soft-empty routes', async () => {
		vi.mocked(lifiRestFetch).mockResolvedValue(new Response('no route', { status: 404 }))

		await expect(fetchQuote(request)).rejects.toThrow(/Lifi_Rest \/v1\/quote.*404/)
	})
})
