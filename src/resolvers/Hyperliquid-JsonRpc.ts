import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { hyperliquidMainnetRpcEndpoints } from '$/constants/HyperliquidNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidEvmRpcUrl = hyperliquidMainnetRpcEndpoints[0].url

const assertHyperliquidMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.hyperliquid.slug) {
		throw new Error('Hyperliquid_JsonRpc: unsupported network')
	}
}

const hexToBigInt = (hex: string) => BigInt(hex)

export default {
	source: Source.Hyperliquid_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					rpcEndpoints: [...hyperliquidMainnetRpcEndpoints],
				}
			}
			},
			fields: {
			$network: (snapshot) => snapshot.$network,
			rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				if (!('height' in entityId))
					throw new Error('Hyperliquid_JsonRpc: HyperliquidBlock hash lookup is unsupported')

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
			}
			},
			fields: {
			hash: (snapshot) => snapshot.hash,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
			$block: (snapshot) => snapshot.$block,
			$account: (snapshot) => snapshot.$account,
			actionType: (snapshot) => snapshot.actionType,
			status: (snapshot) => snapshot.status,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const headBlockHeight = hexToBigInt(await getBlockNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
				}))
				return Array.from({
					length: Math.min(
						Number(headBlockHeight + 1n),
						resolverContextRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: headBlockHeight - BigInt(blockOffset),
					},
				}))
			}
			},
			fields: {
			$$blocks: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const {
					getBlockByNumber,
					getBlockNumber,
				} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const headBlockHeight = hexToBigInt(await getBlockNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
				}))
				return (
					await Promise.all(
						Array.from({
							length: Math.min(
								Number(headBlockHeight + 1n),
								16,
							),
						}, async (_value, blockOffset) => (
							await getBlockByNumber({
								rpcUrl: hyperliquidEvmRpcUrl,
								height: headBlockHeight - BigInt(blockOffset),
								includeTransactions: true,
							})
						)),
					)
				)
					.flatMap((block) => (
						block?.transactions.map((transaction) => ({
							[EntityMetaKey.Id]: {
								$network: entityId,
								txHash: transaction.hash,
							},
							actionType: 'evm',
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Id]: {
										$network: entityId,
										height: hexToBigInt(transaction.blockNumber),
									},
								},
							}),
							...(transaction.from != null && {
								$account: {
									[EntityMetaKey.Id]: {
										$network: entityId,
										address: transaction.from,
									},
								},
							}),
						})) ?? []
					))
					.slice(0, resolverContextRowLimit(context))
			}
			},
			fields: {
			$$transactions: (snapshot) => snapshot,
		}
		}),
	],
}
