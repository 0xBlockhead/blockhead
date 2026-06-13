import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntityId<typeof schema, EntityType.Network>

const assertBittensorMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'bittensor') {
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
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId)
					return {
						$network: {
							[EntityMetaKey.Id]: entityId,
						},
					}
				}
			}
		})({
				fields: {
					$network: (network) => network.$network,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$network)
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
				fields: {
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
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$network)
					const {
						getMainnetRpcUrl,
						getBlock,
						getBlockHash,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					const hash = entityId.hash ?? await getBlockHash({
						rpcUrl: getMainnetRpcUrl,
						blockNumber: entityId.blockNumber,
					})
					const block = await getBlock({
						rpcUrl: getMainnetRpcUrl,
						blockHash: hash,
					})
					return {
						hash,
						...(entityId.blockNumber > 0n && {
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
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
				fields: {
					hash: (block) => block.hash,
					$parent: (block) => block.$parent,
					stateRoot: (block) => block.stateRoot,
					extrinsicsRoot: (block) => block.extrinsicsRoot,
					extrinsicCount: (block) => block.extrinsicCount,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$network)
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
							netuid: entityId.netuid,
						}),
						getDynamicInfo({
							rpcUrl: getMainnetRpcUrl,
							netuid: entityId.netuid,
						}),
						getSubnetHyperparams({
							rpcUrl: getMainnetRpcUrl,
							netuid: entityId.netuid,
						}),
					])
					return {
						netuid: entityId.netuid,
						subnetInfoByteLength: subnetInfo.length,
						dynamicInfoByteLength: dynamicInfo.length,
						hyperparamsByteLength: hyperparams.length,
					}
				}
			}
		})({
				fields: {
					netuid: (subnet) => subnet.netuid,
					subnetInfoByteLength: (subnet) => subnet.subnetInfoByteLength,
					dynamicInfoByteLength: (subnet) => subnet.dynamicInfoByteLength,
					hyperparamsByteLength: (subnet) => subnet.hyperparamsByteLength,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorMetagraph_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$subnet.$network)
					const {
						getMainnetRpcUrl,
						getMetagraph,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					return {
						metagraphByteLength: (await getMetagraph({
							rpcUrl: getMainnetRpcUrl,
							netuid: entityId.$subnet.netuid,
						})).length,
					}
				}
			}
		})({
				fields: {
					metagraphByteLength: (timestamp) => timestamp.metagraphByteLength,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNeuron,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$subnet.$network)
					return {
						uid: entityId.uid,
					}
				}
			}
		})({
				fields: {
					uid: (neuron) => neuron.uid,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId)
					return [
						{
							[EntityMetaKey.Id]: {
								$network: entityId,
								timestampMs: Date.now(),
							},
						},
					]
				}
			}
		})({
				fields: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
					assertBittensorMainnet(entityId)
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
							Number(finalizedBlockNumber + 1n),
							resolverContextRowLimit(context),
						),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							blockNumber: finalizedBlockNumber - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: finalizedBlockHash,
							}),
						},
					}))
				}
			}
		})({
				fields: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId)
					const {
						getMainnetRpcUrl,
						getAllDynamicInfo,
					} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
					return Array.from({
						length: compactLengthFromScaleBytes(await getAllDynamicInfo({
							rpcUrl: getMainnetRpcUrl,
						})) ?? 0,
					}, (_value, netuid) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							netuid,
						},
					}))
				}
			}
		})({
				fields: {
					$$subnets: (subnets) => subnets,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$network)
					return [
						{
							[EntityMetaKey.Id]: {
								$subnet: entityId,
								timestampMs: Date.now(),
							},
						},
					]
				}
			}
		})({
				fields: {
					$$metagraphTimestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver(Source.Bittensor_JsonRpc, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertBittensorMainnet(entityId.$network)
					return []
				}
			}
		})({
				fields: {
					$$neurons: (neurons) => neurons,
				},
			}),
	],
}
