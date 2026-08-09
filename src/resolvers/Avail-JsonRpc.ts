import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertAvailMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'avail')
		throw new Error('Avail: unsupported network')
}

export default {
	source: Source.Avail,

	resolvers: [
		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const {
							getBlockHash,
							getFinalizedHead,
							getHeader,
							getNetworkIdentity,
							getSystemHealth,
							getSystemSyncState,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const [
							identity,
							latestHash,
							finalized,
							health,
							syncState,
						] = await Promise.all([
							getNetworkIdentity(publicEnv),
							getBlockHash(publicEnv),
							getFinalizedHead(publicEnv),
							getSystemHealth(publicEnv),
							getSystemSyncState(publicEnv),
						])
						if (identity.chainName !== 'Avail DA Mainnet')
							throw new Error('Avail: foreign chain name')
						const latest = await getHeader(publicEnv, latestHash)
						const syncing = health.isSyncing || syncState.currentBlock < syncState.highestBlock
						const tipHealth = (
							health.isSyncing ?
								'syncing'
							: health.peers === 0 && health.shouldHavePeers ?
								'no-peers'
							:
								'ok'
						)
						const timestampMs = Date.now()
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.Avail,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockNumber')]: latest.blockNumber,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockHash')]: latestHash,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockNumber')]: finalized.blockNumber,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockHash')]: finalized.hash,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'syncing')]: syncing,
									[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'health')]: tipHealth,
								},
							},
						]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const {
							getBlock,
							getBlockHash,
							getHeader,
							getHeaderByBlockNumber,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const tipHash = await getBlockHash(publicEnv)
						const tip = await getHeader(publicEnv, tipHash)
						const tipNumber = tip.blockNumber
						const blockNumbers = Array.from({
							length: Math.min(Number(tipNumber + 1n), limit),
						}, (_value, blockOffset) => (
							tipNumber - BigInt(blockOffset)
						))
						return await Promise.all(
							blockNumbers.map(async (blockNumber) => {
								const header = (
									blockNumber === tipNumber && tip.hash != null ?
										{
											...tip,
											hash: tip.hash,
										}
									:
										await getHeaderByBlockNumber(publicEnv, blockNumber)
								)
								const block = await getBlock(publicEnv, header.hash)
								return {
									[EntityMetaKey.Selector]: {
										$network: {
											$network,
										},
										blockNumber,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.AvailBlock, [], 'blockHash')]: header.hash,
										[entityFieldAddressKey(EntityType.AvailBlock, [], 'parentHash')]: header.parentHash,
										[entityFieldAddressKey(EntityType.AvailBlock, [], 'stateRoot')]: header.stateRoot,
										[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicsRoot')]: header.extrinsicsRoot,
										[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicCount')]: block.extrinsicCount,
										...(blockNumber > 0n && {
											[entityFieldAddressKey(EntityType.AvailBlock, [], '$parent')]: {
												[EntityMetaKey.Selector]: {
													$network: {
														$network,
													},
													blockNumber: blockNumber - 1n,
												},
											},
										}),
									},
								}
							})
						)
					},
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertAvailMainnet($network)
						const {
							getBlockHash,
							getHeader,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const tipHash = await getBlockHash(context.publicEnv)
						const tip = await getHeader(context.publicEnv, tipHash)
						return Number(tip.blockNumber + 1n)
					},
				},
			},
		})({
			$$blocks: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.AvailNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						assertAvailMainnet($network.$network)
						if (source !== Source.Avail)
							throw new Error(`Avail: unsupported observation source ${source}`)

						const {
							getBlockHash,
							getFinalizedHead,
							getHeader,
							getNetworkIdentity,
							getSystemHealth,
							getSystemSyncState,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const [
							identity,
							latestHash,
							finalized,
							health,
							syncState,
						] = await Promise.all([
							getNetworkIdentity(publicEnv),
							getBlockHash(publicEnv),
							getFinalizedHead(publicEnv),
							getSystemHealth(publicEnv),
							getSystemSyncState(publicEnv),
						])
						const latest = await getHeader(publicEnv, latestHash)
						if (identity.chainName !== 'Avail DA Mainnet')
							throw new Error('Avail: foreign chain name')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestBlockNumber: latest.blockNumber,
							latestBlockHash: latestHash,
							finalizedBlockNumber: finalized.blockNumber,
							finalizedBlockHash: finalized.hash,
							syncing: health.isSyncing || syncState.currentBlock < syncState.highestBlock,
							health: (
								health.isSyncing ?
									'syncing'
								: health.peers === 0 && health.shouldHavePeers ?
									'no-peers'
								:
									'ok'
							),
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestBlockNumber: (timestamp) => timestamp.latestBlockNumber,
			latestBlockHash: (timestamp) => timestamp.latestBlockHash,
			finalizedBlockNumber: (timestamp) => timestamp.finalizedBlockNumber,
			finalizedBlockHash: (timestamp) => timestamp.finalizedBlockHash,
			syncing: (timestamp) => timestamp.syncing,
			health: (timestamp) => timestamp.health,
		}),

		defineResolver({
			entityType: EntityType.AvailBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
						assertAvailMainnet($network.$network)
						const {
							getBlock,
							getHeaderByBlockNumber,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const header = await getHeaderByBlockNumber(
							context.publicEnv,
							blockNumber
						)
						const block = await getBlock(
							context.publicEnv,
							header.hash
						)
						return {
							blockNumber: header.blockNumber,
							blockHash: header.hash,
							parentHash: header.parentHash,
							stateRoot: header.stateRoot,
							extrinsicsRoot: header.extrinsicsRoot,
							extrinsicCount: block.extrinsicCount,
							...(header.blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: header.blockNumber - 1n,
									},
								},
							}),
						}
					},
				},
				NetworkBlockHash: {
					resolve: async ({ $network, blockHash }, context) => {
						assertAvailMainnet($network.$network)
						const {
							getBlock,
						} = await import('$/sources/Avail/JsonRpc/queries.ts')
						const block = await getBlock(
							context.publicEnv,
							blockHash
						)
						const resolvedHash = block.hash ?? blockHash.toLowerCase()
						return {
							blockNumber: block.blockNumber,
							blockHash: resolvedHash,
							parentHash: block.parentHash,
							stateRoot: block.stateRoot,
							extrinsicsRoot: block.extrinsicsRoot,
							extrinsicCount: block.extrinsicCount,
							...(block.blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: block.blockNumber - 1n,
									},
								},
							}),
						}
					},
				},
			},
		})({
			blockNumber: (block) => block.blockNumber,
			blockHash: (block) => block.blockHash,
			parentHash: (block) => block.parentHash,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			extrinsicCount: (block) => block.extrinsicCount,
			$parent: (block) => block.$parent,
		}),
	],
} satisfies RegisteredSourceResolverModule
