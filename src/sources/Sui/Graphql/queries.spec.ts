import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Sui/bindings.ts'

const graphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql,
}))

const {
	getAddressBalances,
	getAddressTransactions,
} = await import('$/sources/Sui/Graphql/queries.ts')

const binding = bindings[Source.Sui_Graphql]

const address = `0x${'1'.repeat(64)}`
const pageInfo = {
	hasNextPage: true,
	endCursor: 'next-cursor',
}

describe('Sui GraphQL account portfolio queries', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('queries complete owned balances through the existing RemoteQuery binding', async () => {
		graphql.mockResolvedValueOnce({
			address: {
				address,
				balances: {
					pageInfo,
					nodes: [{
						coinType: {
							repr: '0x2::sui::SUI',
						},
						totalBalance: '123',
						coinBalance: '100',
						addressBalance: '23',
					}],
				},
			},
		})

		await expect(getAddressBalances({
			address,
			limit: 10,
			after: 'current-cursor',
		})).resolves.toEqual({
			balances: [{
				coinType: {
					repr: '0x2::sui::SUI',
				},
				totalBalance: '123',
				coinBalance: '100',
				addressBalance: '23',
			}],
			pagination: {
				limit: 10,
				after: 'current-cursor',
				nextAfter: 'next-cursor',
			},
		})
		expect(binding).toMatchObject({
			target: {
				kind: SourceTargetKind.NetworkSlug,
				key: 'sui',
			},
			delivery: SourceDelivery.RemoteQuery,
		})
		expect(graphql.mock.calls[0][0]).toMatchObject({
			binding,
			variables: {
				address,
				first: 10,
				after: 'current-cursor',
			},
		})
		expect(graphql.mock.calls[0][0].query).toContain('balances(first: $first, after: $after)')
	})

	it('queries affected-address activity with lossless digest and cursor identities', async () => {
		graphql.mockResolvedValueOnce({
			address: {
				address,
			},
			transactions: {
				pageInfo,
				nodes: [{
					digest: 'TransactionDigest',
					sender: {
						address,
					},
				}],
			},
		})

		await expect(getAddressTransactions({
			address,
			limit: 1,
		})).resolves.toEqual({
			transactions: [{
				digest: 'TransactionDigest',
				sender: {
					address,
				},
			}],
			pagination: {
				limit: 1,
				nextAfter: 'next-cursor',
			},
		})
		expect(graphql.mock.calls[0][0].variables).toEqual({
			address,
			first: 1,
		})
		expect(graphql.mock.calls[0][0].query).toContain('filter: { affectedAddress: $address }')
	})

	it('normalizes shorthand addresses to the canonical GraphQL identity', async () => {
		const canonicalAddress = `0x${'0'.repeat(63)}2`
		graphql.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
				balances: {
					pageInfo: {
						hasNextPage: false,
						endCursor: null,
					},
					nodes: [],
				},
			},
		})

		await expect(getAddressBalances({
			address: '0x2',
			limit: 1,
		})).resolves.toMatchObject({
			balances: [],
		})
		expect(graphql.mock.calls[0][0].variables).toEqual({
			address: canonicalAddress,
			first: 1,
		})
	})

	it('fails closed on mismatched subjects, malformed rows, and broken pagination', async () => {
		const balanceFailures = [
			{
				address: {
					address: `0x${'2'.repeat(64)}`,
					balances: {
						pageInfo,
						nodes: [],
					},
				},
			},
			{
				address: {
					address,
					balances: {
						pageInfo,
						nodes: [{
							coinType: {
								repr: '',
							},
							totalBalance: '1',
							coinBalance: '1',
							addressBalance: '0',
						}],
					},
				},
			},
			{
				address: {
					address,
					balances: {
						pageInfo,
						nodes: [{
							coinType: {
								repr: '0x2::sui::SUI',
							},
							totalBalance: 'not-an-integer',
							coinBalance: '1',
							addressBalance: '0',
						}],
					},
				},
			},
		]
		for (const payload of balanceFailures) {
			graphql.mockResolvedValueOnce(payload)
			await expect(getAddressBalances({
				address,
				limit: 2,
			})).rejects.toThrow()
		}

		for (const payload of [
			{
				address: {
					address,
				},
				transactions: {
					pageInfo,
					nodes: [
						{
							digest: 'duplicate',
							sender: null,
						},
						{
							digest: 'duplicate',
							sender: null,
						},
					],
				},
			},
			{
				address: {
					address,
				},
				transactions: {
					pageInfo: {
						hasNextPage: true,
						endCursor: null,
					},
					nodes: [],
				},
			},
		]) {
			graphql.mockResolvedValueOnce(payload)
			await expect(getAddressTransactions({
				address,
				limit: 2,
			})).rejects.toThrow()
		}

		graphql.mockResolvedValueOnce({
			address: {
				address,
			},
			transactions: {
				pageInfo: {
					hasNextPage: true,
					endCursor: 'current-cursor',
				},
				nodes: [],
			},
		})
		await expect(getAddressTransactions({
			address,
			limit: 2,
			after: 'current-cursor',
		})).rejects.toThrow('did not advance')
	})

	it('bounds requests and performs no transport for zero limits', async () => {
		for (const request of [
			{ address: '', limit: 1 },
			{ address: '0xz', limit: 1 },
			{ address: `0x${'1'.repeat(65)}`, limit: 1 },
			{ address, limit: -1 },
			{ address, limit: 51 },
			{ address, limit: 0.5 },
			{ address, limit: 1, after: '' },
		])
			await expect(getAddressBalances(request)).rejects.toThrow()

		await expect(getAddressTransactions({
			address,
			limit: 0,
			after: 'cursor',
		})).resolves.toEqual({
			transactions: [],
			pagination: {
				limit: 0,
				after: 'cursor',
			},
		})
		expect(graphql).not.toHaveBeenCalled()
	})
})
