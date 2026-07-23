import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TonCenterV3Page } from '$/sources/TonCenter/V3/Rest/types.ts'

type TonNetwork = EntitySelector<typeof schema, EntityType.Network>

const tonCenterV3Binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.TonCenter_V3_Rest)

if (tonCenterV3Binding == null)
	throw new Error('TonCenter_V3_Rest: source binding is missing')

const tonNetworkApplicability = [
	{
		caip2: networkBySlug.ton.caip2,
	},
	{
		slug: networkBySlug.ton.slug,
	},
] as const

const assertTonMainnet = (
	network: TonNetwork
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.ton.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ton.caip2.namespace
			&& network.caip2.reference === networkBySlug.ton.caip2.reference
		)
	)
		throw new Error('TonCenter_V3_Rest: unsupported network')
}

const offset = (
	token: string | undefined
) => {
	if (token == null)
		return 0
	if (!/^(?:0|[1-9]\d*)$/.test(token))
		throw new Error('TonCenter_V3_Rest: invalid offset continuation')

	const value = Number(token)
	if (!Number.isSafeInteger(value))
		throw new Error('TonCenter_V3_Rest: offset continuation exceeds safe bounds')

	return value
}

const continuation = (
	nextOffset: number | undefined,
	operation: string
) => (
	nextOffset == null ?
		{
			operation,
			target: 'ton:-239',
			terminal: true as const,
		}
	:
		{
			operation,
			target: 'ton:-239',
			terminal: false as const,
			token: String(nextOffset),
		}
)

const resolvePage = async <_Row>(
	context: Parameters<typeof resolverContextRowLimit>[0],
	request: (
		limit: number,
		offset: number
	) => Promise<TonCenterV3Page<_Row>>
): Promise<TonCenterV3Page<_Row>> => {
	const limit = Math.min(resolverContextRowLimit(context), 1_000)
	if (limit === 0)
		return {
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [],
		}

	return request(limit, offset(context.providerContinuationToken))
}

const tonAccount = (
	network: TonNetwork,
	address: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		address,
	},
})

const tonMessage = (
	network: TonNetwork,
	message: {
		hash: string
		source?: string
		destination?: string
		createdLt: bigint
		valueNano: bigint
		opcode?: number
	}
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		messageHash: message.hash,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TonMessage, [], 'messageKind')]: (
			message.source == null ?
				'external-in'
			: message.destination == null ?
				'external-out'
			:
				'internal'
		),
		[entityFieldAddressKey(EntityType.TonMessage, [], 'sourceAddress')]: message.source,
		[entityFieldAddressKey(EntityType.TonMessage, [], 'destinationAddress')]: message.destination,
		[entityFieldAddressKey(EntityType.TonMessage, [], 'valueNano')]: message.valueNano,
		[entityFieldAddressKey(EntityType.TonMessage, [], 'createdLt')]: message.createdLt,
		[entityFieldAddressKey(EntityType.TonMessage, [], 'opcode')]: message.opcode,
	},
})

