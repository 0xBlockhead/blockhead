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
	TonCenterV3BlockWire,
	TonCenterV3MessageWire,
	TonCenterV3Page,
	TonCenterV3TraceWire,
	TonCenterV3TransactionWire,
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

const tonBlock = (
	block: TonCenterV3BlockWire
) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')]: tonCenterV3Hash(
			block.root_hash,
			'block root hash'
		),
		[entityFieldAddressKey(EntityType.TonBlock, [], 'fileHash')]: tonCenterV3Hash(
			block.file_hash,
			'block file hash'
		),
		[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')]: Number(block.gen_utime) * 1_000,
		[entityFieldAddressKey(EntityType.TonBlock, [], 'startLt')]: BigInt(block.start_lt),
		[entityFieldAddressKey(EntityType.TonBlock, [], 'endLt')]: BigInt(block.end_lt),
		[entityFieldAddressKey(EntityType.TonBlock, [], 'minRefMcSeqno')]: (
			block.min_ref_mc_seqno == null ?
				undefined
			:
				BigInt(block.min_ref_mc_seqno)
		),
	},
})

const tonNetworkTimestamp = (
	network: TonNetwork,
	lastMasterchainBlock: TonCenterV3BlockWire
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		timestampMs: Number(lastMasterchainBlock.gen_utime) * 1_000,
		source: Source.TonCenter,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'masterchainSeqno')]: BigInt(lastMasterchainBlock.seqno),
		[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'latestBlockUtimeMs')]: Number(lastMasterchainBlock.gen_utime) * 1_000,
	},
})

const tonTransaction = (
	network: TonNetwork,
	transaction: TonCenterV3TransactionWire
) => ({
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
})

const tonTrace = (
	network: TonNetwork,
	trace: TonCenterV3TraceWire
) => {
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
					timestampMs: trace.end_utime * 1_000,
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
}

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
						...tonBlock(block),
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
					select: (page, network) => page.rows.map((transaction) => tonTransaction(network, transaction)),
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
				return resolvePage(context, (limit, pageOffset) => (
					getTonCenterV3CompletedTraces({
						limit,
						offset: pageOffset,
						order: 'desc',
					})
				))
			}),
		})({
			Ton: {
				$$traces: {
					select: (page, network) => page.rows.map((trace) => tonTrace(network, trace)),
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: tonNetworkSelectors(async (network) => {
				assertTonMainnet(network)
				const { getTonCenterV3MasterchainInfo } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
				return tonNetworkTimestamp(
					network,
					(await getTonCenterV3MasterchainInfo()).last
				)
			}),
		})({
			Ton: {
				$$timestamps: {
					select: (timestamp) => [timestamp],
					resolveCount: () => 1,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.TonNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						assertTonMainnet($network)
						if (source !== Source.TonCenter)
							throw new Error(`TON Center v3: unsupported network observation source ${source}`)
						const { getTonCenterV3MasterchainInfo } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						const timestamp = tonNetworkTimestamp(
							$network,
							(await getTonCenterV3MasterchainInfo()).last
						)
						if (timestamp[EntityMetaKey.Selector].timestampMs !== timestampMs)
							throw new Error(`TON Center v3: observation ${timestampMs} is no longer the indexed masterchain head`)

						return timestamp[EntityMetaKey.Fields]
					},
				},
			},
		})({
			masterchainSeqno: (timestamp) => timestamp[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'masterchainSeqno')],
			latestBlockUtimeMs: (timestamp) => timestamp[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'latestBlockUtimeMs')],
		}),

		defineResolver({
			entityType: EntityType.TonBlock,
			resolve: {
				NetworkWorkchainShardPrefixSeqno: {
					resolve: async ({ $network, workchain, shardPrefix, seqno }) => {
						assertTonMainnet($network)
						const { getTonCenterV3BlockByWorkchainShardPrefixSeqno } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return tonBlock(await getTonCenterV3BlockByWorkchainShardPrefixSeqno({
							workchain,
							shardPrefix,
							seqno,
						}))[EntityMetaKey.Fields]
					},
				},
				NetworkRootHashFileHash: {
					resolve: async ({ $network, rootHash, fileHash }) => {
						assertTonMainnet($network)
						const { getTonCenterV3BlockByRootHashFileHash } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return tonBlock(await getTonCenterV3BlockByRootHashFileHash({
							rootHash,
							fileHash,
						}))[EntityMetaKey.Fields]
					},
				},
			},
		})({
			rootHash: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')],
			fileHash: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'fileHash')],
			genUtimeMs: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')],
			startLt: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'startLt')],
			endLt: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'endLt')],
			minRefMcSeqno: (block) => block[entityFieldAddressKey(EntityType.TonBlock, [], 'minRefMcSeqno')],
		}),

		defineResolver({
			entityType: EntityType.TonMessage,
			resolve: {
				NetworkMessageHash: {
					resolve: async ({ $network, messageHash }) => {
						assertTonMainnet($network)
						const { getTonCenterV3MessageByHash } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return tonMessage(
							$network,
							await getTonCenterV3MessageByHash(messageHash)
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			messageKind: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'messageKind')],
			sourceAddress: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'sourceAddress')],
			destinationAddress: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'destinationAddress')],
			valueNano: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'valueNano')],
			createdLt: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'createdLt')],
			opcode: (message) => message[entityFieldAddressKey(EntityType.TonMessage, [], 'opcode')],
		}),

		defineResolver({
			entityType: EntityType.TonTransaction,
			resolve: {
				AccountLt: {
					resolve: async ({ $account, lt }) => {
						assertTonMainnet($account.$network)
						const { getTonCenterV3TransactionByAccountLt } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return tonTransaction(
							$account.$network,
							await getTonCenterV3TransactionByAccountLt({
								account: $account.address,
								logicalTime: lt,
							})
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			nowMs: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'nowMs')],
			origStatus: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'origStatus')],
			endStatus: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'endStatus')],
			transactionKind: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'transactionKind')],
			outMessageCount: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'outMessageCount')],
			totalFeesNano: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'totalFeesNano')],
			previousTransactionHash: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionHash')],
			previousTransactionLt: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionLt')],
			$block: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], '$block')],
			$trace: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], '$trace')],
			$inMessage: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], '$inMessage')],
			$$outMessages: (transaction) => transaction[entityFieldAddressKey(EntityType.TonTransaction, [], '$$outMessages')],
		}),

		defineResolver({
			entityType: EntityType.TonTrace,
			resolve: {
				NetworkTraceIdSource: {
					resolve: async ({ $network, traceId, source }) => {
						assertTonMainnet($network)
						if (source !== Source.TonCenter)
							throw new Error(`TON Center v3: unsupported trace source ${source}`)
						const { getTonCenterV3CompletedTrace } = await import('$/sources/TonCenter/V3/Rest/queries.ts')
						return tonTrace(
							$network,
							await getTonCenterV3CompletedTrace(traceId)
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			$rootMessage: (trace) => trace[entityFieldAddressKey(EntityType.TonTrace, [], '$rootMessage')],
			startedAtMs: (trace) => trace[entityFieldAddressKey(EntityType.TonTrace, [], 'startedAtMs')],
			$$timestamps: (trace) => trace[entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')],
			$$messages: (trace) => trace[entityFieldAddressKey(EntityType.TonTrace, [], '$$messages')],
		}),
		] as const,
	}) satisfies RegisteredSourceResolverModule

export default createTonCenterV3Resolvers()
