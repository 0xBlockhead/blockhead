import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getAccountTransactionsPage,
	getTransactionById,
} from '$/sources/Arweave/Graphql/queries.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql: vi.fn(),
}))

const binding = bindings[Source.Arweave_Graphql][0]

const transactionId = 'A'.repeat(43)
const ownerAddress = 'B'.repeat(43)
const recipientAddress = 'C'.repeat(43)
const blockId = 'D'.repeat(64)
const cursor = 'cursor-1'
const transaction = {
	id: transactionId,
	anchor: 'E'.repeat(43),
	signature: 'signature',
	recipient: recipientAddress,
	owner: {
		address: ownerAddress,
		key: 'owner-key',
	},
	fee: {
		winston: '9007199254740993',
	},
	quantity: {
		winston: '1000000000000',
	},
	data: {
		size: '12345678901234567',
		type: 'text/plain',
	},
	tags: [
		{
			name: 'Content-Type',
			value: 'text/plain',
		},
	],
	block: {
		id: blockId,
		timestamp: 1_720_000_000,
		height: 1_500_000,
		previous: 'F'.repeat(64),
	},
}

describe('Arweave GraphQL public transaction discovery', () => {
	it('preserves exact IDs, winston units, tags, and confirmed block identity', async () => {
		vi.mocked(graphql).mockResolvedValue({
			transaction,
		})

		await expect(getTransactionById(
			binding,
			transactionId
		)).resolves.toMatchObject({
			id: transactionId,
			fee: {
				winston: '9007199254740993',
			},
			block: {
				id: blockId,
			},
		})
	})

	it('keeps pending transactions blockless and advances opaque cursors', async () => {
		vi.mocked(graphql).mockResolvedValue({
			transactions: {
				pageInfo: {
					hasNextPage: true,
				},
				edges: [
					{
						cursor: 'cursor-2',
						node: {
							...transaction,
							block: null,
						},
					},
				],
			},
		})

		await expect(getAccountTransactionsPage(binding, {
			address: ownerAddress,
			role: 'owner',
			first: 10,
			after: cursor,
		})).resolves.toMatchObject({
			pageInfo: {
				hasNextPage: true,
			},
			edges: [
				{
					cursor: 'cursor-2',
					node: {
						block: null,
					},
				},
			],
		})
	})

	it('rejects incomplete coordinates on confirmed blocks', async () => {
		vi.mocked(graphql).mockResolvedValue({
			transaction: {
				...transaction,
				block: {
					...transaction.block,
					id: null,
				},
			},
		})

		await expect(getTransactionById(
			binding,
			transactionId
		)).rejects.toThrow('incomplete confirmed block coordinates')
	})

	it('rejects foreign owner rows, duplicate cursors, and stalled pagination', async () => {
		vi.mocked(graphql).mockResolvedValueOnce({
			transactions: {
				pageInfo: {
					hasNextPage: false,
				},
				edges: [
					{
						cursor,
						node: transaction,
					},
				],
			},
		})
		await expect(getAccountTransactionsPage(binding, {
			address: recipientAddress,
			role: 'owner',
			first: 10,
		})).rejects.toThrow('owner filter was violated')

		vi.mocked(graphql).mockResolvedValueOnce({
			transactions: {
				pageInfo: {
					hasNextPage: true,
				},
				edges: [
					{
						cursor,
						node: transaction,
					},
				],
			},
		})
		await expect(getAccountTransactionsPage(binding, {
			address: ownerAddress,
			role: 'owner',
			first: 10,
			after: cursor,
		})).rejects.toThrow('cursor did not advance')
	})
})
