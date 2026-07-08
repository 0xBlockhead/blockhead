import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { BittensorNetworkSelector } from '$/schema/BittensorNetwork.ts'
import { BittensorNetwork_TimestampSelector } from '$/schema/BittensorNetwork_Timestamp.ts'
import { BittensorBlockSelector } from '$/schema/BittensorBlock.ts'
import { BittensorSubnetSelector } from '$/schema/BittensorSubnet.ts'
import { BittensorMetagraph_TimestampSelector } from '$/schema/BittensorMetagraph_Timestamp.ts'
import { BittensorNeuronSelector } from '$/schema/BittensorNeuron.ts'

const assertBittensorMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network> & { slug: string }
) => {
	if (network.slug !== 'bittensor') {
		throw new Error('Bittensor_JsonRpc: unsupported network')
	}
}

const blockNumberFromHeader = (header: { number: string }) => BigInt(header.number)

const compactLengthFromScaleBytes = (bytes: readonly number[]) => {
	const mode = bytes[0] & 3
	return (
		mode === 0 ?
			bytes[0] >> 2
		: mode === 1 ?
			((bytes[0] + bytes[1] * 256) >> 2)
		: mode === 2 ?
			(
				bytes[0]
				+ bytes[1] * 256
				+ bytes[2] * 65536
				+ bytes[3] * 16777216
			) >> 2
		:
			undefined
	)
}

