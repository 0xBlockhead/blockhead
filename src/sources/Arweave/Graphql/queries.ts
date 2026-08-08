/**
 * Arweave GraphQL named operations against arweave.net/graphql.
 * @see https://arweave.net/graphql
 * @see schema.graphql `block` / `blocks` / `transactions`
 */
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	ArweaveGraphqlBlockFragment,
	ArweaveGraphqlTransactionFragment,
	type ArweaveGraphqlBlock,
	type ArweaveGraphqlTransaction,
} from '$/sources/Arweave/Graphql/types.ts'

import {
	graphql,
	queryArweave,
} from './client.ts'


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
		$tags: [TagFilter!]
		$block: RangeFilter
	) {
		transactions(
			first: $first
			after: $after
			ids: $ids
			owners: $owners
			recipients: $recipients
			tags: $tags
			block: $block
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

const ArweaveBlock = graphql(`
	query ArweaveBlock($id: String) {
		block(id: $id) {
			...ArweaveGraphqlBlock
		}
	}
`, [
	ArweaveGraphqlBlockFragment,
])

const ArweaveBlocks = graphql(`
	query ArweaveBlocks(
		$first: Int!
		$after: String
		$ids: [ID!]
		$height: RangeFilter
	) {
		blocks(
			first: $first
			after: $after
			ids: $ids
			height: $height
			sort: HEIGHT_DESC
		) {
			pageInfo {
				hasNextPage
			}
			edges {
				cursor
				node {
					...ArweaveGraphqlBlock
				}
			}
		}
	}
`, [
	ArweaveGraphqlBlockFragment,
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

const assertConfirmedBlock = (
	block: ArweaveGraphqlBlock
) => {
	if (
		block.id == null
		|| block.timestamp == null
		|| block.previous == null
	)
		throw new Error('Arweave_Graphql: incomplete confirmed block coordinates')

	assertBlockHash(block.id, 'block ID')
	if (block.previous !== '')
		assertBlockHash(block.previous, 'previous block ID')
	if (
		!Number.isSafeInteger(block.height)
		|| block.height < 0
		|| !Number.isSafeInteger(block.timestamp)
		|| block.timestamp < 0
	)
		throw new Error('Arweave_Graphql: invalid confirmed block coordinates')

	return {
		id: block.id,
		timestamp: block.timestamp,
		height: block.height,
		previous: block.previous,
	}
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
	if (transaction.block != null)
		assertConfirmedBlock(transaction.block)
}

const getTransactionPage = async (binding: SourceBinding, {
	first,
	after,
	ids,
	owners,
	recipients,
	tags,
	blockHeight,
}: {
	first: number
	after?: string
	ids?: string[]
	owners?: string[]
	recipients?: string[]
	tags?: {
		name: string
		values: string[]
	}[]
	blockHeight?: number
}) => {
	if (!Number.isSafeInteger(first) || first < 1 || first > 100)
		throw new Error('Arweave_Graphql: page size must be an integer from 1 through 100')
	if (after === '')
		throw new Error('Arweave_Graphql: cursor must not be empty')
	if (
		blockHeight != null
		&& (
			!Number.isSafeInteger(blockHeight)
			|| blockHeight < 0
		)
	)
		throw new Error('Arweave_Graphql: invalid block height filter')
	for (const transactionId of ids ?? [])
		assertAddress(transactionId, 'transaction ID')
	for (const owner of owners ?? [])
		assertAddress(owner, 'owner address')
	for (const recipient of recipients ?? [])
		assertAddress(recipient, 'recipient address')
	for (const tag of tags ?? []) {
		if (tag.name === '' || tag.values.length === 0 || tag.values.some((value) => value === ''))
			throw new Error('Arweave_Graphql: invalid tag filter')
	}
	const { transactions } = await queryArweave(binding, ArweaveTransactions, {
		first,
		after,
		ids,
		owners,
		recipients,
		tags,
		...(blockHeight != null && {
			block: {
				min: blockHeight,
				max: blockHeight,
			},
		}),
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
		if (
			blockHeight != null
			&& (
				node.block == null
				|| node.block.height !== blockHeight
			)
		)
			throw new Error('Arweave_Graphql: block height filter was violated')
		for (const tag of tags ?? []) {
			const matches = node.tags.some((nodeTag) => (
				nodeTag.name === tag.name
				&& tag.values.includes(nodeTag.value)
			))
			if (!matches)
				throw new Error('Arweave_Graphql: tag filter was violated')
		}
	}
	const nextCursor = pageInfo.hasNextPage ? edges.at(-1)?.cursor : undefined
	if (pageInfo.hasNextPage && nextCursor == null)
		throw new Error('Arweave_Graphql: next page has no cursor')
	if (pageInfo.hasNextPage && nextCursor === after)
		throw new Error('Arweave_Graphql: cursor did not advance')
	return transactions
}

const getBlockPage = async (binding: SourceBinding, {
	first,
	after,
	ids,
	height,
}: {
	first: number
	after?: string
	ids?: string[]
	height?: {
		min?: number
		max?: number
	}
}) => {
	if (!Number.isSafeInteger(first) || first < 1 || first > 100)
		throw new Error('Arweave_Graphql: page size must be an integer from 1 through 100')
	if (after === '')
		throw new Error('Arweave_Graphql: cursor must not be empty')
	if (height != null) {
		for (const bound of [height.min, height.max]) {
			if (
				bound != null
				&& (
					!Number.isSafeInteger(bound)
					|| bound < 0
				)
			)
				throw new Error('Arweave_Graphql: invalid block height filter')
		}
		if (
			height.min != null
			&& height.max != null
			&& height.min > height.max
		)
			throw new Error('Arweave_Graphql: invalid block height range')
	}
	for (const blockId of ids ?? [])
		assertBlockHash(blockId, 'block ID')
	const { blocks } = await queryArweave(binding, ArweaveBlocks, {
		first,
		after,
		ids,
		height,
	})
	const { edges, pageInfo } = blocks
	if (edges.length > first)
		throw new Error('Arweave_Graphql: block page exceeds requested size')
	const blockIds = new Set<string>()
	const cursors = new Set<string>()
	const confirmedEdges = [] as {
		cursor: string
		node: ReturnType<typeof assertConfirmedBlock>
	}[]
	for (const { cursor, node } of edges) {
		if (cursor === '' || cursors.has(cursor))
			throw new Error('Arweave_Graphql: invalid or duplicate block cursor')
		cursors.add(cursor)
		const confirmed = assertConfirmedBlock(node)
		if (blockIds.has(confirmed.id))
			throw new Error('Arweave_Graphql: duplicate block in page')
		blockIds.add(confirmed.id)
		if (ids != null && !ids.includes(confirmed.id))
			throw new Error('Arweave_Graphql: block ID filter was violated')
		if (
			height?.min != null
			&& confirmed.height < height.min
		)
			throw new Error('Arweave_Graphql: block height filter was violated')
		if (
			height?.max != null
			&& confirmed.height > height.max
		)
			throw new Error('Arweave_Graphql: block height filter was violated')
		confirmedEdges.push({
			cursor,
			node: confirmed,
		})
	}
	const nextCursor = pageInfo.hasNextPage ? edges.at(-1)?.cursor : undefined
	if (pageInfo.hasNextPage && nextCursor == null)
		throw new Error('Arweave_Graphql: next page has no cursor')
	if (pageInfo.hasNextPage && nextCursor === after)
		throw new Error('Arweave_Graphql: cursor did not advance')
	return {
		pageInfo,
		edges: confirmedEdges,
	}
}

export const getTransactionById = async (
	binding: SourceBinding,
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
	binding: SourceBinding,
	{
		first,
		after,
	}: {
		first: number
		after?: string
	}
) => (
	getTransactionPage(binding, {
		first,
		after,
	})
)

export const getBlockTransactionsPage = (
	binding: SourceBinding,
	{
		height,
		first,
		after,
	}: {
		height: number
		first: number
		after?: string
	}
) => (
	getTransactionPage(binding, {
		first,
		after,
		blockHeight: height,
	})
)

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
	getTransactionPage(binding, {
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

/** Tag-filtered transaction discovery (`TagFilter` leftovers on GraphQL `transactions`). */
export const getTaggedTransactionsPage = (
	binding: SourceBinding,
	{
		tags,
		first,
		after,
	}: {
		tags: {
			name: string
			values: string[]
		}[]
		first: number
		after?: string
	}
) => {
	if (tags.length === 0)
		throw new Error('Arweave_Graphql: tag filter required')

	return getTransactionPage(binding, {
		first,
		after,
		tags,
	})
}

export const getBlockById = async (
	binding: SourceBinding,
	blockId: string
) => {
	assertBlockHash(blockId, 'block ID')
	const { block } = await queryArweave(binding, ArweaveBlock, {
		id: blockId,
	})
	if (block == null)
		throw new Error('Arweave_Graphql: block was not found')

	const confirmed = assertConfirmedBlock(block)
	if (confirmed.id !== blockId)
		throw new Error('Arweave_Graphql: returned a foreign block')

	return confirmed
}

export const getBlockByHeight = async (
	binding: SourceBinding,
	height: number
) => {
	if (!Number.isSafeInteger(height) || height < 0)
		throw new Error('Arweave_Graphql: invalid block height')

	const blocks = await getBlockPage(binding, {
		first: 1,
		height: {
			min: height,
			max: height,
		},
	})
	if (blocks.edges.length === 0)
		throw new Error('Arweave_Graphql: block was not found')

	const confirmed = assertConfirmedBlock(blocks.edges[0].node)
	if (confirmed.height !== height)
		throw new Error('Arweave_Graphql: returned a foreign block height')

	return confirmed
}

export const getBlocksPage = (
	binding: SourceBinding,
	{
		first,
		after,
	}: {
		first: number
		after?: string
	}
) => (
	getBlockPage(binding, {
		first,
		after,
	})
)
