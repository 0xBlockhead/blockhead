import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	polkadotMainnetCaip2,
	polkadotMainnetRpcUrl,
} from '$/constants/PolkadotNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== polkadotMainnetCaip2.namespace
		|| network.caip2.reference !== polkadotMainnetCaip2.reference
	) {
		throw new Error('Polkadot_JsonRpc: unsupported network')
	}
}

const blockNumberFromHeader = (header: { number: string }) => BigInt(header.number)

const polkadotExtrinsicRows = (
	network: NetworkId,
	block: PolkadotRpcBlock,
) => (
	block.block.extrinsics.map((_extrinsic, extrinsicIndex) => ({
		[EntityMetaKey.Id]: {
			$block: {
				$network: network,
				blockNumber: blockNumberFromHeader(block.block.header),
			},
			extrinsicIndex,
		},
	}))
)

export default {
	source: Source.Polkadot_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.PolkadotNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					rpcEndpoints: [
						{
							url: polkadotMainnetRpcUrl,
							transportType: TransportType.Http,
							providerName: 'Parity',
						},
					],
				}
			},
			fields: {
			$network: (network) => network.$network,
			rpcEndpoints: (network) => network.rpcEndpoints,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotNetwork_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getFinalizedHead,
					getHeader,
					getRuntimeVersion,
					getSystemHealth,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotMainnetRpcUrl })
				const [
					header,
					block,
					runtimeVersion,
					systemHealth,
				] = await Promise.all([
					getHeader({
						rpcUrl: polkadotMainnetRpcUrl,
						blockHash: finalizedBlockHash,
					}),
					getBlock({
						rpcUrl: polkadotMainnetRpcUrl,
						blockHash: finalizedBlockHash,
					}),
					getRuntimeVersion({ rpcUrl: polkadotMainnetRpcUrl }),
					getSystemHealth({ rpcUrl: polkadotMainnetRpcUrl }),
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
			},
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
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const hash = entityId.hash ?? await getBlockHash({
					rpcUrl: polkadotMainnetRpcUrl,
					blockNumber: entityId.blockNumber,
				})
				const block = await getBlock({
					rpcUrl: polkadotMainnetRpcUrl,
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
					$$extrinsics: polkadotExtrinsicRows(
						entityId.$network,
						block,
					),
				}
			},
			fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			$$extrinsics: (block) => block.$$extrinsics,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotMainnetRpcUrl,
					blockHash: entityId.$block.hash ?? await getBlockHash({
						rpcUrl: polkadotMainnetRpcUrl,
						blockNumber: entityId.$block.blockNumber,
					}),
				})
				if (block.block.extrinsics.at(entityId.extrinsicIndex) == null) {
					throw new Error(`Polkadot_JsonRpc: extrinsic not found for ${entityId.$block.blockNumber.toString()}:${entityId.extrinsicIndex}`)
				}
				return {}
			},
			fields: {}
		}),

		defineResolver({
			entityType: EntityType.PolkadotNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId)
				return [
					{
						url: polkadotMainnetRpcUrl,
						transportType: TransportType.Http,
						providerName: 'Parity',
					},
				]
			},
			fields: {
			rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
			fields: {
			$$timestamps: (timestamps) => timestamps,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				assertPolkadotMainnet(entityId)
				const {
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotMainnetRpcUrl })
				const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
					rpcUrl: polkadotMainnetRpcUrl,
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
			},
			fields: {
			$$blocks: (blocks) => blocks,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				if (entityId.blockNumber === 0n) throw new Error('Polkadot_JsonRpc: genesis block has no parent')
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotMainnetRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: polkadotMainnetRpcUrl,
						blockNumber: entityId.blockNumber,
					}),
				})
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						blockNumber: blockNumberFromHeader(block.block.header) - 1n,
						hash: block.block.header.parentHash,
					},
				}
			},
			fields: {
			$parent: (parent) => parent,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				return polkadotExtrinsicRows(
					entityId.$network,
					await getBlock({
						rpcUrl: polkadotMainnetRpcUrl,
						blockHash: entityId.hash ?? await getBlockHash({
							rpcUrl: polkadotMainnetRpcUrl,
							blockNumber: entityId.blockNumber,
						}),
					}),
				)
			},
			fields: {
			$$extrinsics: (extrinsics) => extrinsics,
		}
		}),
	],
}
