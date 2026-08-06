import {
	ArweaveGraphqlTransactionFragment,
	type ArweaveGraphqlTransaction,
} from '$/sources/Arweave/Graphql/types.ts'
import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'

import {
	graphql,
	queryArweave,
} from './client.ts'

const binding = bindings[Source.Arweave_Graphql][0]

const ArweaveTransaction = graphql(`
	query ArweaveTransaction($id: ID!) {
		transaction(id: $id) {
			...ArweaveGraphqlTransaction
		}
	}
`, [
	ArweaveGraphqlTransactionFragment,
])

const ArweaveTransactions = graphql(`
	query ArweaveTransactions(
		$first: Int!
		$after: String
		$ids: [ID!]
		$owners: [String!]
		$recipients: [String!]
	) {
		transactions(
			first: $first
			after: $after
			ids: $ids
			owners: $owners
			recipients: $recipients
			sort: HEIGHT_DESC
		) {
			pageInfo {
				hasNextPage
			}
			edges {
				cursor
				node {
					...ArweaveGraphqlTransaction
				}
			}
		}
	}
`, [
	ArweaveGraphqlTransactionFragment,
])

const assertAddress = (
	value: string,
	label: string
) => {
	if (!/^[A-Za-z0-9_-]{43}$/.test(value))
		throw new Error(`Arweave_Graphql: invalid ${label}`)
}

const assertBlockHash = (
	value: string,
	label: string
) => {
	if (!/^[A-Za-z0-9_-]{64}$/.test(value))
		throw new Error(`Arweave_Graphql: invalid ${label}`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`Arweave_Graphql: invalid ${label}`)
}

const assertTransaction = (
	transaction: ArweaveGraphqlTransaction
) => {
	assertAddress(transaction.id, 'transaction ID')
	assertAddress(transaction.owner.address, 'owner address')
	if (transaction.recipient !== '')
		assertAddress(transaction.recipient, 'recipient address')
	assertUnsignedDecimal(transaction.fee.winston, 'fee winston')
	assertUnsignedDecimal(transaction.quantity.winston, 'quantity winston')
	assertUnsignedDecimal(transaction.data.size, 'data size')
	if (transaction.block != null) {
		if (
			transaction.block.id == null
			|| transaction.block.timestamp == null
			|| transaction.block.previous == null
		)
			throw new Error('Arweave_Graphql: incomplete confirmed block coordinates')

		assertBlockHash(transaction.block.id, 'block ID')
		if (transaction.block.previous !== '')
			assertBlockHash(transaction.block.previous, 'previous block ID')
		if (
			!Number.isSafeInteger(transaction.block.height)
			|| transaction.block.height < 0
			|| !Number.isSafeInteger(transaction.block.timestamp)
			|| transaction.block.timestamp < 0
		)
			throw new Error('Arweave_Graphql: invalid confirmed block coordinates')
	}
}

const getTransactionPage = async ({
	first,
	after,
	ids,
	owners,
	recipients,
}: {
	first: number
	after?: string
	ids?: string[]
	owners?: string[]
	recipients?: string[]
}) => {
	if (!Number.isSafeInteger(first) || first < 1 || first > 100)
		throw new Error('Arweave_Graphql: page size must be an integer from 1 through 100')
	if (after === '')
		throw new Error('Arweave_Graphql: cursor must not be empty')
	for (const transactionId of ids ?? [])
		assertAddress(transactionId, 'transaction ID')
	for (const owner of owners ?? [])
		assertAddress(owner, 'owner address')
	for (const recipient of recipients ?? [])
		assertAddress(recipient, 'recipient address')
	const { transactions } = await queryArweave(binding, ArweaveTransactions, {
		first,
		after,
		ids,
		owners,
		recipients,
	})
	const { edges, pageInfo } = transactions
	if (edges.length > first)
		throw new Error('Arweave_Graphql: transaction page exceeds requested size')
	const transactionIds = new Set<string>()
	const cursors = new Set<string>()
	for (const { cursor, node } of edges) {
		if (cursor === '' || cursors.has(cursor))
			throw new Error('Arweave_Graphql: invalid or duplicate transaction cursor')
		cursors.add(cursor)
		assertTransaction(node)
		if (transactionIds.has(node.id))
			throw new Error('Arweave_Graphql: duplicate transaction in page')
		transactionIds.add(node.id)
		if (ids != null && !ids.includes(node.id))
			throw new Error('Arweave_Graphql: transaction ID filter was violated')
		if (owners != null && !owners.includes(node.owner.address))
			throw new Error('Arweave_Graphql: owner filter was violated')
		if (recipients != null && !recipients.includes(node.recipient))
			throw new Error('Arweave_Graphql: recipient filter was violated')
	}
	const nextCursor = pageInfo.hasNextPage ? edges.at(-1)?.cursor : undefined
	if (pageInfo.hasNextPage && nextCursor == null)
		throw new Error('Arweave_Graphql: next page has no cursor')
	if (pageInfo.hasNextPage && nextCursor === after)
		throw new Error('Arweave_Graphql: cursor did not advance')
	return transactions
}

export const getTransactionById = async (
	transactionId: string
) => {
	assertAddress(transactionId, 'transaction ID')
	const { transaction } = await queryArweave(binding, ArweaveTransaction, {
		id: transactionId,
	})
	if (transaction == null)
		throw new Error('Arweave_Graphql: transaction was not found')

	assertTransaction(transaction)
	if (transaction.id !== transactionId)
		throw new Error('Arweave_Graphql: returned a foreign transaction')

	return transaction
}

export const getTransactionsPage = (
	{
		first,
		after,
	}: {
		first: number
		after?: string
	}
) => (
	getTransactionPage({
		first,
		after,
	})
)

export const getAccountTransactionsPage = (
	{
		address,
		role,
		first,
		after,
	}: {
		address: string
		role: 'owner' | 'recipient'
		first: number
		after?: string
	}
) => (
	getTransactionPage({
		first,
		after,
		...(role === 'owner' ?
			{
				owners: [
					address,
				],
			}
		:
			{
				recipients: [
					address,
				],
			}),
	})
)
