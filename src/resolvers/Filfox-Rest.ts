import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertFilecoinMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.filecoin.caip2.namespace
				|| network.caip2.reference !== networkBySlug.filecoin.caip2.reference
			)
		:
			network.slug !== networkBySlug.filecoin.slug
	)
		throw new Error('Filfox_Rest: unsupported network')
}

const tipsetKeyFromBlocks = (
	blocks: {
		cid: string
	}[]
) => (
	blocks
		.map((block) => block.cid)
		.join(',')
)

const listDeals = async (
	network: NetworkId,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertFilecoinMainnet(network)
	const pageSize = resolverContextRowLimit(context)
	const page = await (await import('$/sources/Filfox/Rest/queries.ts')).getDeals({
		page: Math.floor((context.pagination.offset ?? 0) / pageSize),
		pageSize,
	})
	return {
		dealCount: page.totalCount,
		deals: page.deals.map((deal) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				dealId: BigInt(deal.id),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], '$provider')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						minerAddress: deal.provider,
					},
				},
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], '$client')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: deal.client,
					},
				},
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'pieceSizeBytes')]: BigInt(deal.pieceSize),
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'verifiedDeal')]: deal.verifiedDeal,
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'startEpoch')]: BigInt(deal.startEpoch),
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'endEpoch')]: BigInt(deal.endEpoch),
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'storagePricePerEpochAttoFil')]: BigInt(deal.stroagePrice),
			},
		})),
	}
}