export const createTonCenterV3Resolvers = (
	binding: SourceBinding
) => ({
	source: Source.TonCenter_V3_Rest,

	resolvers: [
		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Blocks } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Blocks(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Blocks } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Blocks(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
			},
		})({
			Ton: {
				$$blocks: {
					select: (page, network) => page.rows.map((block) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							workchain: block.workchain,
							shardPrefix: block.shard,
							seqno: BigInt(block.seqno),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')]: block.rootHash,
							[entityFieldAddressKey(EntityType.TonBlock, [], 'fileHash')]: block.fileHash,
							[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')]: block.genUtimeSeconds * 1_000,
							[entityFieldAddressKey(EntityType.TonBlock, [], 'startLt')]: block.startLt,
							[entityFieldAddressKey(EntityType.TonBlock, [], 'endLt')]: block.endLt,
						},
					})),
					continuation: (page) => continuation(page.nextOffset, 'blocks'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Transactions } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Transactions(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Transactions } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Transactions(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
			},
		})({
			Ton: {
				$$transactions: {
					select: (page, network) => page.rows.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$account: {
								$network: network,
								address: transaction.account,
							},
							lt: transaction.logicalTime,
							hash: transaction.hash,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'nowMs')]: transaction.timestampSeconds * 1_000,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'origStatus')]: transaction.originalStatus,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'endStatus')]: transaction.endStatus,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'transactionKind')]: transaction.transactionKind,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'outMessageCount')]: transaction.outboundMessages.length,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'totalFeesNano')]: transaction.totalFeesNano,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionHash')]: transaction.previousTransactionHash,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionLt')]: transaction.previousTransactionLogicalTime,
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$block')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									workchain: transaction.block.workchain,
									shardPrefix: transaction.block.shard,
									seqno: BigInt(transaction.block.seqno),
								},
							},
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$trace')]: (
								transaction.traceId == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											$network: network,
											traceId: transaction.traceId,
											source: Source.TonCenter_V3_Rest,
										},
									}
							),
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$inMessage')]: (
								transaction.inboundMessage == null ?
									undefined
								:
									tonMessage(network, transaction.inboundMessage)
							),
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$$outMessages')]: (
								transaction.outboundMessages.map((message) => tonMessage(network, message))
							),
						},
					})),
					continuation: (page) => continuation(page.nextOffset, 'transactions'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Messages } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Messages(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3Messages } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return resolvePage(context, (limit, pageOffset) => (
							getTonCenterV3Messages(binding, {
								limit,
								offset: pageOffset,
								order: 'desc',
							})
						))
					},
				},
			},
		})({
			Ton: {
				$$messages: {
					select: (page, network) => page.rows.map((message) => tonMessage(network, message)),
					continuation: (page) => continuation(page.nextOffset, 'messages'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3CompletedTraces } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3CompletedTraces(binding, {
									limit,
									offset: pageOffset,
									order: 'desc',
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3CompletedTraces } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3CompletedTraces(binding, {
									limit,
									offset: pageOffset,
									order: 'desc',
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
			Ton: {
				$$traces: {
					select: (page, network) => (
						page.rows.map((trace) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								traceId: trace.traceId,
								source: Source.TonCenter_V3_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TonTrace, [], '$rootMessage')]: tonMessage(network, trace.rootMessage),
								[entityFieldAddressKey(EntityType.TonTrace, [], 'startedAtMs')]: trace.startUtimeSeconds * 1_000,
								[entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')]: [{
									[EntityMetaKey.Selector]: {
										$trace: {
											$network: network,
											traceId: trace.traceId,
											source: Source.TonCenter_V3_Rest,
										},
										timestampMs: page.resolvedAtMs,
										source: Source.TonCenter_V3_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'status')]: 'completed',
										[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'transactionCount')]: trace.transactionCount,
										[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'messageCount')]: trace.messageCount,
									},
								}],
								[entityFieldAddressKey(EntityType.TonTrace, [], '$$messages')]: [
									tonMessage(network, trace.rootMessage),
								],
							},
						}))
					),
					continuation: (page) => continuation(page.nextOffset, 'completed-traces'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3JettonMasters } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3JettonMasters(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3JettonMasters } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3JettonMasters(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
			Ton: {
				$$jettons: {
					select: (page, network) => (
						page.rows.map((jetton) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								masterAddress: jetton.address,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TonJetton, [], '$masterAccount')]: tonAccount(network, jetton.address),
								[entityFieldAddressKey(EntityType.TonJetton, [], '$$timestamps')]: [{
									[EntityMetaKey.Selector]: {
										$jetton: {
											$network: network,
											masterAddress: jetton.address,
										},
										timestampMs: page.resolvedAtMs,
										source: Source.TonCenter_V3_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'adminAddress')]: jetton.adminAddress,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'codeHash')]: jetton.codeHash,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'dataHash')]: jetton.dataHash,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'walletCodeHash')]: jetton.walletCodeHash,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'metadataUri')]: jetton.metadataUri,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'mintable')]: jetton.mintable,
										[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'lastTransactionLt')]: jetton.lastTransactionLogicalTime,
									},
								}],
							},
						}))
					),
					continuation: (page) => continuation(page.nextOffset, 'jettons'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3NftCollections } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3NftCollections(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3NftCollections } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3NftCollections(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
			Ton: {
				$$nftCollections: {
					select: (page, network) => (
						page.rows.map((collection) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								collectionAddress: collection.address,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TonNftCollection, [], '$account')]: tonAccount(network, collection.address),
								[entityFieldAddressKey(EntityType.TonNftCollection, [], '$$timestamps')]: [{
									[EntityMetaKey.Selector]: {
										$collection: {
											$network: network,
											collectionAddress: collection.address,
										},
										timestampMs: page.resolvedAtMs,
										source: Source.TonCenter_V3_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'ownerAddress')]: collection.ownerAddress,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'nextItemIndex')]: collection.nextItemIndex,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'metadataUri')]: collection.metadataUri,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'content')]: collection.content,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'codeHash')]: collection.codeHash,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'dataHash')]: collection.dataHash,
										[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'lastTransactionLt')]: collection.lastTransactionLogicalTime,
									},
								}],
							},
						}))
					),
					continuation: (page) => continuation(page.nextOffset, 'nft-collections'),
				},
			},
		}),

		defineResolver(Source.TonCenter_V3_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3NftItems } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3NftItems(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: async (network, context) => {
						assertTonMainnet(network)
						const { getTonCenterV3NftItems } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return {
							...await resolvePage(context, (limit, pageOffset) => (
								getTonCenterV3NftItems(binding, {
									limit,
									offset: pageOffset,
								})
							)),
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
			Ton: {
				$$nftItems: {
					select: (page, network) => (
						page.rows.map((item) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								itemAddress: item.address,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TonNftItem, [], '$collection')]: (
									item.collectionAddress == null ?
										undefined
									:
										{
											[EntityMetaKey.Selector]: {
												$network: network,
												collectionAddress: item.collectionAddress,
											},
										}
								),
								[entityFieldAddressKey(EntityType.TonNftItem, [], 'itemIndex')]: item.index,
								[entityFieldAddressKey(EntityType.TonNftItem, [], '$account')]: tonAccount(network, item.address),
								[entityFieldAddressKey(EntityType.TonNftItem, [], '$$timestamps')]: [{
									[EntityMetaKey.Selector]: {
										$item: {
											$network: network,
											itemAddress: item.address,
										},
										timestampMs: page.resolvedAtMs,
										source: Source.TonCenter_V3_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], '$owner')]: (
											item.ownerAddress == null ?
												undefined
											:
												tonAccount(network, item.ownerAddress)
										),
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'ownerAddress')]: item.ownerAddress,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'initialized')]: item.initialized,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'metadataUri')]: item.metadataUri,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'content')]: item.content,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'codeHash')]: item.codeHash,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'dataHash')]: item.dataHash,
										[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'lastTransactionLt')]: item.lastTransactionLogicalTime,
									},
								}],
							},
						}))
					),
					continuation: (page) => continuation(page.nextOffset, 'nft-items'),
				},
			},
		}),
		] as const,
	})

export default createTonCenterV3Resolvers(tonCenterV3Binding)
