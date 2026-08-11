/**
 * Arweave GraphQL resolvers: network hub lists + thin block/tx/resource identity.
 * Rich block body and resource gateway observations live on `Arweave_Rest`.
 * @see https://arweave.net/graphql
 */
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	ArweaveGraphqlBlock,
	ArweaveGraphqlTransaction,
} from '$/sources/Arweave/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'

type ArweaveGraphqlTransactionPage = {
	edges: {
		cursor: string
		node: ArweaveGraphqlTransaction
	}[]
	pageInfo: {
		hasNextPage: boolean
	}
}

type ArweaveGraphqlBlockPage = {
	edges: {
		cursor: string
		node: ArweaveGraphqlBlock & {
			id: string
			timestamp: number
			previous: string
		}
	}[]
	pageInfo: {
		hasNextPage: boolean
	}
}

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type ArweaveNetworkId = EntitySelector<typeof schema, EntityType.ArweaveNetwork>
type ResolverContext = Parameters<typeof resolverContextRowLimit>[0]

const arweaveSlugNetwork = {
	slug: 'arweave' as const,
}

const assertArweaveNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'arweave')
		throw new Error('Arweave_Graphql: unsupported network')
}

const assertArweaveNetworkHub = (network: ArweaveNetworkId) => {
	assertArweaveNetwork(network.$network)
}

const arweaveCanonicalUri = (
	transactionId: string,
	contentPath: string
) => (
	contentPath === '' ?
		`ar://${transactionId}`
	:
		`ar://${transactionId}/${contentPath.replace(/^\/+/, '')}`
)

