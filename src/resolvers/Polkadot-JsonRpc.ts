import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	polkadotMainnetRpcEndpoints,
} from '$/sources/Polkadot/index.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'
import { PolkadotNetworkSelector } from '$/schema/PolkadotNetwork.ts'
import { PolkadotNetwork_TimestampSelector } from '$/schema/PolkadotNetwork_Timestamp.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		stringify(network) !== stringify({ caip2: networkBySlug.polkadot.caip2 })
		&& stringify(network) !== stringify({ slug: 'polkadot' })
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
			extrinsicIndex,
		},
	}))
)

export default {
	source: Source.Polkadot_JsonRpc,

	resolvers: [
		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
					assertPolkadotMainnet(entitySelector.$network)
					return {
						$network: {
							[EntityMetaKey.Selector]: entitySelector.$network,
						},
						rpcEndpoints: [...polkadotMainnetRpcEndpoints],
					}
				}
			},
		})({
			fields: {
				$network: (network) => network.$network,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
		}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork_Timestamp,
			resolve: {
				[PolkadotNetwork_TimestampSelector.NetworkTimestampMs]: async ({ $network }) => {
					assertPolkadotMainnet($network)
					const {
						getBlock,
						getFinalizedHead,
						getHeader,
						getRuntimeVersion,
						getSystemHealth,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotMainnetRpcEndpoints[0].url })
					const [
						header,
					block,
					runtimeVersion,
					systemHealth,
					] = await Promise.all([
						getHeader({
							rpcUrl: polkadotMainnetRpcEndpoints[0].url,
							blockHash: finalizedBlockHash,
						}),
						getBlock({
							rpcUrl: polkadotMainnetRpcEndpoints[0].url,
							blockHash: finalizedBlockHash,
						}),
						getRuntimeVersion({ rpcUrl: polkadotMainnetRpcEndpoints[0].url }),
						getSystemHealth({ rpcUrl: polkadotMainnetRpcEndpoints[0].url }),
					])
					return {
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
			fields: {
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
						rpcUrl: polkadotMainnetRpcEndpoints[0].url,
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
			fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				stateRoot: (block) => block.stateRoot,
				extrinsicsRoot: (block) => block.extrinsicsRoot,
				$$extrinsics: (block) => block.$$extrinsics,
			},
		}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
					assertPolkadotMainnet(entitySelector.$network)
					return [
						{
							...polkadotMainnetRpcEndpoints[0],
						},
					]
				}
			},
		})({
			fields: {
				rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
			},
		}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
					assertPolkadotMainnet(entitySelector.$network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								timestampMs: Date.now(),
							},
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector, context) => {
					assertPolkadotMainnet(entitySelector.$network)
					const {
						getFinalizedHead,
						getHeader,
					} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotMainnetRpcEndpoints[0].url })
					const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
						rpcUrl: polkadotMainnetRpcEndpoints[0].url,
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
							$network: entitySelector.$network,
							blockNumber: finalizedBlockNumber - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: finalizedBlockHash,
							}),
						},
					}))
				}
			},
		})({
			fields: {
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
						rpcUrl: polkadotMainnetRpcEndpoints[0].url,
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
			fields: {
				$parent: (parent) => parent,
			},
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
							rpcUrl: polkadotMainnetRpcEndpoints[0].url,
							blockHash: hash,
						}),
						hash
					)
				}
			},
		})({
			fields: {
				$$extrinsics: (extrinsics) => extrinsics,
			},
		}),
	],
}
