import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidEvmRpcUrl = 'https://rpc.hyperliquid.xyz/evm'

const hyperliquidRpcEndpoints = [
	{
		url: hyperliquidEvmRpcUrl,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid HyperEVM JSON-RPC',
	},
]

const assertHyperliquidMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'hyperliquid') {
		throw new Error('Hyperliquid_JsonRpc: unsupported network')
	}
}

const hexToBigInt = (hex: string) => BigInt(hex)

export default {
	source: Source.Hyperliquid_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const headBlockHeight = hexToBigInt(await getBlockNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
				}))
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					rpcEndpoints: hyperliquidRpcEndpoints,
					$headBlock: {
						[EntityMetaKey.Id]: {
							$network: entityId,
							height: headBlockHeight,
						},
					},
					$$blocks: [
						{
							[EntityMetaKey.Id]: {
								$network: entityId,
								height: headBlockHeight,
							},
						},
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidBlock,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
					height: entityId.height,
					includeTransactions: true,
				})
				if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${entityId.height.toString()}`)
				return {
					hash: block.hash,
					timestampMs: Number(hexToBigInt(block.timestamp)) * 1000,
					$$transactions: block.transactions.map((transaction) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							txHash: transaction.hash,
						},
						actionType: 'evm',
						...(transaction.blockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									height: hexToBigInt(transaction.blockNumber),
								},
							},
						}),
						...(transaction.from != null && {
							$account: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: transaction.from,
								},
							},
						}),
					})),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidTransaction,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const {
					getTransactionByHash,
					getTransactionReceipt,
				} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const transaction = await getTransactionByHash({
					rpcUrl: hyperliquidEvmRpcUrl,
					txHash: entityId.txHash,
				})
				if (transaction == null) throw new Error(`Hyperliquid_JsonRpc: transaction not found for ${entityId.txHash}`)
				const receipt = await getTransactionReceipt({
					rpcUrl: hyperliquidEvmRpcUrl,
					txHash: entityId.txHash,
				})
				return {
					...(transaction.blockNumber != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: hexToBigInt(transaction.blockNumber),
							},
						},
					}),
					...(transaction.from != null && {
						$account: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: transaction.from,
							},
						},
					}),
					actionType: 'evm',
					...(receipt?.status != null && {
						status: receipt.status === '0x1' ? 'success' : 'failed',
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$headBlock',
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: hexToBigInt(await getBlockNumber({
							rpcUrl: hyperliquidEvmRpcUrl,
						})),
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const headBlockHeight = hexToBigInt(await getBlockNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
				}))
				return Array.from({
					length: Math.min(
						Number(headBlockHeight + 1n),
						resolverLoadSubsetRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: headBlockHeight - BigInt(blockOffset),
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
					height: entityId.height,
					includeTransactions: true,
				})
				if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${entityId.height.toString()}`)
				return block.transactions.map((transaction) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash: transaction.hash,
					},
					actionType: 'evm',
					...(transaction.blockNumber != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: hexToBigInt(transaction.blockNumber),
							},
						},
					}),
					...(transaction.from != null && {
						$account: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: transaction.from,
							},
						},
					}),
				}))
			},
		}),
	],
}
