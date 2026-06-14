import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	polkadotMainnetCaip2,
	polkadotMainnetRpcUrl,
} from '$/constants/PolkadotNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'
import { PolkadotNetworkSelector } from '$/schema/PolkadotNetwork.ts'
import { PolkadotNetwork_TimestampSelector } from '$/schema/PolkadotNetwork_Timestamp.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'

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
		[EntityMetaKey.Selector]: {
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
		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
				assertPolkadotMainnet(entitySelector)
				return {
					$network: {
						[EntityMetaKey.Selector]: entitySelector,
					},
					rpcEndpoints: [
						{
							url: polkadotMainnetRpcUrl,
							transportType: TransportType.Http,
							providerName: 'Parity',
						},
					],
				}
			}
			}
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
			}
			}
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
					rpcUrl: polkadotMainnetRpcUrl,
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
					),
				}
			}
			}
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
				assertPolkadotMainnet(entitySelector)
				return [
					{
						url: polkadotMainnetRpcUrl,
						transportType: TransportType.Http,
						providerName: 'Parity',
					},
				]
			}
			}
		})({
				fields: {
			rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
		},
			}),

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
				assertPolkadotMainnet(entitySelector)
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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

		defineResolver(Source.Polkadot_JsonRpc, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector, context) => {
				assertPolkadotMainnet(entitySelector)
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
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
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
					rpcUrl: polkadotMainnetRpcUrl,
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
			}
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
						rpcUrl: polkadotMainnetRpcUrl,
						blockHash: hash,
					}),
				)
			}
			}
		})({
				fields: {
			$$extrinsics: (extrinsics) => extrinsics,
		},
			}),
	],
}
