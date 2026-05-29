import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'

const polkadotRpcUrl = 'https://rpc.polkadot.io'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'polkadot' || network.caip2.reference !== '91b171bb158e2d3848fa23a9f1c25182') {
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.PolkadotNetwork,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId)
				const {
					getBlock,
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotRpcUrl })
				const header = await getHeader({
					rpcUrl: polkadotRpcUrl,
					blockHash: finalizedBlockHash,
				})
				const finalizedBlockNumber = blockNumberFromHeader(header)
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: finalizedBlockHash,
				})
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					rpcEndpoints: [
						{
							url: polkadotRpcUrl,
							transportType: TransportType.Http,
							providerName: 'Parity',
						},
					],
					$headBlock: {
						[EntityMetaKey.Id]: {
							$network: entityId,
							blockNumber: finalizedBlockNumber,
							hash: finalizedBlockHash,
						},
						hash: finalizedBlockHash,
						stateRoot: header.stateRoot,
						extrinsicsRoot: header.extrinsicsRoot,
						$$extrinsics: polkadotExtrinsicRows(
							entityId,
							block,
						),
					},
					$$timestamps: [
						{
							[EntityMetaKey.Id]: {
								$network: entityId,
								timestampMs: Date.now(),
							},
						},
					],
					$$blocks: [
						{
							[EntityMetaKey.Id]: {
								$network: entityId,
								blockNumber: finalizedBlockNumber,
								hash: finalizedBlockHash,
							},
							hash: finalizedBlockHash,
							stateRoot: header.stateRoot,
							extrinsicsRoot: header.extrinsicsRoot,
							$$extrinsics: polkadotExtrinsicRows(
								entityId,
								block,
							),
						},
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotNetwork_Timestamp,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getFinalizedHead,
					getHeader,
					getRuntimeVersion,
					getSystemHealth,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotRpcUrl })
				const [
					header,
					block,
					runtimeVersion,
					systemHealth,
				] = await Promise.all([
					getHeader({
						rpcUrl: polkadotRpcUrl,
						blockHash: finalizedBlockHash,
					}),
					getBlock({
						rpcUrl: polkadotRpcUrl,
						blockHash: finalizedBlockHash,
					}),
					getRuntimeVersion({ rpcUrl: polkadotRpcUrl }),
					getSystemHealth({ rpcUrl: polkadotRpcUrl }),
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
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const hash = entityId.hash ?? await getBlockHash({
					rpcUrl: polkadotRpcUrl,
					blockNumber: entityId.blockNumber,
				})
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
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
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: entityId.$block.hash ?? await getBlockHash({
						rpcUrl: polkadotRpcUrl,
						blockNumber: entityId.$block.blockNumber,
					}),
				})
				if (block.block.extrinsics[entityId.extrinsicIndex] == null) {
					throw new Error(`Polkadot_JsonRpc: extrinsic not found for ${entityId.$block.blockNumber.toString()}:${entityId.extrinsicIndex}`)
				}
				return {}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.PolkadotNetwork,
			fieldName: 'rpcEndpoints',
			resolve: async (entityId: EntityId<typeof schema, EntityType.PolkadotNetwork>) => {
				assertPolkadotMainnet(entityId)
				return [
					{
						url: polkadotRpcUrl,
						transportType: TransportType.Http,
						providerName: 'Parity',
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotNetwork,
			fieldName: '$headBlock',
			resolve: async (entityId: EntityId<typeof schema, EntityType.PolkadotNetwork>) => {
				assertPolkadotMainnet(entityId)
				const {
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotRpcUrl })
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						blockNumber: blockNumberFromHeader(await getHeader({
							rpcUrl: polkadotRpcUrl,
							blockHash: finalizedBlockHash,
						})),
						hash: finalizedBlockHash,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.PolkadotNetwork>) => {
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId: EntityId<typeof schema, EntityType.PolkadotNetwork>, context) => {
				assertPolkadotMainnet(entityId)
				const {
					getFinalizedHead,
					getHeader,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const finalizedBlockHash = await getFinalizedHead({ rpcUrl: polkadotRpcUrl })
				const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
					rpcUrl: polkadotRpcUrl,
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
			entityType: EntityType.PolkadotBlock,
			fieldName: '$parent',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				if (entityId.blockNumber === 0n) throw new Error('Polkadot_JsonRpc: genesis block has no parent')
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: polkadotRpcUrl,
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$$extrinsics',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				return polkadotExtrinsicRows(
					entityId.$network,
					await getBlock({
						rpcUrl: polkadotRpcUrl,
						blockHash: entityId.hash ?? await getBlockHash({
							rpcUrl: polkadotRpcUrl,
							blockNumber: entityId.blockNumber,
						}),
					}),
				)
			},
		}),
	],
}
