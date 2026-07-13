import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Network_TimestampSelector } from '$/schema/Network_Timestamp.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const polkadotMainnetRpcEndpoints = async () => (
	(await import('$/sources/Polkadot/JsonRpc/queries.ts')).polkadotMainnetRpcEndpoints
)

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		(
			!('caip2' in network)
			|| network.caip2.namespace !== networkBySlug.polkadot.caip2.namespace
			|| network.caip2.reference !== networkBySlug.polkadot.caip2.reference
		)
		&& (
			!('slug' in network)
			|| network.slug !== 'polkadot'
		)
	) {
		throw new Error('Polkadot_JsonRpc: unsupported network')
	}
}

const blockNumberFromHeader = (header: { number: string }) => BigInt(header.number)

const polkadotExtrinsicRows = (
	network: NetworkId,
	block: PolkadotRpcBlock,
	hash: string
) => (
	block.block.extrinsics.map((_extrinsic, extrinsicIndex) => ({
		[EntityMetaKey.Selector]: {
			$block: {
				$network: network,
				blockNumber: blockNumberFromHeader(block.block.header),
				hash,
			},
			indexInBlock: extrinsicIndex,
		},
	}))
)

export default {
	source: Source.Polkadot_JsonRpc,

	resolvers: [
		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertPolkadotMainnet(network)
					return {
						Polkadot: {
							rpcEndpoints: [...(await polkadotMainnetRpcEndpoints())],
						},
					}
				}
			},
		})({
				Polkadot: {
					rpcEndpoints: (network) => network.polkadotRpcEndpoints,
				},
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.Network_Timestamp,
			resolve: {
				[Network_TimestampSelector.NetworkTimestampMsSource]: async ({
					$network,
					timestampMs,
					source,
				}) => {
					if (source !== Source.Polkadot_JsonRpc)
						throw new Error(`Polkadot_JsonRpc: unsupported source ${source}`)
					assertPolkadotMainnet($network)
					const {
						getBlock,
						getFinalizedHead,
						getHeader,
						getRuntimeVersion,
						getSystemHealth,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({ rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url })
					const [
						header,
					block,
					runtimeVersion,
					systemHealth,
					] = await Promise.all([
						getHeader({
							rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
							blockHash: finalizedBlockHash,
						}),
						getBlock({
							rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
							blockHash: finalizedBlockHash,
						}),
						getRuntimeVersion({ rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url }),
						getSystemHealth({ rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url }),
					])
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						timestampMs,
						source,
						ledgerModels: [NetworkLedgerModel.Account],
						executionModels: [NetworkExecutionModel.PolkadotRuntime],
						finalizedBlockNumber: blockNumberFromHeader(header),
						finalizedBlockHash,
						finalizedExtrinsicCount: block.block.extrinsics.length,
						runtimeSpecName: runtimeVersion.specName,
						runtimeSpecVersion: runtimeVersion.specVersion,
						transactionVersion: runtimeVersion.transactionVersion,
						stateVersion: runtimeVersion.stateVersion,
						peerCount: systemHealth.peers,
						isSyncing: systemHealth.isSyncing,
						shouldHavePeers: systemHealth.shouldHavePeers,
					}
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Polkadot: {
					finalizedBlockNumber: (timestamp) => timestamp.finalizedBlockNumber,
					finalizedBlockHash: (timestamp) => timestamp.finalizedBlockHash,
					finalizedExtrinsicCount: (timestamp) => timestamp.finalizedExtrinsicCount,
					runtimeSpecName: (timestamp) => timestamp.runtimeSpecName,
					runtimeSpecVersion: (timestamp) => timestamp.runtimeSpecVersion,
					transactionVersion: (timestamp) => timestamp.transactionVersion,
					stateVersion: (timestamp) => timestamp.stateVersion,
					peerCount: (timestamp) => timestamp.peerCount,
					isSyncing: (timestamp) => timestamp.isSyncing,
					shouldHavePeers: (timestamp) => timestamp.shouldHavePeers,
				},
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, blockNumber, hash: hashSelector }) => {
					assertPolkadotMainnet($network)
					const {
						getBlock,
						getBlockHash,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const hash = hashSelector
					const block = await getBlock({
						rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
						blockHash: hash,
					})
					return {
						hash,
						...(blockNumber > 0n && {
							$parent: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									blockNumber: blockNumberFromHeader(block.block.header) - 1n,
									hash: block.block.header.parentHash,
								},
							},
						}),
						stateRoot: block.block.header.stateRoot,
						extrinsicsRoot: block.block.header.extrinsicsRoot,
						$$extrinsics: polkadotExtrinsicRows(
							$network,
							block,
							hash
					),
					}
				}
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				stateRoot: (block) => block.stateRoot,
				extrinsicsRoot: (block) => block.extrinsicsRoot,
				$$extrinsics: (block) => block.$$extrinsics,
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertPolkadotMainnet(network)
					return [
						{
							...(await polkadotMainnetRpcEndpoints())[0],
						},
					]
				}
			},
		})({
				Polkadot: {
					rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
				},
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertPolkadotMainnet(network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.Polkadot_JsonRpc,
							},
						},
					]
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertPolkadotMainnet(network)
					const {
						getFinalizedHead,
						getHeader,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({ rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url })
					const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
						rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
						blockHash: finalizedBlockHash,
					}))
					return Array.from({
						length: Math.min(
							1,
							Number(finalizedBlockNumber + 1n),
							resolverContextRowLimit(context)
					),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							blockNumber: finalizedBlockNumber - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: finalizedBlockHash,
							}),
						},
					}))
				}
			},
		})({
				Polkadot: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, blockNumber, hash }) => {
					assertPolkadotMainnet($network)
					if (blockNumber === 0n) throw new Error('Polkadot_JsonRpc: genesis block has no parent')
					const {
						getBlock,
						getBlockHash,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const block = await getBlock({
						rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
						blockHash: hash,
					})
					return {
						[EntityMetaKey.Selector]: {
							$network: $network,
							blockNumber: blockNumberFromHeader(block.block.header) - 1n,
							hash: block.block.header.parentHash,
						},
					}
				}
			},
		})({
				$parent: (parent) => parent,
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
					assertPolkadotMainnet($network)
					const {
						getBlock,
						getBlockHash,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					return polkadotExtrinsicRows(
						$network,
						await getBlock({
							rpcUrl: (await polkadotMainnetRpcEndpoints())[0].url,
							blockHash: hash,
						}),
						hash
					)
				}
			},
		})({
				$$extrinsics: (extrinsics) => extrinsics,
			}),
	],
}
