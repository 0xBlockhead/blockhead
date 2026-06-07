import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	filecoinMainnetCaip2,
	filfoxMainnetRestBaseUrl,
} from '$/constants/FilecoinNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

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
		defineResolver({
			entityType: EntityType.FilecoinTipset,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					height: entityId.height,
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
					...(block != null && entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
								tipsetKey: block.parents.join(','),
							},
						},
						parentWeight: BigInt(block.parentWeight),
					}),
					timestampMs: tipset.timestamp * 1000,
					$$blocks: tipset.blocks.map((block) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							cid: block.cid,
						},
						$tipset: {
							[EntityMetaKey.Id]: entityId,
						},
						$miner: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								minerAddress: block.miner,
							},
						},
						...(block.winCount != null && {
							winCount: block.winCount,
						}),
					})),
				}
			},
			fields: {
			$parent: (snapshot) => snapshot.$parent,
			parentWeight: (snapshot) => snapshot.parentWeight,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$blocks: (snapshot) => snapshot.$$blocks,
		}
		}),

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					blockCid: entityId.cid,
				})
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					height: BigInt(block.height),
				})
				return {
					$tipset: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							height: BigInt(block.height),
							tipsetKey: tipset.blocks.map((tipsetBlock) => tipsetBlock.cid).join(','),
						},
					},
					$miner: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							minerAddress: block.miner,
						},
					},
					...(block.winCount != null && {
						winCount: block.winCount,
					}),
				}
			},
			fields: {
			$tipset: (snapshot) => snapshot.$tipset,
			$miner: (snapshot) => snapshot.$miner,
			winCount: (snapshot) => snapshot.winCount,
		}
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessage,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
				const message = await getMessage({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					messageCid: entityId.cid,
				})
				return {
					$from: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							address: message.from,
						},
					},
					$to: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
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
			},
			fields: {
			$from: (snapshot) => snapshot.$from,
			$to: (snapshot) => snapshot.$to,
			method: (snapshot) => snapshot.method,
			nonce: (snapshot) => snapshot.nonce,
			valueAttoFil: (snapshot) => snapshot.valueAttoFil,
			gasLimit: (snapshot) => snapshot.gasLimit,
		}
		}),

		defineResolver({
			entityType: EntityType.FilecoinActor,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					address: entityId.address,
				})
				return {
					balanceAttoFil: BigInt(address.balance),
				}
			},
			fields: {
			balanceAttoFil: (snapshot) => snapshot.balanceAttoFil,
		}
		}),

		defineResolver({
			entityType: EntityType.FilecoinMiner,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					address: entityId.minerAddress,
				})
				if (address.miner == null) throw new Error(`Filfox_Rest: address ${entityId.minerAddress} is not a miner`)
				return {
					...(address.miner.owner != null && {
						$owner: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: address.miner.owner.address,
							},
						},
					}),
					...(address.miner.worker != null && {
						$worker: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: address.miner.worker.address,
							},
						},
					}),
					...(address.miner.peerId != null && {
						peerId: address.miner.peerId,
					}),
					qualityAdjustedPower: BigInt(address.miner.qualityAdjPower),
				}
			},
			fields: {
			$owner: (snapshot) => snapshot.$owner,
			$worker: (snapshot) => snapshot.$worker,
			peerId: (snapshot) => snapshot.peerId,
			qualityAdjustedPower: (snapshot) => snapshot.qualityAdjustedPower,
		}
		}),

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				assertFilecoinMainnet(entityId.$network)
				const { getBlockMessages } = await import('$/sources/Filfox/Rest/queries.ts')
				return (await getBlockMessages({
					restBaseUrl: filfoxMainnetRestBaseUrl,
					blockCid: entityId.cid,
					pageSize: resolverContextRowLimit(context),
				})).messages.map((message) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						cid: message.cid,
					},
					$from: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							address: message.from,
						},
					},
					$to: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							address: message.to,
						},
					},
					nonce: BigInt(message.nonce),
					valueAttoFil: BigInt(message.value),
				}))
			},
			fields: {
			$$messages: (snapshot) => snapshot,
		}
		}),
	],
}
