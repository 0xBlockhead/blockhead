import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { postJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	ArweaveGraphqlTransaction,
	ArweaveGraphqlTransactionPage,
	ArweaveGraphqlTransactionsResponse,
} from '$/sources/Arweave/Graphql/types.ts'

const transactionsQuery = `
	query Transactions(
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
					id
					anchor
					signature
					recipient
					owner {
						address
						key
					}
					fee {
						winston
					}
					quantity {
						winston
					}
					data {
						size
						type
					}
					tags {
						name
						value
					}
					block {
						id
						timestamp
						height
						previous
					}
				}
			}
		}
	}
`

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Arweave_Graphql
		|| binding.target.kind !== SourceTargetKind.ContentAddressScheme
		|| binding.target.key !== 'arweave'
	)
		throw new Error('Arweave_Graphql: expected canonical Arweave GraphQL binding')
}

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
	binding,
	first,
	after,
	ids,
	owners,
	recipients,
}: {
	binding: SourceBinding
	first: number
	after?: string
	ids?: string[]
	owners?: string[]
	recipients?: string[]
}): Promise<ArweaveGraphqlTransactionPage> => {
	assertBinding(binding)
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
	const response = await postJson<ArweaveGraphqlTransactionsResponse>({
		binding,
		body: {
			query: transactionsQuery,
			variables: {
				first,
				after,
				ids,
				owners,
				recipients,
			},
		},
	})
	if (response.errors?.[0] != null)
		throw new Error(`Arweave_Graphql: ${response.errors[0].message}`)
	if (response.data == null)
		throw new Error('Arweave_Graphql: response is missing transaction data')
	const { edges, pageInfo } = response.data.transactions
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
	return {
		edges,
		nextCursor,
	}
}

export const getTransactionById = async (
	binding: SourceBinding,
	transactionId: string
) => {
	const page = await getTransactionPage({
		binding,
		first: 1,
		ids: [
			transactionId,
		],
	})
	if (page.edges.length !== 1)
		throw new Error('Arweave_Graphql: transaction was not found')
	return page.edges[0].node
}

export const getAccountTransactionsPage = (
	binding: SourceBinding,
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
		binding,
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
