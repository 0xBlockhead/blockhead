import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	tonCenterV3Hash,
	tonCenterV3RawAddress,
	tonCenterV3Shard,
} from '$/sources/TonCenter/V3/Rest/normalization.ts'
import type {
	TonCenterV3MessageWire,
	TonCenterV3Page,
} from '$/sources/TonCenter/V3/Rest/types.ts'
type TonNetwork = EntitySelector<typeof schema, EntityType.Network>

const tonNetworkApplicability = [
	{
		caip2: networkBySlug.ton.caip2,
	},
	{
		slug: networkBySlug.ton.slug,
	},
] as const

const tonNetworkSelectors = <_Snapshot extends object>(
	resolve: (
		network: TonNetwork,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [tonNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [tonNetworkApplicability[1]],
		resolve,
	},
})

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
		throw new Error('TON Center v3: unsupported network')
}

const offset = (
	token: string | undefined
) => {
	if (token == null)
		return 0
	if (!/^(?:0|[1-9]\d*)$/.test(token))
		throw new Error('TON Center v3: invalid offset continuation')

	const value = Number(token)
	if (!Number.isSafeInteger(value))
		throw new Error('TON Center v3: offset continuation exceeds safe bounds')

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
) => {
	const limit = Math.min(resolverContextRowLimit(context), 1_000)
	if (limit === 0)
		return {
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
	message: TonCenterV3MessageWire
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		messageHash: tonCenterV3Hash(message.hash, 'message hash'),
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
		[entityFieldAddressKey(EntityType.TonMessage, [], 'sourceAddress')]: (
			message.source == null ?
				undefined
			:
				tonCenterV3RawAddress(message.source)
		),
		[entityFieldAddressKey(EntityType.TonMessage, [], 'destinationAddress')]: (
			message.destination == null ?
				undefined
			:
				tonCenterV3RawAddress(message.destination)
		),
		[entityFieldAddressKey(EntityType.TonMessage, [], 'valueNano')]: BigInt(message.value),
		[entityFieldAddressKey(EntityType.TonMessage, [], 'createdLt')]: BigInt(message.created_lt),
		[entityFieldAddressKey(EntityType.TonMessage, [], 'opcode')]: message.opcode,
	},
})

