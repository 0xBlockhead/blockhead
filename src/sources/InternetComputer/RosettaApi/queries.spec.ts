import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/InternetComputer/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { sourceFetch } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://rosetta.example/',
	sourceFetch,
}))

const {
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getNetworkOptions,
	getNetworkStatus,
	searchTransactions,
} = await import('$/sources/InternetComputer/RosettaApi/queries.ts')

const binding = bindings[Source.InternetComputer_RosettaApi][0]

const accountIdentifier = 'a'.repeat(64)
const otherAccountIdentifier = 'b'.repeat(64)
const blockHash = 'c'.repeat(64)
const parentHash = 'd'.repeat(64)
const transactionHash = 'e'.repeat(64)

const response = (body: unknown) => ({
	ok: true,
	json: () => Promise.resolve(body),
})

const icpAmount = (
	value: string
) => ({
	value,
	currency: {
		symbol: 'ICP',
		decimals: 8,
	},
})

describe('Internet Computer Rosetta ledger transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads network status and options with arktype fail-closed envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			current_block_identifier: {
				index: 9_890_652,
				hash: blockHash,
			},
			current_block_timestamp: 1_720_000_000_000,
			genesis_block_identifier: {
				index: 0,
				hash: parentHash,
			},
		}))
		await expect(getNetworkStatus(binding)).resolves.toMatchObject({
			current_block_identifier: {
				index: 9_890_652,
			},
		})

		sourceFetch.mockResolvedValueOnce(response({
			allow: {
				operation_statuses: [{
					status: 'COMPLETED',
					successful: true,
				}],
				operation_types: ['TRANSACTION', 'FEE', 'APPROVE'],
			},
		}))
		await expect(getNetworkOptions(binding)).resolves.toMatchObject({
			allow: {
				operation_types: expect.arrayContaining(['APPROVE']),
			},
		})

		sourceFetch.mockResolvedValueOnce(response({
			current_block_identifier: {
				index: -1,
				hash: blockHash,
			},
			current_block_timestamp: 1,
			genesis_block_identifier: {
				index: 0,
				hash: parentHash,
			},
		}))
		await expect(getNetworkStatus(binding)).rejects.toThrow()
	})

	it('loads a single-transaction ICP ledger block', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			block: {
				block_identifier: {
					index: 100,
					hash: blockHash,
				},
				parent_block_identifier: {
					index: 99,
					hash: parentHash,
				},
				timestamp: 1_720_000_000_000,
				transactions: [{
					transaction_identifier: {
						hash: transactionHash,
					},
					operations: [{
						operation_identifier: {
							index: 0,
						},
						type: 'TRANSACTION',
						account: {
							address: accountIdentifier,
						},
						amount: icpAmount('100'),
					}],
					metadata: {
						memo: 7,
						created_at_time: 1_720_000_000_000_000_000,
					},
				}],
			},
		}))

		await expect(getBlock({
			index: 100,
		})).resolves.toMatchObject({
			block: {
				block_identifier: {
					index: 100,
				},
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://rosetta.example/block',
			expect.objectContaining({
				method: 'POST',
			})
		)

		sourceFetch.mockResolvedValueOnce(response({
			block: {
				block_identifier: {
					index: 100,
					hash: blockHash,
				},
				parent_block_identifier: {
					index: 99,
					hash: parentHash,
				},
				timestamp: 1_720_000_000_000,
				transactions: [],
			},
		}))
		await expect(getBlock({
			index: 100,
		})).rejects.toThrow('exactly one transaction')
	})

	it('loads a lossless ICP account balance at an exact block', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			block_identifier: {
				index: 9_890_652,
				hash: blockHash,
			},
			balances: [icpAmount('18446744073709551615')],
		}))

		await expect(getAccountBalance(accountIdentifier, {
			index: 9_890_652,
		})).resolves.toMatchObject({
			balances: [{
				value: '18446744073709551615',
			}],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://rosetta.example/account/balance',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({
					network_identifier: {
						blockchain: 'Internet Computer',
						network: '00000000000000020101',
					},
					account_identifier: {
						address: accountIdentifier,
					},
					block_identifier: {
						index: 9_890_652,
					},
				}),
			})
		)

		sourceFetch.mockResolvedValueOnce(response({
			block_identifier: {
				index: 1,
				hash: blockHash,
			},
			balances: [],
		}))
		await expect(getAccountBalance(accountIdentifier)).rejects.toThrow('exactly ICP')
	})

	it('loads a bounded account-owned transaction page with lossless amounts', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			transactions: [{
				block_identifier: {
					index: 100,
					hash: blockHash,
				},
				transaction: {
					transaction_identifier: {
						hash: transactionHash,
					},
					operations: [
						{
							operation_identifier: {
								index: 0,
							},
							type: 'TRANSACTION',
							account: {
								address: otherAccountIdentifier,
							},
							amount: icpAmount('-18446744073709551615'),
						},
						{
							operation_identifier: {
								index: 1,
							},
							type: 'TRANSACTION',
							account: {
								address: accountIdentifier,
							},
							amount: icpAmount('18446744073709551615'),
						},
					],
				},
			}],
			total_count: 2,
			next_offset: 2,
		}))

		await expect(getAccountTransactions({
			accountIdentifier,
			limit: 1,
			offset: 1,
		})).resolves.toMatchObject({
			next_offset: 2,
		})
	})

	it('searches network-wide transactions without an account filter', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			transactions: [{
				block_identifier: {
					index: 100,
					hash: blockHash,
				},
				transaction: {
					transaction_identifier: {
						hash: transactionHash,
					},
					operations: [{
						operation_identifier: {
							index: 0,
						},
						type: 'MINT',
						account: {
							address: accountIdentifier,
						},
						amount: icpAmount('1'),
					}],
				},
			}],
			total_count: 1,
		}))

		await expect(searchTransactions({
			limit: 1,
		})).resolves.toMatchObject({
			total_count: 1,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://rosetta.example/search/transactions',
			expect.objectContaining({
				body: JSON.stringify({
					network_identifier: {
						blockchain: 'Internet Computer',
						network: '00000000000000020101',
					},
					limit: 1,
				}),
			})
		)
	})

	it('rejects foreign, duplicate, malformed, stalled, and oversized pages', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			transactions: [{
				block_identifier: {
					index: 100,
					hash: blockHash,
				},
				transaction: {
					transaction_identifier: {
						hash: transactionHash,
					},
					operations: [{
						operation_identifier: {
							index: 0,
						},
						type: 'FEE',
						account: {
							address: otherAccountIdentifier,
						},
					}],
				},
			}],
			total_count: 1,
		}))
		await expect(getAccountTransactions({
			accountIdentifier,
			limit: 1,
		})).rejects.toThrow('foreign account row')

		sourceFetch.mockResolvedValueOnce(response({
			transactions: [],
			total_count: 1,
			next_offset: 1,
		}))
		await expect(getAccountTransactions({
			accountIdentifier,
			limit: 1,
			offset: 1,
		})).rejects.toThrow('did not advance')

		await expect(getAccountTransactions({
			accountIdentifier,
			limit: 1_001,
		})).rejects.toThrow('0 through 1000')
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('does not transport zero-cardinality transaction pages', async () => {
		await expect(getAccountTransactions({
			accountIdentifier,
			limit: 0,
		})).resolves.toEqual({
			transactions: [],
			total_count: 0,
		})
		await expect(searchTransactions({
			limit: 0,
		})).resolves.toEqual({
			transactions: [],
			total_count: 0,
		})
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
