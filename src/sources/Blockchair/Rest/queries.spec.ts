import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const getBlockchairJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Blockchair/Rest/client.ts', () => ({
	getBlockchairJson,
}))

const {
	getBitcoinLikeAddressDashboard,
	getBitcoinLikeBlockDashboard,
	getBitcoinLikeStats,
	getBlocks,
	getEthereumLikeStats,
	getTransactions,
} = await import('$/sources/Blockchair/Rest/queries.ts')

const context = {
	code: 200,
}

const publicEnv = {
	PUBLIC_BLOCKCHAIR_API_KEY: 'test-key',
}

beforeEach(() => {
	getBlockchairJson.mockReset()
})

describe('Blockchair Rest arktype envelopes', () => {
	it('accepts bitcoin-like stats / dashboards / infinitables', async () => {
		getBlockchairJson
			.mockResolvedValueOnce({
				data: {
					best_block_height: 900_000,
					best_block_hash: 'a'.repeat(64),
					best_block_time: '2026-01-15 00:00:00',
					blocks: 900_001,
					transactions: 1_000,
					mempool_transactions: 12,
					suggested_transaction_fee_per_byte_sat: 2,
				},
				context,
			})
			.mockResolvedValueOnce({
				data: {
					['b'.repeat(64)]: {
						block: {
							id: 900_000,
							hash: 'b'.repeat(64),
							time: '2026-01-15 00:00:00',
							transaction_count: 1,
						},
						transactions: [{
							hash: 'c'.repeat(64),
						}],
					},
				},
				context,
			})
			.mockResolvedValueOnce({
				data: {
					bc1qaddress: {
						address: {
							balance: 10,
							output_count: 4,
							unspent_output_count: 1,
							received: 20,
							spent: 10,
							transaction_count: 2,
						},
						transactions: ['c'.repeat(64)],
						utxo: [{
							transaction_hash: 'c'.repeat(64),
							index: 0,
							value: 10,
						}],
					},
				},
				context,
			})
			.mockResolvedValueOnce({
				data: [{
					id: 900_000,
					hash: 'b'.repeat(64),
				}],
				context,
			})
			.mockResolvedValueOnce({
				data: [{
					hash: 'c'.repeat(64),
					block_id: 900_000,
				}],
				context,
			})

		await expect(getBitcoinLikeStats({
			chain: 'bitcoin',
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: {
				best_block_height: 900_000,
			},
		})
		await expect(getBitcoinLikeBlockDashboard({
			chain: 'bitcoin',
			block: 900_000n,
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: {
				['b'.repeat(64)]: {
					block: {
						id: 900_000,
					},
				},
			},
		})
		await expect(getBitcoinLikeAddressDashboard({
			chain: 'bitcoin',
			address: 'bc1qaddress',
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: {
				bc1qaddress: {
					address: {
						output_count: 4,
					},
				},
			},
		})
		await expect(getBlocks({
			chain: 'bitcoin',
			params: { limit: 1 },
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: [{
				id: 900_000,
			}],
		})
		await expect(getTransactions({
			chain: 'litecoin',
			params: { limit: 1 },
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: [{
				hash: 'c'.repeat(64),
			}],
		})
	})

	it('accepts ethereum-like tip stats leftovers', async () => {
		getBlockchairJson.mockResolvedValueOnce({
			data: {
				blocks: 25_000_000,
				best_block_height: 24_999_999,
				best_block_hash: 'd'.repeat(64),
				best_block_time: '2026-01-15 00:00:00',
				mempool_transactions: 0,
				suggested_transaction_fee_gwei_options: {
					fast: 2,
				},
				circulation_approximate: '120000000000000000000000000',
			},
			context,
		})

		await expect(getEthereumLikeStats({
			chain: 'ethereum',
			options: { publicEnv },
		})).resolves.toMatchObject({
			data: {
				best_block_height: 24_999_999,
				blocks: 25_000_000,
			},
		})
	})

	it('fail-closes null data and malformed tip fields', async () => {
		getBlockchairJson
			.mockResolvedValueOnce({
				data: null,
				context: {
					code: 430,
					error: 'rate limited',
				},
			})
			.mockResolvedValueOnce({
				data: {
					best_block_height: -1,
				},
				context,
			})
			.mockResolvedValueOnce({
				data: {
					best_block_height: 1,
					best_block_hash: '',
				},
				context,
			})

		await expect(getBitcoinLikeStats({
			chain: 'bitcoin',
			options: { publicEnv },
		})).rejects.toThrow('invalid bitcoin stats envelope')
		await expect(getEthereumLikeStats({
			chain: 'ethereum',
			options: { publicEnv },
		})).rejects.toThrow('invalid ethereum stats envelope')
		await expect(getBitcoinLikeStats({
			chain: 'bitcoin',
			options: { publicEnv },
		})).rejects.toThrow('invalid bitcoin stats envelope')
	})
})