export const createTonCenterV3Resolvers = () => ({
	source: Source.TonCenter,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3Blocks } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return resolvePage(context, (limit, pageOffset) => (
					getTonCenterV3Blocks({
						limit,
						offset: pageOffset,
						order: 'desc',
					})
				))
			}),
		})({
			Ton: {
				$$blocks: {
					select: (page, network) => page.rows.map((block) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							workchain: block.workchain,
							shardPrefix: tonCenterV3Shard(block.shard),
							seqno: BigInt(block.seqno),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')]: tonCenterV3Hash(block.root_hash, 'block root hash'),
							[entityFieldAddressKey(EntityType.TonBlock, [], 'fileHash')]: tonCenterV3Hash(block.file_hash, 'block file hash'),
							[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')]: Number(block.gen_utime) * 1_000,
							[entityFieldAddressKey(EntityType.TonBlock, [], 'startLt')]: BigInt(block.start_lt),
							[entityFieldAddressKey(EntityType.TonBlock, [], 'endLt')]: BigInt(block.end_lt),
						},
					})),
					continuation: (page) => continuation(page.nextOffset, 'blocks'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3Transactions } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return resolvePage(context, (limit, pageOffset) => (
					getTonCenterV3Transactions({
						limit,
						offset: pageOffset,
						order: 'desc',
					})
				))
			}),
		})({
			Ton: {
				$$transactions: {
					select: (page, network) => page.rows.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$account: {
								$network: network,
								address: tonCenterV3RawAddress(transaction.account),
							},
							lt: BigInt(transaction.lt),
							hash: tonCenterV3Hash(transaction.hash, 'transaction hash'),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'nowMs')]: transaction.now * 1_000,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'origStatus')]: transaction.orig_status,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'endStatus')]: transaction.end_status,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'transactionKind')]: transaction.description.type,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'outMessageCount')]: transaction.out_msgs.length,
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'totalFeesNano')]: BigInt(transaction.total_fees),
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionHash')]: tonCenterV3Hash(
								transaction.prev_trans_hash,
								'previous transaction hash'
							),
							[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionLt')]: BigInt(transaction.prev_trans_lt),
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$block')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									workchain: transaction.block_ref.workchain,
									shardPrefix: tonCenterV3Shard(transaction.block_ref.shard),
									seqno: BigInt(transaction.block_ref.seqno),
								},
							},
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$trace')]: (
								transaction.trace_id == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											$network: network,
											traceId: tonCenterV3Hash(transaction.trace_id, 'transaction trace ID'),
											source: Source.TonCenter,
										},
									}
							),
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$inMessage')]: (
								transaction.in_msg == null ?
									undefined
								:
									tonMessage(network, transaction.in_msg)
							),
							[entityFieldAddressKey(EntityType.TonTransaction, [], '$$outMessages')]: (
								transaction.out_msgs.map((message) => tonMessage(network, message))
							),
						},
					})),
					continuation: (page) => continuation(page.nextOffset, 'transactions'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3Messages } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return resolvePage(context, (limit, pageOffset) => (
					getTonCenterV3Messages({
						limit,
						offset: pageOffset,
						order: 'desc',
					})
				))
			}),
		})({
			Ton: {
				$$messages: {
					select: (page, network) => page.rows.map((message) => tonMessage(network, message)),
					continuation: (page) => continuation(page.nextOffset, 'messages'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3CompletedTraces } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return {
					...await resolvePage(context, (limit, pageOffset) => (
						getTonCenterV3CompletedTraces({
							limit,
							offset: pageOffset,
							order: 'desc',
						})
					)),
					resolvedAtMs: Date.now(),
				}
			}),
		})({
			Ton: {
				$$traces: {
					select: (page, network) => (
						page.rows.map((trace) => {
							const traceSelector = {
								$network: network,
								traceId: tonCenterV3Hash(trace.trace_id, 'trace ID'),
								source: Source.TonCenter,
							}
							const rootMessage = tonMessage(network, trace.trace.in_msg)
							return {
								[EntityMetaKey.Selector]: traceSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TonTrace, [], '$rootMessage')]: rootMessage,
									[entityFieldAddressKey(EntityType.TonTrace, [], 'startedAtMs')]: trace.start_utime * 1_000,
									[entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$trace: traceSelector,
											timestampMs: page.resolvedAtMs,
											source: Source.TonCenter,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'status')]: 'completed',
											[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'transactionCount')]: trace.trace_info.transactions,
											[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'messageCount')]: trace.trace_info.messages,
										},
									}],
									[entityFieldAddressKey(EntityType.TonTrace, [], '$$messages')]: [rootMessage],
								},
							}
						})
					),
					continuation: (page) => continuation(page.nextOffset, 'completed-traces'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3JettonMasters } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return {
					...await resolvePage(context, (limit, pageOffset) => (
						getTonCenterV3JettonMasters({
							limit,
							offset: pageOffset,
						})
					)),
					resolvedAtMs: Date.now(),
				}
			}),
		})({
			Ton: {
				$$jettons: {
					select: (page, network) => (
						page.rows.map((jetton) => {
							const masterAddress = tonCenterV3RawAddress(jetton.address)
							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									masterAddress,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TonJetton, [], '$masterAccount')]: tonAccount(network, masterAddress),
									[entityFieldAddressKey(EntityType.TonJetton, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$jetton: {
												$network: network,
												masterAddress,
											},
											timestampMs: page.resolvedAtMs,
											source: Source.TonCenter,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'adminAddress')]: (
												jetton.admin_address == null ?
													undefined
												:
													tonCenterV3RawAddress(jetton.admin_address)
											),
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'codeHash')]: jetton.code_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'dataHash')]: jetton.data_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'walletCodeHash')]: jetton.jetton_wallet_code_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'metadataUri')]: jetton.jetton_content?.uri,
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'mintable')]: jetton.mintable,
											[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'lastTransactionLt')]: (
												jetton.last_transaction_lt == null ?
													undefined
												:
													BigInt(jetton.last_transaction_lt)
											),
										},
									}],
								},
							}
						})
					),
					continuation: (page) => continuation(page.nextOffset, 'jettons'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3NftCollections } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return {
					...await resolvePage(context, (limit, pageOffset) => (
						getTonCenterV3NftCollections({
							limit,
							offset: pageOffset,
						})
					)),
					resolvedAtMs: Date.now(),
				}
			}),
		})({
			Ton: {
				$$nftCollections: {
					select: (page, network) => (
						page.rows.map((collection) => {
							const collectionAddress = tonCenterV3RawAddress(collection.address)
							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									collectionAddress,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TonNftCollection, [], '$account')]: tonAccount(network, collectionAddress),
									[entityFieldAddressKey(EntityType.TonNftCollection, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$collection: {
												$network: network,
												collectionAddress,
											},
											timestampMs: page.resolvedAtMs,
											source: Source.TonCenter,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'ownerAddress')]: (
												collection.owner_address == null ?
													undefined
												:
													tonCenterV3RawAddress(collection.owner_address)
											),
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'nextItemIndex')]: (
												collection.next_item_index == null ?
													undefined
												:
													BigInt(collection.next_item_index)
											),
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'metadataUri')]: collection.collection_content?.uri,
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'content')]: collection.collection_content,
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'codeHash')]: collection.code_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'dataHash')]: collection.data_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'lastTransactionLt')]: (
												collection.last_transaction_lt == null ?
													undefined
												:
													BigInt(collection.last_transaction_lt)
											),
										},
									}],
								},
							}
						})
					),
					continuation: (page) => continuation(page.nextOffset, 'nft-collections'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network, context) => {
				assertTonMainnet(network)
				const { getTonCenterV3NftItems } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return {
					...await resolvePage(context, (limit, pageOffset) => (
						getTonCenterV3NftItems({
							limit,
							offset: pageOffset,
						})
					)),
					resolvedAtMs: Date.now(),
				}
			}),
		})({
			Ton: {
				$$nftItems: {
					select: (page, network) => (
						page.rows.map((item) => {
							const itemAddress = tonCenterV3RawAddress(item.address)
							const collectionAddress = item.collection_address ?? item.collection?.address
							const ownerAddress = (
								item.owner_address == null ?
									undefined
								:
									tonCenterV3RawAddress(item.owner_address)
							)
							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									itemAddress,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TonNftItem, [], '$collection')]: (
										collectionAddress == null ?
											undefined
										:
											{
												[EntityMetaKey.Selector]: {
													$network: network,
													collectionAddress: tonCenterV3RawAddress(collectionAddress),
												},
											}
									),
									[entityFieldAddressKey(EntityType.TonNftItem, [], 'itemIndex')]: (
										item.index == null ?
											undefined
										:
											BigInt(item.index)
									),
									[entityFieldAddressKey(EntityType.TonNftItem, [], '$account')]: tonAccount(network, itemAddress),
									[entityFieldAddressKey(EntityType.TonNftItem, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$item: {
												$network: network,
												itemAddress,
											},
											timestampMs: page.resolvedAtMs,
											source: Source.TonCenter,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], '$owner')]: (
												ownerAddress == null ?
													undefined
												:
													tonAccount(network, ownerAddress)
											),
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'ownerAddress')]: ownerAddress,
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'initialized')]: item.init,
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'metadataUri')]: item.content?.uri,
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'content')]: item.content,
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'codeHash')]: item.code_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'dataHash')]: item.data_hash?.toLowerCase(),
											[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'lastTransactionLt')]: (
												item.last_transaction_lt == null ?
													undefined
												:
													BigInt(item.last_transaction_lt)
											),
										},
									}],
								},
							}
						})
					),
					continuation: (page) => continuation(page.nextOffset, 'nft-items'),
				},
			},
		}),
		] as const,
	}) satisfies RegisteredSourceResolverModule

export default createTonCenterV3Resolvers()
