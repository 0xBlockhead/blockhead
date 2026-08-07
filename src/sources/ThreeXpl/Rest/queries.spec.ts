import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ThreeXpl/bindings.ts'
import type {
	ThreeXplBlockResponse,
	ThreeXplBlocksResponse,
	ThreeXplGeneralInfoResponse,
	ThreeXplTransactionResponse,
} from '$/sources/ThreeXpl/Rest/types.ts'

const { sourceFetch } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	fetchBlock,
	fetchBlocks,
	fetchChainStats,
	fetchTransaction,
	threeXplListLimit,
} = await import('$/sources/ThreeXpl/Rest/queries.ts')

const binding = bindings[Source.ThreeXpl_Rest][0]

const jsonResponse = (
	body: unknown
) => ({
	ok: true,
	json: async () => body,
})

describe('ThreeXpl REST arktype envelopes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('clamps list limits to the documented enum', () => {
		expect(threeXplListLimit(1)).toBe(1)
		expect(threeXplListLimit(7)).toBe(10)
		expect(threeXplListLimit(64)).toBe(100)
		expect(threeXplListLimit(250)).toBe(1000)
		expect(() => threeXplListLimit(0)).toThrow('ThreeXpl_Rest: limit must be a positive safe integer')
	})

	it('accepts chain stats / blocks / block / transaction envelopes', async () => {
		const stats = {
			data: {
				blockchains: {
					monero: {
						best_block: 3_734_577,
						best_block_hash: 'best-hash',
						best_block_time: '2026-08-07T00:59:20.000000Z',
					},
				},
			},
			context: {
				code: 200,
			},
		} satisfies ThreeXplGeneralInfoResponse
		const blocks = {
			data: {
				blocks: {
					'3734577': {
						hash: 'tip-hash',
						time: '2026-08-07T00:59:20.000000Z',
						events: {
							'monero-main': 11,
						},
					},
				},
			},
		} satisfies ThreeXplBlocksResponse
		const block = {
			data: {
				block: {
					block: 3_734_570,
					hash: 'block-hash',
					time: '2026-08-07T00:53:54.000000Z',
					events: {
						'monero-main': 255,
					},
				},
				events: {
					'monero-main': [{
						transaction: 'tx-hash',
						sort_key: 0,
						address: 'the-void',
						currency: 'monero',
						effect: '-612586560000',
						failed: false,
						extra: null,
						extra_indexed: null,
					}],
				},
			},
		} satisfies ThreeXplBlockResponse
		const transaction = {
			data: {
				transaction: {
					block: 3_734_570,
					transaction: 'tx-hash',
					time: '2026-08-07T00:53:54.000000Z',
					events: {
						'monero-main': 2,
					},
				},
				events: {
					'monero-main': [{
						sort_key: 0,
						address: 'the-void',
						currency: 'monero',
						effect: '-612586560000',
						failed: false,
						extra: null,
						extra_indexed: null,
					}],
				},
			},
		} satisfies ThreeXplTransactionResponse

		sourceFetch
			.mockResolvedValueOnce(jsonResponse(stats))
			.mockResolvedValueOnce(jsonResponse(blocks))
			.mockResolvedValueOnce(jsonResponse(block))
			.mockResolvedValueOnce(jsonResponse(transaction))

		await expect(fetchChainStats({
			from: 'monero',
		})).resolves.toMatchObject({
			data: {
				blockchains: {
					monero: {
						best_block: 3_734_577,
					},
				},
			},
		})
		await expect(fetchBlocks({
			blockchain: 'monero',
			limit: 10,
		})).resolves.toMatchObject({
			data: {
				blocks: {
					'3734577': {
						hash: 'tip-hash',
					},
				},
			},
		})
		await expect(fetchBlock({
			blockchain: 'monero',
			block: 3_734_570,
		})).resolves.toMatchObject({
			data: {
				block: {
					hash: 'block-hash',
					events: {
						'monero-main': 255,
					},
				},
			},
		})
		await expect(fetchTransaction({
			blockchain: 'monero',
			transaction: 'tx-hash',
		})).resolves.toMatchObject({
			data: {
				transaction: {
					block: 3_734_570,
				},
			},
		})

		expect(sourceFetch).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://sandbox-api.3xpl.com/?from=monero',
			undefined
		)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://sandbox-api.3xpl.com/monero/blocks?data=blocks&limit=10',
			undefined
		)
	})

	it('accepts live Solana-shaped null hash / null module event counts', async () => {
		sourceFetch.mockResolvedValueOnce(jsonResponse({
			data: {
				block: {
					block: 350_000_000,
					hash: null,
					time: null,
					events: {
						'solana-main': null,
					},
				},
			},
		}))

		await expect(fetchBlock({
			blockchain: 'solana',
			block: 350_000_000,
			data: 'block',
		})).resolves.toMatchObject({
			data: {
				block: {
					hash: null,
					events: {
						'solana-main': null,
					},
				},
			},
		})
	})

	it('fail-closes string error data and malformed block envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				data: 'NaN',
				context: {
					code: 400,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				data: {
					blocks: {
						'1': {
							hash: 12,
						},
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				data: {
					block: {
						block: 'not-a-height',
					},
				},
			}))

		await expect(fetchBlock({
			blockchain: 'monero',
			block: 'not-a-block',
		})).rejects.toThrow('ThreeXpl_Rest: invalid block response envelope')
		await expect(fetchBlocks({
			blockchain: 'monero',
			limit: 1,
		})).rejects.toThrow('ThreeXpl_Rest: invalid blocks response envelope')
		await expect(fetchBlock({
			blockchain: 'monero',
			block: 1,
		})).rejects.toThrow('ThreeXpl_Rest: invalid block response envelope')
	})
})
