import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'
import { Blake2 } from '@tevm/voltaire/Blake2'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

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

const extrinsicHashHex = (
	extrinsicHex: string
) => {
	const body = (
		extrinsicHex.startsWith('0x') || extrinsicHex.startsWith('0X') ?
			extrinsicHex.slice(2)
		:
			extrinsicHex
	)
	if (body.length === 0 || body.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(body))
		throw new Error('Polkadot_JsonRpc: malformed extrinsic hex')

	const digest = Blake2.hash(
		Uint8Array.from(
			{
				length: body.length / 2,
			},
			(_value, index) => (
				Number.parseInt(body.slice(index * 2, index * 2 + 2), 16)
			)
		),
		32
	)
	return `0x${[...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

const polkadotExtrinsicRows = (
	network: NetworkId,
	block: PolkadotRpcBlock,
	hash: string
) => (
	block.block.extrinsics.map((extrinsic, extrinsicIndex) => ({
		[EntityMetaKey.Selector]: {
			$block: {
				$network: network,
				blockNumber: blockNumberFromHeader(block.block.header),
				hash,
			},
			indexInBlock: extrinsicIndex,
		},
		hash: extrinsicHashHex(extrinsic),
	}))
)

export default {
	source: Source.Polkadot_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertPolkadotMainnet(network)
						return (await import('$/sources/Polkadot/JsonRpc/queries.ts')).rpcEndpoints
					},
				}
			},
		})({
				Polkadot: {
					rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
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
						const finalizedBlockHash = await getFinalizedHead()
						const [
							header,
						block,
						runtimeVersion,
						systemHealth,
						] = await Promise.all([
							getHeader({
								blockHash: finalizedBlockHash,
							}),
							getBlock({
								blockHash: finalizedBlockHash,
							}),
							getRuntimeVersion(),
							getSystemHealth(),
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
					},
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

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						assertPolkadotMainnet($network)
						const {
							getBlock,
							getBlockHash,
						} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
						const hash = await getBlockHash({
							blockNumber,
						})
						const block = await getBlock({
							blockHash: hash,
						})
						if (blockNumberFromHeader(block.block.header) !== blockNumber)
							throw new Error(`Polkadot_JsonRpc: block number mismatch for ${blockNumber}`)

						return {
							hash,
							...(blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber: blockNumber - 1n,
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
					},
				},
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber, hash: hashSelector }) => {
						assertPolkadotMainnet($network)
						const {
							getBlock,
						} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
						const hash = hashSelector
						const block = await getBlock({
							blockHash: hash,
						})
						if (blockNumberFromHeader(block.block.header) !== blockNumber)
							throw new Error(`Polkadot_JsonRpc: block number mismatch for ${hash}`)

						return {
							hash,
							...(blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber: blockNumber - 1n,
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
					},
				},
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				stateRoot: (block) => block.stateRoot,
				extrinsicsRoot: (block) => block.extrinsicsRoot,
				$$extrinsics: {
					select: (block) => block.$$extrinsics.map((extrinsic) => ({
						[EntityMetaKey.Selector]: extrinsic[EntityMetaKey.Selector],
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: extrinsic.hash,
						},
					})),
					resolveCount: (block) => block.$$extrinsics.length,
				},
			}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				BlockIndexInBlock: {
					resolve: async ({ $block, indexInBlock }) => {
						assertPolkadotMainnet($block.$network)
						const {
							getBlock,
							getBlockHash,
						} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
						const hash = $block.hash ?? await getBlockHash({
							blockNumber: $block.blockNumber,
						})
						const block = await getBlock({
							blockHash: hash,
						})
						const extrinsic = block.block.extrinsics.at(indexInBlock)
						if (extrinsic == null)
							throw new Error(`Polkadot_JsonRpc: missing extrinsic ${indexInBlock}`)

						return {
							hash: extrinsicHashHex(extrinsic),
						}
					},
				},
			},
		})({
				hash: (extrinsic) => extrinsic.hash,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
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
					},
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertPolkadotMainnet(network)
						const {
							getBlockHash,
							getFinalizedHead,
							getHeader,
						} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
						const finalizedBlockHash = await getFinalizedHead()
						const finalizedBlockNumber = blockNumberFromHeader(await getHeader({
							blockHash: finalizedBlockHash,
						}))
						const offset = context.pagination.offset ?? 0
						return Promise.all(Array.from({
							length: Math.min(
								Math.max(
									Number(finalizedBlockNumber + 1n - BigInt(offset)),
									0
								),
								resolverContextRowLimit(context)
							),
						}, async (_value, blockOffset) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								blockNumber: finalizedBlockNumber - BigInt(offset + blockOffset),
								hash: (
									offset === 0 && blockOffset === 0 ?
										finalizedBlockHash
									:
										await getBlockHash({
											blockNumber: finalizedBlockNumber - BigInt(offset + blockOffset),
										})
								),
							},
						})))
					},
				}
			},
		})({
				Polkadot: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertPolkadotMainnet(network)
						const {
							getFinalizedHead,
							getHeader,
						} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
						return blockNumberFromHeader(await getHeader({
							blockHash: await getFinalizedHead(),
						})) + 1n
					},
				},
			},
		})({
				Polkadot: {
					$$blocks: {
						resolveCount: (count) => count,
					},
				},
			}),

	],
} satisfies RegisteredSourceResolverModule
