import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
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
} = await import('$/sources/InternetComputer/RosettaApi/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.InternetComputer_RosettaApi)

if (binding == null)
	throw new Error('InternetComputer_RosettaApi spec missing source binding')

const accountIdentifier = 'a'.repeat(64)
const otherAccountIdentifier = 'b'.repeat(64)

const response = (body: unknown) => ({
	ok: true,
	json: () => Promise.resolve(body),
})

describe('Internet Computer Rosetta account transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a lossless ICP account balance at an exact block', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			block_identifier: {
				index: 9_890_652,
				hash: 'c'.repeat(64),
			},
			balances: [{
				value: '18446744073709551615',
				currency: {
					symbol: 'ICP',
					decimals: 8,
				},
			}],
		}))

		await expect(getAccountBalance(binding, accountIdentifier, {
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
	})

	it('loads a bounded account-owned transaction page with lossless amounts', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			transactions: [{
				block_identifier: {
					index: 100,
					hash: 'd'.repeat(64),
				},
				transaction: {
					transaction_identifier: {
						hash: 'e'.repeat(64),
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
							amount: {
								value: '-18446744073709551615',
								currency: {
									symbol: 'ICP',
									decimals: 8,
								},
							},
						},
						{
							operation_identifier: {
								index: 1,
							},
							type: 'TRANSACTION',
							account: {
								address: accountIdentifier,
							},
							amount: {
								value: '18446744073709551615',
								currency: {
									symbol: 'ICP',
									decimals: 8,
								},
							},
						},
					],
				},
			}],
			total_count: 2,
			next_offset: 2,
		}))

		await expect(getAccountTransactions(binding, {
			accountIdentifier,
			limit: 1,
			offset: 1,
		})).resolves.toMatchObject({
			next_offset: 2,
		})
	})

	it('rejects foreign, duplicate, malformed, stalled, and oversized pages', async () => {
		sourceFetch.mockResolvedValueOnce(response({
			transactions: [{
				block_identifier: {
					index: 100,
					hash: 'd'.repeat(64),
				},
				transaction: {
					transaction_identifier: {
						hash: 'e'.repeat(64),
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
		await expect(getAccountTransactions(binding, {
			accountIdentifier,
			limit: 1,
		})).rejects.toThrow('foreign account row')

		sourceFetch.mockResolvedValueOnce(response({
			transactions: [],
			total_count: 1,
			next_offset: 1,
		}))
		await expect(getAccountTransactions(binding, {
			accountIdentifier,
			limit: 1,
			offset: 1,
		})).rejects.toThrow('did not advance')

		await expect(getAccountTransactions(binding, {
			accountIdentifier,
			limit: 1_001,
		})).rejects.toThrow('0 through 1000')
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('does not transport zero-cardinality transaction pages', async () => {
		await expect(getAccountTransactions(binding, {
			accountIdentifier,
			limit: 0,
		})).resolves.toEqual({
			transactions: [],
			total_count: 0,
		})
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
