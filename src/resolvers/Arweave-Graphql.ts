import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertArweaveNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'arweave')
		throw new Error('Arweave_Graphql: unsupported network')
}

const transactionFieldsFromWire = (
	network: NetworkId,
	transaction: Awaited<ReturnType<typeof import('$/sources/Arweave/Graphql/queries.ts').getTransactionById>>
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
	...(transaction.block != null && transaction.block.id != null && {
		$block: {
			[EntityMetaKey.Selector]: {
				$network: {
					$network: network,
				},
				height: BigInt(transaction.block.height),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: transaction.block.id,
				...(transaction.block.previous != null && transaction.block.previous !== '' && {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: transaction.block.previous,
				}),
				...(transaction.block.timestamp != null && {
					[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: transaction.block.timestamp * 1000,
				}),
			},
		},
	}),
})

export default {
	source: Source.Arweave_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.ArweaveNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertArweaveNetwork($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							transactions: (
								resolverContextRowLimit(context) === 0 ?
									[]
								:
									await (await import('$/sources/Arweave/Graphql/queries.ts')).getTransactionsPage({
										first: Math.min(resolverContextRowLimit(context), 100),
										after: context.providerContinuationToken,
									})
							),
						}
					},
				},
			},
		})({
			$network: (network) => network.$network,
			$$transactions: {
				select: (page, network) => page.transactions.edges.map(({ node }) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							$network: network.$network,
						},
						transactionId: node.id,
					},
					[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(
						transactionFieldsFromWire(
							network.$network,
							node
						)
					).map(([field, value]) => [
						entityFieldAddressKey(EntityType.ArweaveTransaction, [], field),
						value,
					])),
				})),
				continuation: (page) => {
					if (!page.transactions.pageInfo.hasNextPage)
						return {
							operation: 'transactions',
							target: 'arweave',
							terminal: true,
						}

					const cursor = page.transactions.edges.at(-1)?.cursor
					if (cursor == null)
						throw new Error('Arweave_Graphql: transaction page has no continuation cursor')
					return {
						operation: 'transactions',
						target: 'arweave',
						terminal: false,
						token: cursor,
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveTransaction,
			resolve: {
				NetworkTransactionId: {
					resolve: async ({ $network, transactionId }) => {
						assertArweaveNetwork($network.$network)
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
		}),
	],
}
