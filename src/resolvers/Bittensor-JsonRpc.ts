import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'

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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorNetwork_Timestamp,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId.$network)
				const {
					bittensorMainnetRpcUrl,
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
					getFinalizedHead({ rpcUrl: bittensorMainnetRpcUrl }),
					getRuntimeVersion({ rpcUrl: bittensorMainnetRpcUrl }),
					getSystemHealth({ rpcUrl: bittensorMainnetRpcUrl }),
					getSubnetsInfo({ rpcUrl: bittensorMainnetRpcUrl }),
					getAllDynamicInfo({ rpcUrl: bittensorMainnetRpcUrl }),
					getAllMetagraphs({ rpcUrl: bittensorMainnetRpcUrl }),
				])
				return {
					finalizedBlockHash,
					finalizedBlockNumber: blockNumberFromHeader(await getHeader({
						rpcUrl: bittensorMainnetRpcUrl,
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorBlock,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId.$network)
				const {
					bittensorMainnetRpcUrl,
					getBlock,
					getBlockHash,
				} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
				const hash = entityId.hash ?? await getBlockHash({
					rpcUrl: bittensorMainnetRpcUrl,
					blockNumber: entityId.blockNumber,
				})
				const block = await getBlock({
					rpcUrl: bittensorMainnetRpcUrl,
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId.$network)
				const {
					bittensorMainnetRpcUrl,
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
						rpcUrl: bittensorMainnetRpcUrl,
						netuid: entityId.netuid,
					}),
					getDynamicInfo({
						rpcUrl: bittensorMainnetRpcUrl,
						netuid: entityId.netuid,
					}),
					getSubnetHyperparams({
						rpcUrl: bittensorMainnetRpcUrl,
						netuid: entityId.netuid,
					}),
				])
				return {
					netuid: entityId.netuid,
					subnetInfoByteLength: subnetInfo.length,
					dynamicInfoByteLength: dynamicInfo.length,
					hyperparamsByteLength: hyperparams.length,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorMetagraph_Timestamp,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId.$subnet.$network)
				const {
					bittensorMainnetRpcUrl,
					getMetagraph,
				} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
				return {
					metagraphByteLength: (await getMetagraph({
						rpcUrl: bittensorMainnetRpcUrl,
						netuid: entityId.$subnet.netuid,
					})).length,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorNeuron,
			resolve: async (entityId) => {
				assertBittensorMainnet(entityId.$subnet.$network)
				return {
					uid: entityId.uid,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.BittensorNetwork,
			fieldName: '$headBlock',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorNetwork>) => {
				assertBittensorMainnet(entityId)
				const {
					bittensorMainnetRpcUrl,
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({
					rpcUrl: bittensorMainnetRpcUrl,
				})
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						blockNumber: blockNumberFromHeader(await getHeader({
							rpcUrl: bittensorMainnetRpcUrl,
							blockHash: finalizedBlockHash,
						})),
						hash: finalizedBlockHash,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BittensorNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorNetwork>) => {
				assertBittensorMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BittensorNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorNetwork>, context) => {
				assertBittensorMainnet(entityId)
				const {
					bittensorMainnetRpcUrl,
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({
					rpcUrl: bittensorMainnetRpcUrl,
				})
				const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
					rpcUrl: bittensorMainnetRpcUrl,
					blockHash: finalizedBlockHash,
				}))
				return Array.from({
					length: Math.min(
						Number(finalizedBlockNumber + 1n),
						resolverLoadSubsetRowLimit(context),
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BittensorNetwork,
			fieldName: '$$subnets',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorNetwork>) => {
				assertBittensorMainnet(entityId)
				const {
					bittensorMainnetRpcUrl,
					getAllDynamicInfo,
				} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
				return Array.from({
					length: compactLengthFromScaleBytes(await getAllDynamicInfo({
						rpcUrl: bittensorMainnetRpcUrl,
					})) ?? 0,
				}, (_value, netuid) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						netuid,
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BittensorSubnet,
			fieldName: '$$metagraphTimestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorSubnet>) => {
				assertBittensorMainnet(entityId.$network)
				return [
					{
						[EntityMetaKey.Id]: {
							$subnet: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.BittensorSubnet,
			fieldName: '$$neurons',
			resolve: async (entityId: EntityId<typeof schema, EntityType.BittensorSubnet>) => {
				assertBittensorMainnet(entityId.$network)
				return []
			},
		}),
	],
}
