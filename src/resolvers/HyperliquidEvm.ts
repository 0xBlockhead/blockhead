import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { HyperliquidEvmTransaction } from '$/sources/Hyperliquid/JsonRpc/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid EVM: unsupported network')
}

const hexToBigInt = (hex: string) => BigInt(hex)

const hyperliquidTransactionEntity = (
	transaction: HyperliquidEvmTransaction,
	network: NetworkId
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		txHash: transaction.hash,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], 'actionType')]: 'evm',
		...(transaction.blockNumber != null && {
			[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: hexToBigInt(transaction.blockNumber),
				},
			},
		}),
		...(transaction.from != null && {
			[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$account')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: transaction.from,
				},
			},
		}),
	},
})

const resolveHyperliquidBlocks = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
	const headBlockHeight = hexToBigInt(await getBlockNumber())
	return Array.from({
		length: Math.min(
			Number(headBlockHeight + 1n),
			limit
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			height: headBlockHeight - BigInt(blockOffset),
		},
	}))
}

const resolveHyperliquidTransactions = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const {
		getBlockByNumber,
		getBlockNumber,
	} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
	const headBlockHeight = hexToBigInt(await getBlockNumber())
	return (
		await Promise.all(
			Array.from({
				length: Math.min(
					Number(headBlockHeight + 1n),
					16
				),
			}, (_value, blockOffset) => (
				getBlockByNumber({
					height: headBlockHeight - BigInt(blockOffset),
					includeTransactions: true,
				})
			))
		)
	)
		.flatMap((block) => (
			block?.transactions.map((transaction) => (
				hyperliquidTransactionEntity(transaction, network)
			)) ?? []
		))
		.slice(0, limit)
}

export const hyperliquidEvmResolvers = [
		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidBlock,
			resolve: {
				Height: {
					resolve: async ({ $network, height }) => {
						assertHyperliquidMainnet($network)

						const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const block = await getBlockByNumber({
							height,
							includeTransactions: true,
						})
						if (block == null) throw new Error(`Hyperliquid EVM: block not found for ${height.toString()}`)
						return {
							hash: block.hash,
							timestampMs: Number(hexToBigInt(block.timestamp)) * 1000,
							$$transactions: block.transactions.map((transaction) => (
								hyperliquidTransactionEntity(transaction, $network)
							)),
						}
					},
				}
			},
		})({
			hash: (snapshot) => snapshot.hash,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						assertHyperliquidMainnet($network)
						const { getTransactionByHash } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const transaction = await getTransactionByHash({
							txHash: txHash,
						})
						if (transaction == null) throw new Error(`Hyperliquid EVM: transaction not found for ${txHash}`)
						return {
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										height: hexToBigInt(transaction.blockNumber),
									},
								},
							}),
							...(transaction.from != null && {
								$account: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: transaction.from,
									},
								},
							}),
							actionType: 'evm',
						}
					},
				},
			},
		})({
			$block: (snapshot) => snapshot.$block,
			$account: (snapshot) => snapshot.$account,
			actionType: (snapshot) => snapshot.actionType,
		}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								timestampMs: Date.now(),
								source: Source.Hyperliquid,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidTransaction_Timestamp,
			resolve: {
				TransactionTimestampMsSource: {
					resolve: async ({ $transaction }) => {
						assertHyperliquidMainnet($transaction.$network)
						const { getTransactionReceipt } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const receipt = await getTransactionReceipt({
							txHash: $transaction.txHash,
						})
						return {
							...(receipt?.status != null && {
								status: receipt.status === '0x1' ? 'success' : 'failed',
							}),
							...(receipt?.blockNumber != null && {
								blockNumber: hexToBigInt(receipt.blockNumber),
							}),
						}
					},
				},
			},
		})({
				status: (snapshot) => snapshot.status,
				blockNumber: (snapshot) => snapshot.blockNumber,
			}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: ({ $network }, context) => resolveHyperliquidBlocks(
						$network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			$$blocks: (snapshot) => snapshot,
		}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: (network, context) => resolveHyperliquidBlocks(
						network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			Hyperliquid: {
				$$blocks: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: ({ $network }, context) => resolveHyperliquidTransactions(
						$network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			$$transactions: (snapshot) => snapshot,
		}),

		defineResolver(Source.Hyperliquid, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: (network, context) => resolveHyperliquidTransactions(
						network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			Hyperliquid: {
				$$transactions: (snapshot) => snapshot,
			},
		}),
]