const safeHeightNumber = (
	height: bigint
) => {
	if (height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Arweave_Graphql: block height exceeds GraphQL safe integer range')

	return Number(height)
}

const transactionFieldsFromWire = (
	network: NetworkId,
	transaction: ArweaveGraphqlTransaction
) => ({
	ownerAddress: transaction.owner.address,
	...(transaction.recipient !== '' && {
		targetAddress: transaction.recipient,
	}),
	quantityWinston: BigInt(transaction.quantity.winston),
	rewardWinston: BigInt(transaction.fee.winston),
	signature: transaction.signature,
	lastTx: transaction.anchor,
	dataSizeBytes: BigInt(transaction.data.size),
	tags: transaction.tags.map((tag) => ({
		name: tag.name,
		value: tag.value,
	})),
	...(transaction.block != null && {
		$block: {
			[EntityMetaKey.Selector]: {
				$network: {
					$network: network,
				},
				height: BigInt(transaction.block.height),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: transaction.block.id,
				...(transaction.block.previous !== '' && {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: transaction.block.previous,
				}),
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: transaction.block.timestamp * 1000,
			},
		},
	}),
	...(BigInt(transaction.data.size) > 0n && {
		$resource: {
			[EntityMetaKey.Selector]: {
				transactionId: transaction.id,
				contentPath: '',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: arweaveCanonicalUri(transaction.id, ''),
			},
		},
	}),
})

const blockFieldsFromWire = (
	network: NetworkId,
	block: ArweaveGraphqlBlock & {
		id: string
		timestamp: number
		previous: string
	}
) => ({
	$network: {
		[EntityMetaKey.Selector]: {
			$network: network,
		},
	},
	height: BigInt(block.height),
	indepHash: block.id,
	...(block.previous !== '' && {
		previousBlock: block.previous,
	}),
	timestampMs: block.timestamp * 1000,
})

const transactionEdgeRows = (
	network: NetworkId,
	page: ArweaveGraphqlTransactionPage
) => {
	const transactionIds = new Set<string>()
	return page.edges.map(({ node }) => {
		if (transactionIds.has(node.id))
			throw new Error(`Arweave_Graphql: duplicate transaction identity ${node.id}`)

		transactionIds.add(node.id)
		return {
			[EntityMetaKey.Selector]: {
				$network: {
					$network: network,
				},
				transactionId: node.id,
			},
			[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(
				transactionFieldsFromWire(
					network,
					node
				)
			).map(([field, value]) => [
				entityFieldAddressKey(EntityType.ArweaveTransaction, [], field),
				value,
			])),
		}
	})
}

const transactionPageContinuation = (
	page: ArweaveGraphqlTransactionPage,
	operation: string
) => {
	if (!page.pageInfo.hasNextPage)
		return {
			operation,
			target: 'arweave',
			terminal: true,
		}

	const cursor = page.edges.at(-1)?.cursor
	if (cursor == null)
		throw new Error('Arweave_Graphql: transaction page has no continuation cursor')
	return {
		operation,
		target: 'arweave',
		terminal: false,
		token: cursor,
	}
}

const blockEdgeRows = (
	network: NetworkId,
	page: ArweaveGraphqlBlockPage
) => {
	const heights = new Set<number>()
	return page.edges.map(({ node }) => {
		if (heights.has(node.height))
			throw new Error(`Arweave_Graphql: duplicate block height ${String(node.height)}`)

		heights.add(node.height)
		return {
			[EntityMetaKey.Selector]: {
				$network: {
					$network: network,
				},
				height: BigInt(node.height),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: node.id,
				...(node.previous !== '' && {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: node.previous,
				}),
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: node.timestamp * 1000,
			},
		}
	})
}

const blockPageContinuation = (
	page: ArweaveGraphqlBlockPage
) => {
	if (!page.pageInfo.hasNextPage)
		return {
			operation: 'blocks',
			target: 'arweave',
			terminal: true,
		}

	const cursor = page.edges.at(-1)?.cursor
	if (cursor == null)
		throw new Error('Arweave_Graphql: block page has no continuation cursor')
	return {
		operation: 'blocks',
		target: 'arweave',
		terminal: false,
		token: cursor,
	}
}

const resourceRowsFromTransactionPage = (
	network: NetworkId,
	page: ArweaveGraphqlTransactionPage
) => (
	page.edges.flatMap(({ node }) => (
		BigInt(node.data.size) > 0n ?
			[{
				[EntityMetaKey.Selector]: {
					transactionId: node.id,
					contentPath: '',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: arweaveCanonicalUri(node.id, ''),
					[entityFieldAddressKey(EntityType.ArweaveResource, [], '$transaction')]: {
						[EntityMetaKey.Selector]: {
							$network: {
								$network: network,
							},
							transactionId: node.id,
						},
					},
				},
			}]
		:
			[]
	))
)

const resolveBlockWithTransactions = async (
	network: NetworkId,
	block: ArweaveGraphqlBlock & {
		id: string
		timestamp: number
		previous: string
	},
	context: ResolverContext,
	queries: typeof import('$/sources/Arweave/Graphql/queries.ts')
) => {
	const transactions = (
		resolverContextRowLimit(context) === 0 ?
			{
				edges: [],
				pageInfo: {
					hasNextPage: false,
				},
			}
		:
			await queries.getBlockTransactionsPage({
				height: block.height,
				first: Math.min(resolverContextRowLimit(context), 100),
				after: context.providerContinuationToken,
			})
	)
	return {
		...blockFieldsFromWire(network, block),
		transactions,
	}
}

export default {
	source: Source.Arweave_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.ArweaveNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertArweaveNetwork($network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						const first = Math.min(resolverContextRowLimit(context), 100)
						const transactions = (
							first === 0 ?
								{
									edges: [],
									pageInfo: {
										hasNextPage: false,
									},
								}
							:
								await queries.getTransactionsPage({
									first,
									after: context.providerContinuationToken,
								})
						)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							transactions,
						}
					},
				},
			},
		})({
			$network: (network) => network.$network,
			$$transactions: {
				select: (snapshot, network) => transactionEdgeRows(network.$network, snapshot.transactions),
				continuation: (snapshot) => transactionPageContinuation(snapshot.transactions, 'transactions'),
			},
			$$resources: {
				select: (snapshot, network) => resourceRowsFromTransactionPage(network.$network, snapshot.transactions),
				continuation: (snapshot) => transactionPageContinuation(snapshot.transactions, 'resources'),
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertArweaveNetwork($network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						const first = Math.min(resolverContextRowLimit(context), 100)
						const blocks = (
							first === 0 ?
								{
									edges: [],
									pageInfo: {
										hasNextPage: false,
									},
								}
							:
								await queries.getBlocksPage({
									first,
									after: context.providerContinuationToken,
								})
						)
						return {
							blocks,
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (snapshot, network) => blockEdgeRows(network.$network, snapshot.blocks),
				continuation: (snapshot) => blockPageContinuation(snapshot.blocks),
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertArweaveNetwork($network)
						return {
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$network: {
										$network: $network,
									},
									timestampMs: Date.now(),
									source: Source.Arweave_Graphql,
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						arweaveSlugNetwork,
					],
					resolve: async (network, context) => {
						assertArweaveNetwork(network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						const first = Math.min(resolverContextRowLimit(context), 100)
						const transactions = (
							first === 0 ?
								{
									edges: [],
									pageInfo: {
										hasNextPage: false,
									},
								}
							:
								await queries.getTransactionsPage({
									first,
									after: context.providerContinuationToken,
								})
						)
						return {
							transactions,
						}
					},
				},
			},
		})({
			Arweave: {
				$$transactions: {
					select: (snapshot, network) => transactionEdgeRows(network, snapshot.transactions),
					continuation: (snapshot) => transactionPageContinuation(snapshot.transactions, 'transactions'),
				},
				$$resources: {
					select: (snapshot, network) => resourceRowsFromTransactionPage(network, snapshot.transactions),
					continuation: (snapshot) => transactionPageContinuation(snapshot.transactions, 'resources'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						arweaveSlugNetwork,
					],
					resolve: async (network, context) => {
						assertArweaveNetwork(network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						const first = Math.min(resolverContextRowLimit(context), 100)
						const blocks = (
							first === 0 ?
								{
									edges: [],
									pageInfo: {
										hasNextPage: false,
									},
								}
							:
								await queries.getBlocksPage({
									first,
									after: context.providerContinuationToken,
								})
						)
						return {
							blocks,
						}
					},
				},
			},
		})({
			Arweave: {
				$$blocks: {
					select: (snapshot, network) => blockEdgeRows(network, snapshot.blocks),
					continuation: (snapshot) => blockPageContinuation(snapshot.blocks),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						arweaveSlugNetwork,
					],
					resolve: async (network) => {
						assertArweaveNetwork(network)
						return {
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$network: {
										$network: network,
									},
									timestampMs: Date.now(),
									source: Source.Arweave_Graphql,
								},
							}],
						}
					},
				},
			},
		})({
			Arweave: {
				$$timestamps: (snapshot) => snapshot.timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertArweaveNetworkHub($network)
						if (source !== Source.Arweave_Graphql)
							throw new Error(`Arweave_Graphql: unsupported source ${source}`)

						const { getBlocksPage } = await import('$/sources/Arweave/Graphql/queries.ts')
						const blocks = await getBlocksPage({
							first: 1,
						})
						const latest = blocks.edges[0].node

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestHeight: BigInt(latest.height),
							latestBlockHash: latest.id,
							currentBlockHash: latest.id,
							graphqlCursor: blocks.edges[0]?.cursor,
							reachable: true,
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestHeight: (timestamp) => timestamp.latestHeight,
			latestBlockHash: (timestamp) => timestamp.latestBlockHash,
			currentBlockHash: (timestamp) => timestamp.currentBlockHash,
			graphqlCursor: (timestamp) => timestamp.graphqlCursor,
			reachable: (timestamp) => timestamp.reachable,
		}),

		defineResolver({
			entityType: EntityType.ArweaveBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({
						$network,
						height,
					}, context) => {
						assertArweaveNetworkHub($network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						return resolveBlockWithTransactions(
							$network.$network,
							await queries.getBlockByHeight(safeHeightNumber(height)),
							context,
							queries
						)
					},
				},
				NetworkIndepHash: {
					resolve: async ({
						$network,
						indepHash,
					}, context) => {
						assertArweaveNetworkHub($network)
						const queries = await import('$/sources/Arweave/Graphql/queries.ts')
						return resolveBlockWithTransactions(
							$network.$network,
							await queries.getBlockById(indepHash),
							context,
							queries
						)
					},
				},
			},
		})({
			$network: (block) => block.$network,
			height: (block) => block.height,
			indepHash: (block) => block.indepHash,
			previousBlock: (block) => block.previousBlock,
			timestampMs: (block) => block.timestampMs,
			$$transactions: {
				select: (block) => transactionEdgeRows(
					block.$network[EntityMetaKey.Selector].$network,
					block.transactions
				),
				continuation: (block) => transactionPageContinuation(block.transactions, 'block-transactions'),
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveTransaction,
			resolve: {
				NetworkTransactionId: {
					resolve: async ({ $network, transactionId }) => {
						assertArweaveNetworkHub($network)
						const { getTransactionById } = await import('$/sources/Arweave/Graphql/queries.ts')
						const transaction = await getTransactionById(transactionId)
						if (transaction.id !== transactionId)
							throw new Error('Arweave_Graphql: returned a foreign transaction')

						return transactionFieldsFromWire(
							$network.$network,
							transaction
						)
					},
				},
			},
		})({
			ownerAddress: (transaction) => transaction.ownerAddress,
			targetAddress: (transaction) => transaction.targetAddress,
			quantityWinston: (transaction) => transaction.quantityWinston,
			rewardWinston: (transaction) => transaction.rewardWinston,
			signature: (transaction) => transaction.signature,
			lastTx: (transaction) => transaction.lastTx,
			dataSizeBytes: (transaction) => transaction.dataSizeBytes,
			tags: (transaction) => transaction.tags,
			$block: (transaction) => transaction.$block,
			$resource: (transaction) => transaction.$resource,
		}),

		defineResolver({
			entityType: EntityType.ArweaveResource,
			resolve: {
				TransactionIdContentPath: {
					resolve: async ({
						transactionId,
						contentPath,
					}) => {
						if (!/^[A-Za-z0-9_-]{43}$/.test(transactionId))
							throw new Error('Arweave_Graphql: invalid transaction ID')
						if (contentPath.includes('://') || contentPath.includes('..'))
							throw new Error('Arweave_Graphql: invalid content path')

						const { getTransactionById } = await import('$/sources/Arweave/Graphql/queries.ts')
						const transaction = await getTransactionById(transactionId)
						if (BigInt(transaction.data.size) === 0n && contentPath === '')
							throw new Error('Arweave_Graphql: transaction has no data payload')

						return {
							transactionId,
							contentPath,
							canonicalUri: arweaveCanonicalUri(transactionId, contentPath),
							$transaction: {
								[EntityMetaKey.Selector]: {
									$network: {
										$network: arweaveSlugNetwork,
									},
									transactionId,
								},
							},
						}
					},
				},
			},
		})({
			transactionId: (resource) => resource.transactionId,
			contentPath: (resource) => resource.contentPath,
			canonicalUri: (resource) => resource.canonicalUri,
			$transaction: (resource) => resource.$transaction,
		}),
	],
} satisfies RegisteredSourceResolverModule