export default {
	source: Source.Filfox_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FilecoinTipset,
			resolve: {
				NetworkHeightTipsetKey: {
					resolve: async ({ $network, height, tipsetKey }) => {
						assertFilecoinMainnet($network)
						const {
							getBlock,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const tipset = await getTipset({
							height,
						})
						if (
							BigInt(tipset.height) !== height
							|| tipsetKeyFromBlocks(tipset.blocks) !== tipsetKey
						)
							throw new Error(`Filfox_Rest: tipset does not match ${height.toString()}/${tipsetKey}`)

						const firstBlock = tipset.blocks.at(0)
						const block = (
							firstBlock == null ?
								undefined
							:
								await getBlock({
									blockCid: firstBlock.cid,
								})
						)
						return {
							...(block != null && height > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
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
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
										[EntityMetaKey.Selector]: {
											$network,
											height,
											tipsetKey,
										},
									},
									[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
										[EntityMetaKey.Selector]: {
											$network,
											minerAddress: block.miner,
										},
									},
									...(block.winCount != null && {
										[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')]: block.winCount,
									}),
								},
							})),
						}
					},
				},
			},
		})({
			$parent: (snapshot) => snapshot.$parent,
			parentWeight: (snapshot) => snapshot.parentWeight,
			timestampMs: (snapshot) => snapshot.timestampMs,
			$$blocks: (snapshot) => snapshot.$$blocks,
		}),

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }) => {
						assertFilecoinMainnet($network)
						const {
							getBlock,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const block = await getBlock({
							blockCid: cid,
						})
						const tipset = await getTipset({
							height: BigInt(block.height),
						})
						return {
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network,
									height: BigInt(block.height),
									tipsetKey: tipsetKeyFromBlocks(tipset.blocks),
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
						}
					},
				},
			},
		})({
			$tipset: (snapshot) => snapshot.$tipset,
			$miner: (snapshot) => snapshot.$miner,
			winCount: (snapshot) => snapshot.winCount,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessage,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }) => {
						assertFilecoinMainnet($network)
						const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
						const message = await getMessage({
							messageCid: cid,
						})
						return {
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
				},
			},
		})({
			$from: (snapshot) => snapshot.$from,
			$to: (snapshot) => snapshot.$to,
			method: (snapshot) => snapshot.method,
			nonce: (snapshot) => snapshot.nonce,
			valueAttoFil: (snapshot) => snapshot.valueAttoFil,
			gasLimit: (snapshot) => snapshot.gasLimit,
		}),

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }, context) => {
						assertFilecoinMainnet($network)
						const { getBlockMessages } = await import('$/sources/Filfox/Rest/queries.ts')
						return (await getBlockMessages({
							blockCid: cid,
							pageSize: resolverContextRowLimit(context),
						})).messages.map((message) => ({
							[EntityMetaKey.Selector]: {
								$network,
								cid: message.cid,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$from')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: message.from,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$to')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: message.to,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'nonce')]: BigInt(message.nonce),
								[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'valueAttoFil')]: BigInt(message.value),
								...(message.methodNumber != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'method')]: message.methodNumber,
								}),
								...(message.gasLimit != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'gasLimit')]: BigInt(message.gasLimit),
								}),
							},
						}))
					},
				},
			},
		})({
			$$messages: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMiner,
			resolve: {
				NetworkMinerAddress: {
					resolve: async ({ $network, minerAddress }) => {
						assertFilecoinMainnet($network)
						const {
							getAddress,
							getOverview,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const [
							address,
							overview,
						] = await Promise.all([
							getAddress({
								address: minerAddress,
							}),
							getOverview(),
						])
						if (address.miner == null)
							throw new Error(`Filfox_Rest: ${minerAddress} is not a miner actor`)

						const tipset = await getTipset({
							height: BigInt(overview.height),
						})
						return {
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$miner: {
										$network,
										minerAddress,
									},
									height: BigInt(tipset.height),
									tipsetKey: tipsetKeyFromBlocks(tipset.blocks),
									source: Source.Filfox_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FilecoinMiner_Timestamp, [], 'timestampMs')]: tipset.timestamp * 1000,
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (miner) => miner.timestamps,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMiner_Timestamp,
			resolve: {
				MinerHeightTipsetKeySource: {
					resolve: async ({
						$miner,
						height,
						tipsetKey,
						source,
					}) => {
						assertFilecoinMainnet($miner.$network)
						if (source !== Source.Filfox_Rest)
							throw new Error(`Filfox_Rest: unsupported miner observation source ${source}`)

						const {
							getAddress,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const [
							tipset,
							address,
						] = await Promise.all([
							getTipset({
								height,
							}),
							getAddress({
								address: $miner.minerAddress,
							}),
						])
						if (
							BigInt(tipset.height) !== height
							|| tipsetKeyFromBlocks(tipset.blocks) !== tipsetKey
						)
							throw new Error(`Filfox_Rest: miner observation tipset does not match ${height.toString()}/${tipsetKey}`)
						if (address.miner == null)
							throw new Error(`Filfox_Rest: ${$miner.minerAddress} is not a miner actor`)

						const miner = address.miner
						return {
							timestampMs: tipset.timestamp * 1000,
							height,
							tipsetKey,
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $miner.$network,
									height,
									tipsetKey,
								},
							},
							...(miner.owner?.address != null && {
								$owner: {
									[EntityMetaKey.Selector]: {
										$network: $miner.$network,
										address: miner.owner.address,
									},
								},
							}),
							...(miner.worker?.address != null && {
								$worker: {
									[EntityMetaKey.Selector]: {
										$network: $miner.$network,
										address: miner.worker.address,
									},
								},
							}),
							...(miner.peerId != null && miner.peerId !== '' && {
								peerId: miner.peerId,
							}),
							...(miner.rawBytePower != null && {
								rawBytePower: BigInt(miner.rawBytePower),
							}),
							qualityAdjustedPower: BigInt(miner.qualityAdjPower),
							...(miner.networkRawBytePower != null && {
								networkRawBytePower: BigInt(miner.networkRawBytePower),
							}),
							...(miner.networkQualityAdjPower != null && {
								networkQualityAdjustedPower: BigInt(miner.networkQualityAdjPower),
							}),
							...(miner.sectors != null && {
								activeSectorCount: miner.sectors.active,
								liveSectorCount: miner.sectors.live,
								faultySectorCount: miner.sectors.faulty,
							}),
						}
					},
				},
			},
		})({
			timestampMs: (timestamp) => timestamp.timestampMs,
			height: (timestamp) => timestamp.height,
			tipsetKey: (timestamp) => timestamp.tipsetKey,
			$tipset: (timestamp) => timestamp.$tipset,
			$owner: (timestamp) => timestamp.$owner,
			$worker: (timestamp) => timestamp.$worker,
			peerId: (timestamp) => timestamp.peerId,
			rawBytePower: (timestamp) => timestamp.rawBytePower,
			qualityAdjustedPower: (timestamp) => timestamp.qualityAdjustedPower,
			networkRawBytePower: (timestamp) => timestamp.networkRawBytePower,
			networkQualityAdjustedPower: (timestamp) => timestamp.networkQualityAdjustedPower,
			activeSectorCount: (timestamp) => timestamp.activeSectorCount,
			liveSectorCount: (timestamp) => timestamp.liveSectorCount,
			faultySectorCount: (timestamp) => timestamp.faultySectorCount,
		}),

		defineResolver({
			entityType: EntityType.FilecoinActor,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address: actorAddress }) => {
						assertFilecoinMainnet($network)
						const {
							getOverview,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const overview = await getOverview()
						const tipset = await getTipset({
							height: BigInt(overview.height),
						})
						return {
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$actor: {
										$network,
										address: actorAddress,
									},
									timestampMs: tipset.timestamp * 1000,
									height: BigInt(tipset.height),
									tipsetKey: tipsetKeyFromBlocks(tipset.blocks),
									source: Source.Filfox_Rest,
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (actor) => actor.timestamps,
		}),

		defineResolver({
			entityType: EntityType.FilecoinActor_Timestamp,
			resolve: {
				ActorHeightTipsetKeySource: {
					resolve: async ({
						$actor,
						height,
						tipsetKey,
						source,
					}) => {
						assertFilecoinMainnet($actor.$network)
						if (source !== Source.Filfox_Rest)
							throw new Error(`Filfox_Rest: unsupported actor observation source ${source}`)

						const {
							getAddress,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const [
							tipset,
							address,
						] = await Promise.all([
							getTipset({
								height,
							}),
							getAddress({
								address: $actor.address,
							}),
						])
						if (
							BigInt(tipset.height) !== height
							|| tipsetKeyFromBlocks(tipset.blocks) !== tipsetKey
						)
							throw new Error(`Filfox_Rest: actor observation tipset does not match ${height.toString()}/${tipsetKey}`)

						return {
							timestampMs: tipset.timestamp * 1000,
							height,
							tipsetKey,
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $actor.$network,
									height,
									tipsetKey,
								},
							},
							idAddress: address.id,
							balanceAttoFil: BigInt(address.balance),
							...(address.actor != null && address.actor !== '' && {
								actorCodeCid: address.actor,
							}),
						}
					},
				},
			},
		})({
			timestampMs: (timestamp) => timestamp.timestampMs,
			height: (timestamp) => timestamp.height,
			tipsetKey: (timestamp) => timestamp.tipsetKey,
			$tipset: (timestamp) => timestamp.$tipset,
			idAddress: (timestamp) => timestamp.idAddress,
			actorCodeCid: (timestamp) => timestamp.actorCodeCid,
			balanceAttoFil: (timestamp) => timestamp.balanceAttoFil,
		}),

		defineResolver({
			entityType: EntityType.FilecoinDeal,
			resolve: {
				NetworkDealId: {
					resolve: async ({ $network, dealId }) => {
						assertFilecoinMainnet($network)
						const deal = await (await import('$/sources/Filfox/Rest/queries.ts')).getDeal({
							dealId,
						})
						if (BigInt(deal.id) !== dealId)
							throw new Error(`Filfox_Rest: deal does not match ${dealId.toString()}`)

						return {
							$provider: {
								[EntityMetaKey.Selector]: {
									$network,
									minerAddress: deal.provider,
								},
							},
							$client: {
								[EntityMetaKey.Selector]: {
									$network,
									address: deal.client,
								},
							},
							pieceCid: deal.pieceCid,
							pieceSizeBytes: BigInt(deal.pieceSize),
							verifiedDeal: deal.verifiedDeal,
							startEpoch: BigInt(deal.startEpoch),
							endEpoch: BigInt(deal.endEpoch),
							storagePricePerEpochAttoFil: BigInt(deal.storagePricePerEpoch),
							providerCollateralAttoFil: BigInt(deal.providerCollateral),
							clientCollateralAttoFil: BigInt(deal.clientCollateral),
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$deal: {
										$network,
										dealId,
									},
									timestampMs: deal.timestamp * 1000,
									source: Source.Filfox_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'height')]: BigInt(deal.height),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'verifiedDeal')]: deal.verifiedDeal,
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'providerCollateralAttoFil')]: BigInt(deal.providerCollateral),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'clientCollateralAttoFil')]: BigInt(deal.clientCollateral),
								},
							}],
						}
					},
				},
			},
		})({
			$provider: (deal) => deal.$provider,
			$client: (deal) => deal.$client,
			pieceCid: (deal) => deal.pieceCid,
			pieceSizeBytes: (deal) => deal.pieceSizeBytes,
			verifiedDeal: (deal) => deal.verifiedDeal,
			startEpoch: (deal) => deal.startEpoch,
			endEpoch: (deal) => deal.endEpoch,
			storagePricePerEpochAttoFil: (deal) => deal.storagePricePerEpochAttoFil,
			providerCollateralAttoFil: (deal) => deal.providerCollateralAttoFil,
			clientCollateralAttoFil: (deal) => deal.clientCollateralAttoFil,
			$$timestamps: (deal) => deal.timestamps,
		}),

		defineResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => listDeals($network, context),
				},
			},
		})({
			$$deals: {
				select: (page) => page.deals,
				resolveCount: (page) => page.dealCount,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: listDeals,
				},
			},
		})({
			Filecoin: {
				$$deals: {
					select: (page) => page.deals,
					resolveCount: (page) => page.dealCount,
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
