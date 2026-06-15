import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	filecoinMainnetCaip2,
	filfoxMainnetRestBaseUrl,
} from '$/constants/FilecoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { FilecoinTipsetSelector } from '$/schema/FilecoinTipset.ts'
import { FilecoinBlockSelector } from '$/schema/FilecoinBlock.ts'
import { FilecoinMessageSelector } from '$/schema/FilecoinMessage.ts'
import { FilecoinActorSelector } from '$/schema/FilecoinActor.ts'
import { FilecoinMinerSelector } from '$/schema/FilecoinMiner.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string } | { slug: string }

const assertFilecoinMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== filecoinMainnetCaip2.namespace
		|| network.caip2.reference !== filecoinMainnetCaip2.reference
	) {
		throw new Error('Filfox_Rest: unsupported network')
	}
}

export default {
	source: Source.Filfox_Rest,

	resolvers: [
		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinTipset,
			resolve: {
				[FilecoinTipsetSelector.NetworkHeightTipsetKey]: async ({ $network, height, tipsetKey }) => {
				assertFilecoinMainnet($network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					height: height,
				})
				const firstBlock = tipset.blocks.at(0)
				const block = (
					firstBlock == null ?
						undefined
					:
						await getBlock({
							restBaseUrl: filfoxMainnetRestBaseUrl,
							blockCid: firstBlock.cid,
						})
				)
				return {
					...(block != null && height > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: height - 1n,
								tipsetKey: block.parents.join(','),
							},
						},
						parentWeight: BigInt(block.parentWeight),
					}),
					timestampMs: tipset.timestamp * 1000,
					$$blocks: tipset.blocks.map((block) => ({
						[EntityMetaKey.Selector]: {
							$network,
							cid: block.cid,
						},
						$tipset: {
							[EntityMetaKey.Selector]: {
								$network,
								height,
								tipsetKey,
							},
						},
						$miner: {
							[EntityMetaKey.Selector]: {
								$network,
								minerAddress: block.miner,
							},
						},
						...(block.winCount != null && {
							winCount: block.winCount,
						}),
					})),
				}
			}
			}
		})({
				fields: {
			$parent: (snapshot) => snapshot.$parent,
			parentWeight: (snapshot) => snapshot.parentWeight,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$blocks: (snapshot) => snapshot.$$blocks,
		},
			}),

		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinBlock,
			resolve: {
				[FilecoinBlockSelector.NetworkCid]: async ({ $network, cid }) => {
				assertFilecoinMainnet($network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					blockCid: cid,
				})
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					height: BigInt(block.height),
				})
				return {
					$tipset: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							height: BigInt(block.height),
							tipsetKey: tipset.blocks.map((tipsetBlock) => tipsetBlock.cid).join(','),
						},
					},
					$miner: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							minerAddress: block.miner,
						},
					},
					...(block.winCount != null && {
						winCount: block.winCount,
					}),
				}
			}
			}
		})({
				fields: {
			$tipset: (snapshot) => snapshot.$tipset,
			$miner: (snapshot) => snapshot.$miner,
			winCount: (snapshot) => snapshot.winCount,
		},
			}),

		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinMessage,
			resolve: {
				[FilecoinMessageSelector.NetworkCid]: async ({ $network, cid }) => {
				assertFilecoinMainnet($network)
				const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
				const message = await getMessage({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					messageCid: cid,
				})
				return {
					$from: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							address: message.from,
						},
					},
					$to: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							address: message.to,
						},
					},
					...(message.methodNumber != null && {
						method: message.methodNumber,
					}),
					nonce: BigInt(message.nonce),
					valueAttoFil: BigInt(message.value),
					...(message.gasLimit != null && {
						gasLimit: BigInt(message.gasLimit),
					}),
				}
			}
			}
		})({
				fields: {
			$from: (snapshot) => snapshot.$from,
			$to: (snapshot) => snapshot.$to,
			method: (snapshot) => snapshot.method,
			nonce: (snapshot) => snapshot.nonce,
			valueAttoFil: (snapshot) => snapshot.valueAttoFil,
			gasLimit: (snapshot) => snapshot.gasLimit,
		},
			}),

		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinActor,
			resolve: {
				[FilecoinActorSelector.NetworkAddress]: async ({ $network, address: addressSelector }) => {
				assertFilecoinMainnet($network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					address: addressSelector,
				})
				return {
					balanceAttoFil: BigInt(address.balance),
				}
			}
			}
		})({
				fields: {
			balanceAttoFil: (snapshot) => snapshot.balanceAttoFil,
		},
			}),

		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinMiner,
			resolve: {
				[FilecoinMinerSelector.NetworkMinerAddress]: async ({ $network, minerAddress }) => {
				assertFilecoinMainnet($network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					address: minerAddress,
				})
				if (address.miner == null) throw new Error(`Filfox_Rest: address ${minerAddress} is not a miner`)
				return {
					...(address.miner.owner != null && {
						$owner: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: address.miner.owner.address,
							},
						},
					}),
					...(address.miner.worker != null && {
						$worker: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: address.miner.worker.address,
							},
						},
					}),
					...(address.miner.peerId != null && {
						peerId: address.miner.peerId,
					}),
					qualityAdjustedPower: BigInt(address.miner.qualityAdjPower),
				}
			}
			}
		})({
				fields: {
			$owner: (snapshot) => snapshot.$owner,
			$worker: (snapshot) => snapshot.$worker,
			peerId: (snapshot) => snapshot.peerId,
			qualityAdjustedPower: (snapshot) => snapshot.qualityAdjustedPower,
		},
			}),

		defineResolver(Source.Filfox_Rest, {
			entityType: EntityType.FilecoinBlock,
			resolve: {
				[FilecoinBlockSelector.NetworkCid]: async ({ $network, cid }, context) => {
				assertFilecoinMainnet($network)
				const { getBlockMessages } = await import('$/sources/Filfox/Rest/queries.ts')
				return (await getBlockMessages({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					blockCid: cid,
					pageSize: resolverContextRowLimit(context),
				})).messages.map((message) => ({
					[EntityMetaKey.Selector]: {
						$network,
						cid: message.cid,
					},
					$from: {
						[EntityMetaKey.Selector]: {
							$network,
							address: message.from,
						},
					},
					$to: {
						[EntityMetaKey.Selector]: {
							$network,
							address: message.to,
						},
					},
					nonce: BigInt(message.nonce),
					valueAttoFil: BigInt(message.value),
				}))
			}
			}
		})({
				fields: {
			$$messages: (snapshot) => snapshot,
		},
			}),
	],
}
