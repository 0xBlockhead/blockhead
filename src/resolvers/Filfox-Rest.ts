import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const filfoxMainnetRestUrl = 'https://filfox.info/api/v1'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertFilecoinMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'fil' || network.caip2.reference !== 'f') {
		throw new Error('Filfox_Rest: unsupported network')
	}
}

export default {
	source: Source.Filfox_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FilecoinTipset,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestUrl,
					height: entityId.height,
				})
				const firstBlock = tipset.blocks[0]
				const block = (
					firstBlock == null ?
						undefined
					:
						await getBlock({
							restBaseUrl: filfoxMainnetRestUrl,
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
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const {
					getBlock,
					getTipset,
				} = await import('$/sources/Filfox/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: filfoxMainnetRestUrl,
					blockCid: entityId.cid,
				})
				const tipset = await getTipset({
					restBaseUrl: filfoxMainnetRestUrl,
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
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinMessage,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
				const message = await getMessage({
					restBaseUrl: filfoxMainnetRestUrl,
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
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinActor,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestUrl,
					address: entityId.address,
				})
				return {
					balanceAttoFil: BigInt(address.balance),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinMiner,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getAddress } = await import('$/sources/Filfox/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: filfoxMainnetRestUrl,
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
		}),
	],

	entityFieldResolvers: [




		defineEntityFieldResolver({
			entityType: EntityType.FilecoinBlock,
			fieldName: '$$messages',
			resolve: async (entityId, context) => {
				assertFilecoinMainnet(entityId.$network)
				const { getBlockMessages } = await import('$/sources/Filfox/Rest/queries.ts')
				return (await getBlockMessages({
					restBaseUrl: filfoxMainnetRestUrl,
					blockCid: entityId.cid,
					pageSize: resolverLoadSubsetRowLimit(context),
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
		}),
	],
}
