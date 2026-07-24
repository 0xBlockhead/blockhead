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
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { HyperliquidNetworkSelector } from '$/schema/HyperliquidNetwork.ts'
import { HyperliquidBlockSelector } from '$/schema/HyperliquidBlock.ts'
import { HyperliquidTransactionSelector } from '$/schema/HyperliquidTransaction.ts'
import { HyperliquidTransaction_TimestampSelector } from '$/schema/HyperliquidTransaction_Timestamp.ts'
import { NetworkSelector } from '$/schema/Network.ts'

const hyperliquidJsonRpcBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Hyperliquid_JsonRpc
		&& binding.target.kind === SourceTargetKind.Eip155Chain
		&& binding.target.key === '999'
	))

if (hyperliquidJsonRpcBindings.length !== 1)
	throw new Error('Hyperliquid_JsonRpc: canonical HyperEVM source binding is missing or ambiguous')

const hyperliquidJsonRpcBinding = hyperliquidJsonRpcBindings[0]
const hyperliquidRpcEndpoints = hyperliquidJsonRpcBinding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))

const assertHyperliquidMainnet = (network: EntitySelector<typeof schema, EntityType.Network>) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid_JsonRpc: unsupported network')
}

const hexToBigInt = (hex: string) => BigInt(hex)

export default {
	source: Source.Hyperliquid_JsonRpc,

	resolvers: [
		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: {
					resolve: async ({ $network }) => {
						assertHyperliquidMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: hyperliquidRpcEndpoints,
						}
					},
				}
			},
		})({
				$network: (snapshot) => snapshot.$network,
				rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network) => {
						assertHyperliquidMainnet(network)
						return {
							Hyperliquid: {
								rpcEndpoints: hyperliquidRpcEndpoints,
							},
						}
					},
				}
			},
		})({
				Hyperliquid: {
					rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
				},
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidBlock,
			resolve: {
				[HyperliquidBlockSelector.Height]: {
					resolve: async ({ $network, height }) => {
						assertHyperliquidMainnet($network)

						const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const block = await getBlockByNumber({
							binding: hyperliquidJsonRpcBinding,
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
													[EntityMetaKey.Fields]: {
														[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], 'actionType')]: 'evm',
								...(transaction.blockNumber != null && {
														[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$block')]: {
										[EntityMetaKey.Selector]: {
											$network,
											height: hexToBigInt(transaction.blockNumber),
										},
									},
								}),
								...(transaction.from != null && {
														[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$account')]: {
										[EntityMetaKey.Selector]: {
											$network,
											address: transaction.from,
										},
									},
													}),
												},
							})),
						}
					},
				}
			},
		})({
			hash: (snapshot) => snapshot.hash,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				[HyperliquidTransactionSelector.NetworkTxHash]: {
					resolve: async ({ $network, txHash }) => {
						assertHyperliquidMainnet($network)
						const { getTransactionByHash } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const transaction = await getTransactionByHash({
							binding: hyperliquidJsonRpcBinding,
							txHash: txHash,
						})
						if (transaction == null) throw new Error(`Hyperliquid_JsonRpc: transaction not found for ${txHash}`)
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

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidTransaction,
			resolve: {
				[HyperliquidTransactionSelector.NetworkTxHash]: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								timestampMs: Date.now(),
								source: Source.Hyperliquid_JsonRpc,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidTransaction_Timestamp,
			resolve: {
				[HyperliquidTransaction_TimestampSelector.TransactionTimestampMsSource]: {
					resolve: async ({ $transaction }) => {
						assertHyperliquidMainnet($transaction.$network)
						const { getTransactionReceipt } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const receipt = await getTransactionReceipt({
							binding: hyperliquidJsonRpcBinding,
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

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertHyperliquidMainnet($network)
						const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const headBlockHeight = hexToBigInt(await getBlockNumber({
							binding: hyperliquidJsonRpcBinding,
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
					},
				}
			},
		})({
				$$blocks: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network, context) => {
						assertHyperliquidMainnet(network)
						const { getBlockNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const headBlockHeight = hexToBigInt(await getBlockNumber({
							binding: hyperliquidJsonRpcBinding,
						}))
						return Array.from({
							length: Math.min(
								Number(headBlockHeight + 1n),
								resolverContextRowLimit(context)
							),
						}, (_value, blockOffset) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								height: headBlockHeight - BigInt(blockOffset),
							},
						}))
					},
				}
			},
		})({
				Hyperliquid: {
					$$blocks: (snapshot) => snapshot,
				},
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertHyperliquidMainnet($network)
						const {
							getBlockByNumber,
							getBlockNumber,
						} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const headBlockHeight = hexToBigInt(await getBlockNumber({
							binding: hyperliquidJsonRpcBinding,
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
									binding: hyperliquidJsonRpcBinding,
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
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], 'actionType')]: 'evm',
										...(transaction.blockNumber != null && {
											[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$block')]: {
											[EntityMetaKey.Selector]: {
												$network: $network,
												height: hexToBigInt(transaction.blockNumber),
											},
											},
										}),
										...(transaction.from != null && {
											[entityFieldAddressKey(EntityType.HyperliquidTransaction, [], '$account')]: {
											[EntityMetaKey.Selector]: {
												$network: $network,
												address: transaction.from,
											},
											},
										}),
									},
								})) ?? []
							))
							.slice(0, resolverContextRowLimit(context))
					},
				}
			},
		})({
				$$transactions: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network, context) => {
						assertHyperliquidMainnet(network)
						const {
							getBlockByNumber,
							getBlockNumber,
						} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
						const headBlockHeight = hexToBigInt(await getBlockNumber({
							binding: hyperliquidJsonRpcBinding,
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
										binding: hyperliquidJsonRpcBinding,
										height: headBlockHeight - BigInt(blockOffset),
										includeTransactions: true,
									})
								))
							)
						)
							.flatMap((block) => (
								block?.transactions.map((transaction) => ({
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
								})) ?? []
							))
							.slice(0, resolverContextRowLimit(context))
					},
				}
			},
		})({
			Hyperliquid: {
				$$transactions: (snapshot) => snapshot,
			},
		}),
	],
}