export default {
	source: Source.Bittensor_JsonRpc,

	resolvers: [
		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[BittensorNetworkSelector.Network]: async ({ $network }) => {
					assertBittensorMainnet($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
					}
				}
			}
		})({
					$network: (network) => network.$network,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork_Timestamp,
			resolve: {
				[BittensorNetwork_TimestampSelector.NetworkTimestampMsSource]: async ({ $network }) => {
					assertBittensorMainnet($network)
					const {
						getMainnetRpcUrl,
						getAllDynamicInfo,
						getAllMetagraphs,
						getFinalizedHead,
						getHeader,
						getRuntimeVersion,
						getSubnetsInfo,
						getSystemHealth,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const [
						finalizedBlockHash,
						runtimeVersion,
						systemHealth,
						subnetsInfo,
						dynamicInfo,
						metagraphs,
					] = await Promise.all([
						getFinalizedHead({ rpcUrl: getMainnetRpcUrl }),
						getRuntimeVersion({ rpcUrl: getMainnetRpcUrl }),
						getSystemHealth({ rpcUrl: getMainnetRpcUrl }),
						getSubnetsInfo({ rpcUrl: getMainnetRpcUrl }),
						getAllDynamicInfo({ rpcUrl: getMainnetRpcUrl }),
						getAllMetagraphs({ rpcUrl: getMainnetRpcUrl }),
					])
					return {
						finalizedBlockHash,
						finalizedBlockNumber: blockNumberFromHeader(await getHeader({
							rpcUrl: getMainnetRpcUrl,
							blockHash: finalizedBlockHash,
						})),
						runtimeSpecName: runtimeVersion.specName,
						runtimeSpecVersion: runtimeVersion.specVersion,
						runtimeImplVersion: runtimeVersion.implVersion,
						peerCount: systemHealth.peers,
						isSyncing: systemHealth.isSyncing,
						shouldHavePeers: systemHealth.shouldHavePeers,
						subnetCount: compactLengthFromScaleBytes(dynamicInfo),
						subnetsInfoByteLength: subnetsInfo.length,
						dynamicInfoByteLength: dynamicInfo.length,
						metagraphsByteLength: metagraphs.length,
					}
				}
			}
		})({
					finalizedBlockHash: (timestamp) => timestamp.finalizedBlockHash,
					finalizedBlockNumber: (timestamp) => timestamp.finalizedBlockNumber,
					runtimeSpecName: (timestamp) => timestamp.runtimeSpecName,
					runtimeSpecVersion: (timestamp) => timestamp.runtimeSpecVersion,
					runtimeImplVersion: (timestamp) => timestamp.runtimeImplVersion,
					peerCount: (timestamp) => timestamp.peerCount,
					isSyncing: (timestamp) => timestamp.isSyncing,
					shouldHavePeers: (timestamp) => timestamp.shouldHavePeers,
					subnetCount: (timestamp) => timestamp.subnetCount,
					subnetsInfoByteLength: (timestamp) => timestamp.subnetsInfoByteLength,
					dynamicInfoByteLength: (timestamp) => timestamp.dynamicInfoByteLength,
					metagraphsByteLength: (timestamp) => timestamp.metagraphsByteLength,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorBlock,
			resolve: {
				[BittensorBlockSelector.NetworkBlockNumberHash]: async ({ $network, blockNumber, hash: hashSelector }) => {
					assertBittensorMainnet($network)
					const {
						getMainnetRpcUrl,
						getBlock,
						getBlockHash,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const hash = hashSelector
					const block = await getBlock({
						rpcUrl: getMainnetRpcUrl,
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
						extrinsicCount: block.block.extrinsics.length,
					}
				}
			}
		})({
					hash: (block) => block.hash,
					$parent: (block) => block.$parent,
					stateRoot: (block) => block.stateRoot,
					extrinsicsRoot: (block) => block.extrinsicsRoot,
					extrinsicCount: (block) => block.extrinsicCount,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[BittensorSubnetSelector.NetworkNetuid]: async ({ $network, netuid }) => {
					assertBittensorMainnet($network)
					const {
						getMainnetRpcUrl,
						getDynamicInfo,
						getSubnetHyperparams,
						getSubnetInfo,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const [
						subnetInfo,
						dynamicInfo,
						hyperparams,
					] = await Promise.all([
						getSubnetInfo({
							rpcUrl: getMainnetRpcUrl,
							netuid: netuid,
						}),
						getDynamicInfo({
							rpcUrl: getMainnetRpcUrl,
							netuid: netuid,
						}),
						getSubnetHyperparams({
							rpcUrl: getMainnetRpcUrl,
							netuid: netuid,
						}),
					])
					return {
						netuid: netuid,
						subnetInfoByteLength: subnetInfo.length,
						dynamicInfoByteLength: dynamicInfo.length,
						hyperparamsByteLength: hyperparams.length,
					}
				}
			}
		})({
					netuid: (subnet) => subnet.netuid,
					subnetInfoByteLength: (subnet) => subnet.subnetInfoByteLength,
					dynamicInfoByteLength: (subnet) => subnet.dynamicInfoByteLength,
					hyperparamsByteLength: (subnet) => subnet.hyperparamsByteLength,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorMetagraph_Timestamp,
			resolve: {
				[BittensorMetagraph_TimestampSelector.SubnetTimestampMsSource]: async ({ $subnet }) => {
					assertBittensorMainnet($subnet.$network)
					const {
						getMainnetRpcUrl,
						getMetagraph,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					return {
						metagraphByteLength: (await getMetagraph({
							rpcUrl: getMainnetRpcUrl,
							netuid: $subnet.netuid,
						})).length,
					}
				}
			}
		})({
					metagraphByteLength: (timestamp) => timestamp.metagraphByteLength,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNeuron,
			resolve: {
				[BittensorNeuronSelector.BittensorSubnetUid]: async ({ $subnet, uid }) => {
					assertBittensorMainnet($subnet.$network)
					return {
						uid: uid,
					}
				}
			}
		})({
					uid: (neuron) => neuron.uid,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertBittensorMainnet(network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.Bittensor_JsonRpc,
							},
						},
					]
				}
			}
		})({
					Bittensor: {
						$$timestamps: (timestamps) => timestamps,
					},
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[BittensorNetworkSelector.Network]: async ({ $network }) => {
					assertBittensorMainnet($network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: $network,
								timestampMs: Date.now(),
								source: Source.Bittensor_JsonRpc,
							},
						},
					]
				}
			}
		})({
					$$timestamps: (timestamps) => timestamps,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertBittensorMainnet(network)
					const {
						getMainnetRpcUrl,
						getFinalizedHead,
						getHeader,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({
						rpcUrl: getMainnetRpcUrl,
					})
					const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
						rpcUrl: getMainnetRpcUrl,
						blockHash: finalizedBlockHash,
					}))
					return Array.from({
						length: Math.min(
							1,
							Number(finalizedBlockNumber + 1n),
							resolverContextRowLimit(context)
						),
					}, () => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							blockNumber: finalizedBlockNumber,
							hash: finalizedBlockHash,
						},
					}))
				}
			}
		})({
					Bittensor: {
						$$blocks: (blocks) => blocks,
					},
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[BittensorNetworkSelector.Network]: async ({ $network }, context) => {
					assertBittensorMainnet($network)
					const {
						getMainnetRpcUrl,
						getFinalizedHead,
						getHeader,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const finalizedBlockHash = await getFinalizedHead({
						rpcUrl: getMainnetRpcUrl,
					})
					const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
						rpcUrl: getMainnetRpcUrl,
						blockHash: finalizedBlockHash,
					}))
					return Array.from({
						length: Math.min(
							1,
							Number(finalizedBlockNumber + 1n),
							resolverContextRowLimit(context)
						),
					}, () => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							blockNumber: finalizedBlockNumber,
							hash: finalizedBlockHash,
						},
					}))
				}
			}
		})({
					$$blocks: (blocks) => blocks,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertBittensorMainnet(network)
					const {
						getMainnetRpcUrl,
						getAllDynamicInfo,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					return Array.from({
						length: compactLengthFromScaleBytes(await getAllDynamicInfo({
							rpcUrl: getMainnetRpcUrl,
						})) ?? 0,
					}, (_value, netuid) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							netuid,
						},
					}))
				}
			}
		})({
					Bittensor: {
						$$subnets: (subnets) => subnets,
					},
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[BittensorNetworkSelector.Network]: async ({ $network }) => {
					assertBittensorMainnet($network)
					const {
						getMainnetRpcUrl,
						getAllDynamicInfo,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					return Array.from({
						length: compactLengthFromScaleBytes(await getAllDynamicInfo({
							rpcUrl: getMainnetRpcUrl,
						})) ?? 0,
					}, (_value, netuid) => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							netuid,
						},
					}))
				}
			}
		})({
					$$subnets: (subnets) => subnets,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[BittensorSubnetSelector.NetworkNetuid]: async (entitySelector) => {
					assertBittensorMainnet(entitySelector.$network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$subnet: entitySelector,
								timestampMs: Date.now(),
								source: Source.Bittensor_JsonRpc,
							},
						},
					]
				}
			}
		})({
					$$metagraphTimestamps: (timestamps) => timestamps,
				}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[BittensorSubnetSelector.NetworkNetuid]: async ({ $network }) => {
					assertBittensorMainnet($network)
					return []
				}
			}
		})({
					$$neurons: (neurons) => neurons,
				}),
	],
}
