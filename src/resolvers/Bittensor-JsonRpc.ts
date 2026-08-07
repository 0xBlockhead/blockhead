import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const assertBittensorMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (!('slug' in network) || network.slug !== 'bittensor')
		throw new Error('Bittensor_JsonRpc: unsupported network')
}

const blockNumberFromHeader = (header: { number: string }) => BigInt(header.number)

/** SCALE compact length prefix for `Vec<_>` payloads such as `getAllDynamicInfo` / `getNeuronsLite`. */
const compactLengthFromScaleBytes = (bytes: readonly number[]) => {
	if (bytes.length === 0)
		return undefined
	const mode = bytes[0] & 3
	return (
		mode === 0 ?
			bytes[0] >> 2
		: mode === 1 ?
			bytes.length < 2 ?
				undefined
			:
				((bytes[0] + bytes[1] * 256) >> 2)
		: mode === 2 ?
			bytes.length < 4 ?
				undefined
			:
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
		defineResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertBittensorMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
						}
					},
				}
			}
		})({
					$network: (network) => network.$network,
				}),

		defineResolver({
			entityType: EntityType.BittensorNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network }) => {
						assertBittensorMainnet($network)
						const {
							getAllDynamicInfo,
							getAllMetagraphs,
							getFinalizedHead,
							getHeader,
							getRuntimeVersion,
							getSubnetsInfo,
							getSystemHealth,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const [
							runtimeVersion,
							systemHealth,
							subnetsInfo,
							dynamicInfo,
							metagraphs,
						] = await Promise.all([
							getRuntimeVersion(),
							getSystemHealth(),
							getSubnetsInfo({
								blockHash: finalizedBlockHash,
							}),
							getAllDynamicInfo({
								blockHash: finalizedBlockHash,
							}),
							getAllMetagraphs({
								blockHash: finalizedBlockHash,
							}),
						])
						return {
							finalizedBlockHash,
							finalizedBlockNumber: blockNumberFromHeader(await getHeader({
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

		defineResolver({
			entityType: EntityType.BittensorBlock,
			resolve: {
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber, hash: hashSelector }) => {
						assertBittensorMainnet($network)
						const {
							getBlock,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const hash = hashSelector
						const block = await getBlock({
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
					},
				}
			}
		})({
					hash: (block) => block.hash,
					$parent: (block) => block.$parent,
					stateRoot: (block) => block.stateRoot,
					extrinsicsRoot: (block) => block.extrinsicsRoot,
					extrinsicCount: (block) => block.extrinsicCount,
				}),

		defineResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: {
				NetworkNetuid: {
					resolve: async ({ $network, netuid }) => {
						assertBittensorMainnet($network)
						const {
							getDynamicInfo,
							getFinalizedHead,
							getSubnetHyperparams,
							getSubnetInfo,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const [
							subnetInfo,
							dynamicInfo,
							hyperparams,
						] = await Promise.all([
							getSubnetInfo({
								netuid,
								blockHash: finalizedBlockHash,
							}),
							getDynamicInfo({
								netuid,
								blockHash: finalizedBlockHash,
							}),
							getSubnetHyperparams({
								netuid,
								blockHash: finalizedBlockHash,
							}),
						])
						return {
							netuid,
							subnetInfoByteLength: subnetInfo.length,
							dynamicInfoByteLength: dynamicInfo.length,
							hyperparamsByteLength: hyperparams.length,
						}
					},
				}
			}
		})({
					netuid: (subnet) => subnet.netuid,
					subnetInfoByteLength: (subnet) => subnet.subnetInfoByteLength,
					dynamicInfoByteLength: (subnet) => subnet.dynamicInfoByteLength,
					hyperparamsByteLength: (subnet) => subnet.hyperparamsByteLength,
				}),

		defineResolver({
			entityType: EntityType.BittensorMetagraph_Timestamp,
			resolve: {
				SubnetTimestampMsSource: {
					resolve: async ({ $subnet }) => {
						assertBittensorMainnet($subnet.$network)
						const {
							getFinalizedHead,
							getMetagraph,
							getNeuronsLite,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const [
							metagraph,
							neuronsLite,
						] = await Promise.all([
							getMetagraph({
								netuid: $subnet.netuid,
								blockHash: finalizedBlockHash,
							}),
							getNeuronsLite({
								netuid: $subnet.netuid,
								blockHash: finalizedBlockHash,
							}),
						])
						return {
							metagraphByteLength: metagraph.length,
							neuronCount: compactLengthFromScaleBytes(neuronsLite),
						}
					},
				}
			}
		})({
					metagraphByteLength: (timestamp) => timestamp.metagraphByteLength,
					neuronCount: (timestamp) => timestamp.neuronCount,
				}),

		defineResolver({
			entityType: EntityType.BittensorNeuron,
			resolve: {
				BittensorSubnetUid: {
					resolve: async ({ $subnet, uid }) => {
						assertBittensorMainnet($subnet.$network)
						const {
							getFinalizedHead,
							getNeuronLite,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						await getNeuronLite({
							netuid: $subnet.netuid,
							uid,
							blockHash: finalizedBlockHash,
						})
						return {
							uid,
						}
					},
				}
			}
		})({
					uid: (neuron) => neuron.uid,
				}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
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
					},
				}
			}
		})({
					Bittensor: {
						$$timestamps: (timestamps) => timestamps,
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
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
					},
				}
			}
		})({
					$$timestamps: (timestamps) => timestamps,
				}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertBittensorMainnet(network)
						const {
							getFinalizedHead,
							getHeader,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
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
					},
				}
			}
		})({
					Bittensor: {
						$$blocks: (blocks) => blocks,
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertBittensorMainnet($network)
						const {
							getFinalizedHead,
							getHeader,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
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
					},
				}
			}
		})({
					$$blocks: (blocks) => blocks,
				}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertBittensorMainnet(network)
						const {
							getAllDynamicInfo,
							getFinalizedHead,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const subnetCount = compactLengthFromScaleBytes(await getAllDynamicInfo({
							blockHash: finalizedBlockHash,
						})) ?? 0
						return {
							subnets: Array.from({
								length: Math.min(
									subnetCount,
									resolverContextRowLimit(context)
								),
							}, (_value, netuid) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									netuid,
								},
							})),
							subnetCount,
						}
					},
				}
			}
		})({
					Bittensor: {
						$$subnets: {
							select: (snapshot) => snapshot.subnets,
							resolveCount: (snapshot) => snapshot.subnetCount,
						},
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertBittensorMainnet($network)
						const {
							getAllDynamicInfo,
							getFinalizedHead,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const subnetCount = compactLengthFromScaleBytes(await getAllDynamicInfo({
							blockHash: finalizedBlockHash,
						})) ?? 0
						return {
							subnets: Array.from({
								length: Math.min(
									subnetCount,
									resolverContextRowLimit(context)
								),
							}, (_value, netuid) => ({
								[EntityMetaKey.Selector]: {
									$network: $network,
									netuid,
								},
							})),
							subnetCount,
						}
					},
				}
			}
		})({
					$$subnets: {
						select: (snapshot) => snapshot.subnets,
						resolveCount: (snapshot) => snapshot.subnetCount,
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: {
				NetworkNetuid: {
					resolve: async (entitySelector) => {
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
					},
				}
			}
		})({
					$$metagraphTimestamps: {
						select: (timestamps) => timestamps,
						resolveCount: (timestamps) => timestamps.length,
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: {
				NetworkNetuid: {
					resolve: async (entitySelector, context) => {
						assertBittensorMainnet(entitySelector.$network)
						const {
							getFinalizedHead,
							getNeuronsLite,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const neuronCount = compactLengthFromScaleBytes(await getNeuronsLite({
							netuid: entitySelector.netuid,
							blockHash: finalizedBlockHash,
						})) ?? 0
						return {
							neurons: Array.from({
								length: Math.min(
									neuronCount,
									resolverContextRowLimit(context)
								),
							}, (_value, uid) => ({
								[EntityMetaKey.Selector]: {
									$subnet: entitySelector,
									uid,
								},
							})),
							neuronCount,
						}
					},
				}
			}
		})({
					$$neurons: {
						select: (snapshot) => snapshot.neurons,
						resolveCount: (snapshot) => snapshot.neuronCount,
					},
				}),
	],
} satisfies RegisteredSourceResolverModule
