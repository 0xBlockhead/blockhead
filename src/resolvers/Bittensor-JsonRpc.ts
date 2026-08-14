import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
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

const bittensorNetworkTimestampEntityFields = (
	snapshot: {
		finalizedBlockHash: string
		finalizedBlockNumber: bigint
		runtimeSpecName: string
		runtimeSpecVersion: number
		runtimeImplVersion: number
		peerCount: number
		isSyncing: boolean
		shouldHavePeers: boolean
		subnetCount: number | undefined
		subnetsInfoByteLength: number
		dynamicInfoByteLength: number
		metagraphsByteLength: number
	}
) => ({
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'finalizedBlockHash')]: snapshot.finalizedBlockHash,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'finalizedBlockNumber')]: snapshot.finalizedBlockNumber,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeSpecName')]: snapshot.runtimeSpecName,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeSpecVersion')]: snapshot.runtimeSpecVersion,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeImplVersion')]: snapshot.runtimeImplVersion,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'peerCount')]: snapshot.peerCount,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'isSyncing')]: snapshot.isSyncing,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'shouldHavePeers')]: snapshot.shouldHavePeers,
	...(snapshot.subnetCount != null && {
		[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'subnetCount')]: snapshot.subnetCount,
	}),
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'subnetsInfoByteLength')]: snapshot.subnetsInfoByteLength,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'dynamicInfoByteLength')]: snapshot.dynamicInfoByteLength,
	[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'metagraphsByteLength')]: snapshot.metagraphsByteLength,
})

const bittensorNetworkTimestampRefs = async (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
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
	const timestampMs = Date.now()
	const fields = bittensorNetworkTimestampEntityFields({
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
	})
	return [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs,
			source: Source.Bittensor_JsonRpc,
		},
		[EntityMetaKey.Fields]: fields,
	}]
}

const bittensorMetagraphTimestampEntityFields = (
	metagraphByteLength: number,
	neuronsLite: readonly number[]
) => ({
	[entityFieldAddressKey(EntityType.BittensorMetagraph_Timestamp, [], 'metagraphByteLength')]: metagraphByteLength,
	...(compactLengthFromScaleBytes(neuronsLite) != null && {
		[entityFieldAddressKey(EntityType.BittensorMetagraph_Timestamp, [], 'neuronCount')]: compactLengthFromScaleBytes(neuronsLite),
	}),
})

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
					resolve: async (entitySelector) => {
						assertBittensorMainnet(entitySelector.$network)
						const {
							getDynamicInfo,
							getFinalizedHead,
							getMetagraph,
							getNeuronsLite,
							getSubnetHyperparams,
							getSubnetInfo,
						} = await import('$/sources/Bittensor/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const [
							subnetInfo,
							dynamicInfo,
							hyperparams,
							metagraph,
							neuronsLite,
						] = await Promise.all([
							getSubnetInfo({
								netuid: entitySelector.netuid,
								blockHash: finalizedBlockHash,
							}),
							getDynamicInfo({
								netuid: entitySelector.netuid,
								blockHash: finalizedBlockHash,
							}),
							getSubnetHyperparams({
								netuid: entitySelector.netuid,
								blockHash: finalizedBlockHash,
							}),
							getMetagraph({
								netuid: entitySelector.netuid,
								blockHash: finalizedBlockHash,
							}),
							getNeuronsLite({
								netuid: entitySelector.netuid,
								blockHash: finalizedBlockHash,
							}),
						])
						const timestampMs = Date.now()
						return {
							netuid: entitySelector.netuid,
							subnetInfoByteLength: subnetInfo.length,
							dynamicInfoByteLength: dynamicInfo.length,
							hyperparamsByteLength: hyperparams.length,
							$$metagraphTimestamps: [{
								[EntityMetaKey.Selector]: {
									$subnet: entitySelector,
									timestampMs,
									source: Source.Bittensor_JsonRpc,
								},
								[EntityMetaKey.Fields]: bittensorMetagraphTimestampEntityFields(
									metagraph.length,
									neuronsLite
								),
							}],
						}
					},
				}
			}
		})({
					netuid: (subnet) => subnet.netuid,
					subnetInfoByteLength: (subnet) => subnet.subnetInfoByteLength,
					dynamicInfoByteLength: (subnet) => subnet.dynamicInfoByteLength,
					hyperparamsByteLength: (subnet) => subnet.hyperparamsByteLength,
					$$metagraphTimestamps: {
						select: (snapshot) => snapshot.$$metagraphTimestamps,
						resolveCount: (snapshot) => snapshot.$$metagraphTimestamps.length,
					},
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
						return {
							timestamps: await bittensorNetworkTimestampRefs(network),
						}
					},
				}
			}
		})({
					Bittensor: {
						$$timestamps: (snapshot) => snapshot.timestamps,
					},
				}),

		defineResolver({
			entityType: EntityType.BittensorNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertBittensorMainnet($network)
						return {
							timestamps: await bittensorNetworkTimestampRefs($network),
						}
					},
				}
			}
		})({
					$$timestamps: (snapshot) => snapshot.timestamps,
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
