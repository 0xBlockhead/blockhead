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
	return (await (await import('$/sources/Filfox/Rest/queries.ts')).getDeals({
		page: Math.floor((context.pagination.offset ?? 0) / pageSize),
		pageSize,
	})).deals.map((deal) => ({
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
	}))
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
							},
						}))
					},
				},
			},
		})({
			$$messages: (snapshot) => snapshot,
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
		}),

		defineResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => listDeals($network, context),
				},
			},
		})({
			$$deals: (deals) => deals,
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
				$$deals: (deals) => deals,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
