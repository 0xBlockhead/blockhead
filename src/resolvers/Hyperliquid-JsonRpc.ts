import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { hyperliquidMainnetRpcEndpoints } from '$/sources/Hyperliquid/index.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { HyperliquidNetworkSelector } from '$/schema/HyperliquidNetwork.ts'
import { HyperliquidBlockSelector } from '$/schema/HyperliquidBlock.ts'
import { HyperliquidTransactionSelector } from '$/schema/HyperliquidTransaction.ts'

const hyperliquidEvmRpcUrl = hyperliquidMainnetRpcEndpoints[0].url

const assertHyperliquidMainnet = (network: EntitySelector<typeof schema, EntityType.Network>) => {
	if (stringify(network) !== stringify({ slug: networkBySlug.hyperliquid.slug }))
		throw new Error('Hyperliquid_JsonRpc: unsupported network')
}

const hexToBigInt = (hex: string) => BigInt(hex)

export default {
	source: Source.Hyperliquid_JsonRpc,

	resolvers: [
		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }) => {
					assertHyperliquidMainnet($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						rpcEndpoints: [...hyperliquidMainnetRpcEndpoints],
					}
				}
			},
		})({
			fields: {
				$network: (snapshot) => snapshot.$network,
				rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
			},
		}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidBlock,
			resolve: {
				[HyperliquidBlockSelector.Height]: async ({ $network, height }) => {
					assertHyperliquidMainnet($network)

					const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
					const block = await getBlockByNumber({
						rpcUrl: hyperliquidEvmRpcUrl,
						height,
						includeTransactions: true,
					})
					if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${height.toString()}`)
					return {
						hash: block.hash,
						timestampMs: Number(hexToBigInt(block.timestamp)) * 1000,
						$$transactions: block.transactions.map((transaction) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txHash: transaction.hash,
							},
							actionType: 'evm',
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										height: hexToBigInt(transaction.blockNumber),
									},
								},
							}),
							...(transaction.from != null && {
								$account: {
									[EntityMetaKey.Selector]: {
										$network,
										address: transaction.from,
									},
								},
							}),
						})),
					}
				}
			},
		})({
			fields: {
				hash: (snapshot) => snapshot.hash,
				timestampMs: (snapshot) => snapshot.timestampMs,
				$$transactions: (snapshot) => snapshot.$$transactions,
			},
		}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				[HyperliquidTransactionSelector.NetworkTxHash]: async ({ $network, txHash }) => {
					assertHyperliquidMainnet($network)
					const {
						getTransactionByHash,
						getTransactionReceipt,
					} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
					const transaction = await getTransactionByHash({
						rpcUrl: hyperliquidEvmRpcUrl,
						txHash: txHash,
					})
					if (transaction == null) throw new Error(`Hyperliquid_JsonRpc: transaction not found for ${txHash}`)
					const receipt = await getTransactionReceipt({
						rpcUrl: hyperliquidEvmRpcUrl,
						txHash: txHash,
					})
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
						...(receipt?.status != null && {
							status: receipt.status === '0x1' ? 'success' : 'failed',
						}),
					}
				}
			},
		})({
			fields: {
				$block: (snapshot) => snapshot.$block,
				$account: (snapshot) => snapshot.$account,
				actionType: (snapshot) => snapshot.actionType,
				status: (snapshot) => snapshot.status,
			},
		}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }, context) => {
					assertHyperliquidMainnet($network)
					const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
					const headBlockHeight = hexToBigInt(await getBlockNumber({
						rpcUrl: hyperliquidEvmRpcUrl,
					}))
					return Array.from({
						length: Math.min(
							Number(headBlockHeight + 1n),
							resolverContextRowLimit(context)
						),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							height: headBlockHeight - BigInt(blockOffset),
						},
					}))
				}
			},
		})({
			fields: {
				$$blocks: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }, context) => {
					assertHyperliquidMainnet($network)
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
									16
							),
							}, async (_value, blockOffset) => (
							await getBlockByNumber({
								rpcUrl: hyperliquidEvmRpcUrl,
								height: headBlockHeight - BigInt(blockOffset),
								includeTransactions: true,
							})
							))
						)
					)
						.flatMap((block) => (
							block?.transactions.map((transaction) => ({
								[EntityMetaKey.Selector]: {
									$network: $network,
									txHash: transaction.hash,
								},
								actionType: 'evm',
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
							})) ?? []
						))
						.slice(0, resolverContextRowLimit(context))
				}
			},
		})({
			fields: {
				$$transactions: (snapshot) => snapshot,
			},
		}),
	],
}
