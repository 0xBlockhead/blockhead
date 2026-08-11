import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { RpcTransactionWire } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>
const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid_JsonRpc: unsupported network')
}
const hexToBigInt = (
	value: string,
	label: string
) => {
	if (!/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/.test(value))
		throw new Error(`Hyperliquid_JsonRpc: invalid ${label}`)

	return BigInt(value)
}

const hyperliquidTransactionEntity = (
	transaction: RpcTransactionWire,
	network: NetworkId
) => {
	const txHash = hexLowerOfByteSize(transaction.hash, 32)
	const accountAddress = hexLowerOfByteSize(transaction.from, 20)
	if (txHash == null || accountAddress == null)
		throw new Error('Hyperliquid_JsonRpc: transaction identity is not normalized')

	return {
		[EntityMetaKey.Selector]: {
			$network: network,
			txHash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], 'actionType')]: 'evm',
			...(transaction.blockNumber != null && {
				[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						height: hexToBigInt(transaction.blockNumber, 'transaction block number'),
					},
				},
			}),
			[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$account')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: accountAddress,
				},
			},
		},
	}
}

const assertHyperliquidBlock = (
	block: {
		number: string
		hash: string
	},
	expectedHeight: bigint
) => {
	if (hexToBigInt(block.number, 'block number') !== expectedHeight)
		throw new Error('Hyperliquid_JsonRpc: block height does not match request')

	const blockHash = hexLowerOfByteSize(block.hash, 32)
	if (blockHash == null)
		throw new Error('Hyperliquid_JsonRpc: block hash is not normalized')

	return blockHash
}
const resolveHyperliquidBlocks = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
	const headBlockHeight = hexToBigInt(await getBlockNumber(), 'head block number')
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
	const headBlockHeight = hexToBigInt(await getBlockNumber(), 'head block number')
	return (
		await Promise.all(
			Array.from({
				length: Math.min(
					Number(headBlockHeight + 1n),
					16
				),
			}, (_value, blockOffset) => (
				getBlockByNumber(headBlockHeight - BigInt(blockOffset))
			))
		)
	)
		.flatMap((block, blockOffset) => {
			if (block == null)
				throw new Error(`Hyperliquid_JsonRpc: block not found for ${(headBlockHeight - BigInt(blockOffset)).toString()}`)
			const blockHeight = headBlockHeight - BigInt(blockOffset)
			const blockHash = assertHyperliquidBlock(block, blockHeight)

			return block.transactions.map((transaction) => {
				if (
					transaction.blockNumber !== block.number
					|| transaction.blockHash?.toLowerCase() !== blockHash
				)
					throw new Error('Hyperliquid_JsonRpc: block transaction does not match block identity')

				return hyperliquidTransactionEntity(transaction, network)
			})
		})
		.slice(0, limit)
}
export const hyperliquidEvmResolvers = [
	defineResolver({
		entityType: EntityType.HyperliquidBlock,
		resolve: {
			Height: {
				resolve: async ({ $network, height }) => {
					assertHyperliquidMainnet($network)
					const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
					const block = await getBlockByNumber(height)
					if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${height.toString()}`)
					const blockHash = assertHyperliquidBlock(block, height)
					return {
						hash: blockHash,
						timestampMs: Number(hexToBigInt(block.timestamp, 'block timestamp')) * 1000,
						$$transactions: block.transactions.map((transaction) => {
							if (
								transaction.blockNumber !== block.number
								|| transaction.blockHash?.toLowerCase() !== blockHash
							)
								throw new Error('Hyperliquid_JsonRpc: block transaction does not match block identity')

							return hyperliquidTransactionEntity(transaction, $network)
						}),
					}
				},
			}
		},
	})({
		hash: (snapshot) => snapshot.hash,
		timestampMs: (snapshot) => snapshot.timestampMs,
		$$transactions: (snapshot) => snapshot.$$transactions,
	}),
	defineResolver({
		entityType: EntityType.HyperliquidTransaction,
		resolve: {
			NetworkTxHash: {
				resolve: async ({ $network, txHash }) => {
					assertHyperliquidMainnet($network)
					const { getTransactionByHash } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
					const transaction = await getTransactionByHash({ txHash })
					if (transaction == null) throw new Error(`Hyperliquid_JsonRpc: transaction not found for ${txHash}`)
					if (hexLowerOfByteSize(transaction.hash, 32) !== txHash)
						throw new Error('Hyperliquid_JsonRpc: transaction hash does not match request')

					const accountAddress = hexLowerOfByteSize(transaction.from, 20)
					if (accountAddress == null)
						throw new Error('Hyperliquid_JsonRpc: transaction account is not normalized')

					return {
						...(transaction.blockNumber != null && {
							$block: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									height: hexToBigInt(transaction.blockNumber, 'transaction block number'),
								},
							},
						}),
						$account: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: accountAddress,
							},
						},
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
	defineResolver({
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
	defineResolver({
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
	defineResolver({
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
	defineResolver({
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
	defineResolver({
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
