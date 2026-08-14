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

const latestNetworkTimestampReference = async (network: NetworkId) => {
	assertFilecoinMainnet(network)
	const overview = await (await import('$/sources/Filfox/Rest/queries.ts')).getOverview()
	const timestampMs = overview.timestamp * 1000
	return [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs,
			source: Source.Filfox_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FilecoinNetwork_Timestamp, [], 'headHeight')]: BigInt(overview.height),
			[entityFieldAddressKey(EntityType.FilecoinNetwork_Timestamp, [], 'headTimestampMs')]: timestampMs,
			...(overview.totalRawBytePower != null && {
				[entityFieldAddressKey(EntityType.FilecoinNetwork_Timestamp, [], 'totalRawBytePower')]: BigInt(overview.totalRawBytePower),
			}),
			...(overview.totalQualityAdjPower != null && {
				[entityFieldAddressKey(EntityType.FilecoinNetwork_Timestamp, [], 'totalQualityAdjustedPower')]: BigInt(overview.totalQualityAdjPower),
			}),
		},
	}]
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
						const {
							getMessage,
							getMessageEvents,
							getMessageSubcalls,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const [
							message,
							events,
							subcalls,
						] = await Promise.all([
							getMessage({
								messageCid: cid,
							}),
							getMessageEvents({
								messageCid: cid,
							}),
							getMessageSubcalls({
								messageCid: cid,
							}),
						])
						const tipsetKey = (
							message.blocks != null && message.blocks.length > 0 ?
								message.blocks.join(',')
							:
								undefined
						)
						const messageSelector = {
							$network,
							cid,
						}
						const transfers = (message.transfers ?? []).map((transfer, index) => ({
							[EntityMetaKey.Selector]: {
								$message: messageSelector,
								index,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FilecoinMessageTransfer, [], '$from')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: transfer.from,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageTransfer, [], '$to')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: transfer.to,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageTransfer, [], 'valueAttoFil')]: BigInt(transfer.value),
								[entityFieldAddressKey(EntityType.FilecoinMessageTransfer, [], 'transferType')]: transfer.type,
							},
						}))
						const tokenTransfers = (message.tokenTransfers ?? []).map((transfer, index) => ({
							[EntityMetaKey.Selector]: {
								$message: messageSelector,
								index,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], '$from')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: transfer.from,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], '$to')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: transfer.to,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'value')]: transfer.value,
								...(transfer.type != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'transferType')]: transfer.type,
								}),
								...(transfer.token != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'token')]: transfer.token,
								}),
								...(transfer.tokenId != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'tokenId')]: transfer.tokenId,
								}),
								...(transfer.tokenName != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'tokenName')]: transfer.tokenName,
								}),
								...(transfer.tokenSymbol != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageTokenTransfer, [], 'tokenSymbol')]: transfer.tokenSymbol,
								}),
							},
						}))
						const eventRows = events.map((event, index) => ({
							[EntityMetaKey.Selector]: {
								$message: messageSelector,
								index,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'address')]: event.address,
								...(event.name != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'name')]: event.name,
								}),
								[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'data')]: event.data,
								[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'topics')]: event.topics,
								...(event.removed != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'removed')]: event.removed,
								}),
								...(event.logIndex != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageEvent, [], 'logIndex')]: event.logIndex,
								}),
							},
						}))
						const subcallRows = subcalls.map((subcall, index) => ({
							[EntityMetaKey.Selector]: {
								$message: messageSelector,
								index,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], '$from')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: subcall.from,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], '$to')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: subcall.to,
									},
								},
								[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'valueAttoFil')]: BigInt(subcall.value),
								[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'method')]: subcall.method,
								...(subcall.methodNumber != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'methodNumber')]: subcall.methodNumber,
								}),
								...(subcall.params != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'params')]: subcall.params,
								}),
								...(subcall.receipt != null && {
									[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'exitCode')]: subcall.receipt.exitCode,
									...(subcall.receipt.return != null && {
										[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'returnData')]: subcall.receipt.return,
									}),
									...(subcall.receipt.gasUsed != null && {
										[entityFieldAddressKey(EntityType.FilecoinMessageSubcall, [], 'gasUsed')]: BigInt(subcall.receipt.gasUsed),
									}),
								}),
							},
						}))
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
							...(
								message.height != null
								&& message.timestamp != null
								&& tipsetKey != null
								&& {
									$$timestamps: [{
										[EntityMetaKey.Selector]: {
											$message: messageSelector,
											timestampMs: message.timestamp * 1000,
											height: BigInt(message.height),
											tipsetKey,
											source: Source.Filfox_Rest,
										},
									}],
								}
							),
							...(
								message.receipt != null
								&& tipsetKey != null
								&& {
									$receipt: {
										[EntityMetaKey.Selector]: {
											$message: messageSelector,
											tipsetKey,
											source: Source.Filfox_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], 'exitCode')]: message.receipt.exitCode,
											...(message.receipt.return != null && {
												[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], 'returnData')]: message.receipt.return,
											}),
											...(message.receipt.gasUsed != null && {
												[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], 'gasUsed')]: BigInt(message.receipt.gasUsed),
											}),
											...(message.height != null && {
												[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], 'height')]: BigInt(message.height),
												[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], '$tipset')]: {
													[EntityMetaKey.Selector]: {
														$network,
														height: BigInt(message.height),
														tipsetKey,
													},
												},
											}),
											...(message.blocks != null && message.blocks[0] != null && {
												[entityFieldAddressKey(EntityType.FilecoinMessageReceipt, [], 'blockCid')]: message.blocks[0],
											}),
										},
									},
								}
							),
							...(message.fee != null && {
								$fee: {
									[EntityMetaKey.Selector]: {
										$message: messageSelector,
										source: Source.Filfox_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FilecoinMessageFee, [], 'baseFeeBurn')]: BigInt(message.fee.baseFeeBurn),
										[entityFieldAddressKey(EntityType.FilecoinMessageFee, [], 'overEstimationBurn')]: BigInt(message.fee.overEstimationBurn),
										[entityFieldAddressKey(EntityType.FilecoinMessageFee, [], 'minerPenalty')]: BigInt(message.fee.minerPenalty),
										[entityFieldAddressKey(EntityType.FilecoinMessageFee, [], 'minerTip')]: BigInt(message.fee.minerTip),
										[entityFieldAddressKey(EntityType.FilecoinMessageFee, [], 'refund')]: BigInt(message.fee.refund),
									},
								},
							}),
							$$transfers: transfers,
							$$tokenTransfers: tokenTransfers,
							$$events: eventRows,
							eventCount: message.eventLogCount ?? eventRows.length,
							$$subcalls: subcallRows,
							subcallCount: message.subcallCount ?? subcallRows.length,
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
			$$timestamps: (snapshot) => snapshot.$$timestamps ?? [],
			$receipt: (snapshot) => snapshot.$receipt,
			$fee: (snapshot) => snapshot.$fee,
			$$transfers: {
				select: (snapshot) => snapshot.$$transfers,
				resolveCount: (snapshot) => snapshot.$$transfers.length,
			},
			$$tokenTransfers: {
				select: (snapshot) => snapshot.$$tokenTransfers,
				resolveCount: (snapshot) => snapshot.$$tokenTransfers.length,
			},
			$$events: {
				select: (snapshot) => snapshot.$$events,
				resolveCount: (snapshot) => snapshot.eventCount,
			},
			$$subcalls: {
				select: (snapshot) => snapshot.$$subcalls,
				resolveCount: (snapshot) => snapshot.subcallCount,
			},
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessage_Timestamp,
			resolve: {
				MessageHeightTipsetKeySource: {
					resolve: async ({
						$message,
						height,
						tipsetKey,
						source,
					}) => {
						assertFilecoinMainnet($message.$network)
						if (source !== Source.Filfox_Rest)
							throw new Error(`Filfox_Rest: unsupported message observation source ${source}`)

						const {
							getMessage,
							getTipset,
						} = await import('$/sources/Filfox/Rest/queries.ts')
						const [
							message,
							tipset,
						] = await Promise.all([
							getMessage({
								messageCid: $message.cid,
							}),
							getTipset({
								height,
							}),
						])
						if (
							message.height == null
							|| message.timestamp == null
							|| message.blocks == null
							|| message.blocks.length < 1
						)
							throw new Error(`Filfox_Rest: message ${$message.cid} missing inclusion observation`)

						const messageTipsetKey = message.blocks.join(',')
						if (
							BigInt(message.height) !== height
							|| messageTipsetKey !== tipsetKey
							|| BigInt(tipset.height) !== height
							|| tipsetKeyFromBlocks(tipset.blocks) !== tipsetKey
						)
							throw new Error(`Filfox_Rest: message observation tipset does not match ${height.toString()}/${tipsetKey}`)

						return {
							timestampMs: message.timestamp * 1000,
							height,
							tipsetKey,
							source,
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									height,
									tipsetKey,
								},
							},
							blockCids: message.blocks,
						}
					},
				},
			},
		})({
			timestampMs: (timestamp) => timestamp.timestampMs,
			height: (timestamp) => timestamp.height,
			tipsetKey: (timestamp) => timestamp.tipsetKey,
			source: (timestamp) => timestamp.source,
			$tipset: (timestamp) => timestamp.$tipset,
			blockCids: (timestamp) => timestamp.blockCids,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageReceipt,
			resolve: {
				MessageTipsetKeySource: {
					resolve: async ({
						$message,
						tipsetKey,
						source,
					}) => {
						assertFilecoinMainnet($message.$network)
						if (source !== Source.Filfox_Rest)
							throw new Error(`Filfox_Rest: unsupported message receipt source ${source}`)

						const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
						const message = await getMessage({
							messageCid: $message.cid,
						})
						if (message.receipt == null)
							throw new Error(`Filfox_Rest: message ${$message.cid} missing receipt`)

						if (
							message.blocks == null
							|| message.blocks.length < 1
							|| message.blocks.join(',') !== tipsetKey
						)
							throw new Error(`Filfox_Rest: message receipt tipset does not match ${tipsetKey}`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							tipsetKey,
							source,
							...(message.height != null && {
								height: BigInt(message.height),
								$tipset: {
									[EntityMetaKey.Selector]: {
										$network: $message.$network,
										height: BigInt(message.height),
										tipsetKey,
									},
								},
							}),
							blockCid: message.blocks[0],
							exitCode: message.receipt.exitCode,
							...(message.receipt.return != null && {
								returnData: message.receipt.return,
							}),
							...(message.receipt.gasUsed != null && {
								gasUsed: BigInt(message.receipt.gasUsed),
							}),
						}
					},
				},
			},
		})({
			$message: (receipt) => receipt.$message,
			tipsetKey: (receipt) => receipt.tipsetKey,
			source: (receipt) => receipt.source,
			$tipset: (receipt) => receipt.$tipset,
			height: (receipt) => receipt.height,
			blockCid: (receipt) => receipt.blockCid,
			exitCode: (receipt) => receipt.exitCode,
			returnData: (receipt) => receipt.returnData,
			gasUsed: (receipt) => receipt.gasUsed,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageFee,
			resolve: {
				MessageSource: {
					resolve: async ({
						$message,
						source,
					}) => {
						assertFilecoinMainnet($message.$network)
						if (source !== Source.Filfox_Rest)
							throw new Error(`Filfox_Rest: unsupported message fee source ${source}`)

						const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
						const message = await getMessage({
							messageCid: $message.cid,
						})
						if (message.fee == null)
							throw new Error(`Filfox_Rest: message ${$message.cid} missing fee`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							source,
							baseFeeBurn: BigInt(message.fee.baseFeeBurn),
							overEstimationBurn: BigInt(message.fee.overEstimationBurn),
							minerPenalty: BigInt(message.fee.minerPenalty),
							minerTip: BigInt(message.fee.minerTip),
							refund: BigInt(message.fee.refund),
						}
					},
				},
			},
		})({
			$message: (fee) => fee.$message,
			source: (fee) => fee.source,
			baseFeeBurn: (fee) => fee.baseFeeBurn,
			overEstimationBurn: (fee) => fee.overEstimationBurn,
			minerPenalty: (fee) => fee.minerPenalty,
			minerTip: (fee) => fee.minerTip,
			refund: (fee) => fee.refund,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageTransfer,
			resolve: {
				MessageIndex: {
					resolve: async ({
						$message,
						index,
					}) => {
						assertFilecoinMainnet($message.$network)
						const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
						const transfer = (await getMessage({
							messageCid: $message.cid,
						})).transfers?.[index]
						if (transfer == null)
							throw new Error(`Filfox_Rest: message transfer not found for ${$message.cid}:${String(index)}`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							index,
							$from: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: transfer.from,
								},
							},
							$to: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: transfer.to,
								},
							},
							valueAttoFil: BigInt(transfer.value),
							transferType: transfer.type,
						}
					},
				},
			},
		})({
			$message: (transfer) => transfer.$message,
			index: (transfer) => transfer.index,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			valueAttoFil: (transfer) => transfer.valueAttoFil,
			transferType: (transfer) => transfer.transferType,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageTokenTransfer,
			resolve: {
				MessageIndex: {
					resolve: async ({
						$message,
						index,
					}) => {
						assertFilecoinMainnet($message.$network)
						const { getMessage } = await import('$/sources/Filfox/Rest/queries.ts')
						const transfer = (await getMessage({
							messageCid: $message.cid,
						})).tokenTransfers?.[index]
						if (transfer == null)
							throw new Error(`Filfox_Rest: message token transfer not found for ${$message.cid}:${String(index)}`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							index,
							$from: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: transfer.from,
								},
							},
							$to: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: transfer.to,
								},
							},
							value: transfer.value,
							...(transfer.type != null && {
								transferType: transfer.type,
							}),
							...(transfer.token != null && {
								token: transfer.token,
							}),
							...(transfer.tokenId != null && {
								tokenId: transfer.tokenId,
							}),
							...(transfer.tokenName != null && {
								tokenName: transfer.tokenName,
							}),
							...(transfer.tokenSymbol != null && {
								tokenSymbol: transfer.tokenSymbol,
							}),
						}
					},
				},
			},
		})({
			$message: (transfer) => transfer.$message,
			index: (transfer) => transfer.index,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			value: (transfer) => transfer.value,
			transferType: (transfer) => transfer.transferType,
			token: (transfer) => transfer.token,
			tokenId: (transfer) => transfer.tokenId,
			tokenName: (transfer) => transfer.tokenName,
			tokenSymbol: (transfer) => transfer.tokenSymbol,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageEvent,
			resolve: {
				MessageIndex: {
					resolve: async ({
						$message,
						index,
					}) => {
						assertFilecoinMainnet($message.$network)
						const { getMessageEvents } = await import('$/sources/Filfox/Rest/queries.ts')
						const event = (await getMessageEvents({
							messageCid: $message.cid,
						}))[index]
						if (event == null)
							throw new Error(`Filfox_Rest: message event not found for ${$message.cid}:${String(index)}`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							index,
							address: event.address,
							...(event.name != null && {
								name: event.name,
							}),
							data: event.data,
							topics: event.topics,
							...(event.removed != null && {
								removed: event.removed,
							}),
							...(event.logIndex != null && {
								logIndex: event.logIndex,
							}),
						}
					},
				},
			},
		})({
			$message: (event) => event.$message,
			index: (event) => event.index,
			address: (event) => event.address,
			name: (event) => event.name,
			data: (event) => event.data,
			topics: (event) => event.topics,
			removed: (event) => event.removed,
			logIndex: (event) => event.logIndex,
		}),

		defineResolver({
			entityType: EntityType.FilecoinMessageSubcall,
			resolve: {
				MessageIndex: {
					resolve: async ({
						$message,
						index,
					}) => {
						assertFilecoinMainnet($message.$network)
						const { getMessageSubcalls } = await import('$/sources/Filfox/Rest/queries.ts')
						const subcall = (await getMessageSubcalls({
							messageCid: $message.cid,
						}))[index]
						if (subcall == null)
							throw new Error(`Filfox_Rest: message subcall not found for ${$message.cid}:${String(index)}`)

						return {
							$message: {
								[EntityMetaKey.Selector]: $message,
							},
							index,
							$from: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: subcall.from,
								},
							},
							$to: {
								[EntityMetaKey.Selector]: {
									$network: $message.$network,
									address: subcall.to,
								},
							},
							valueAttoFil: BigInt(subcall.value),
							method: subcall.method,
							...(subcall.methodNumber != null && {
								methodNumber: subcall.methodNumber,
							}),
							...(subcall.params != null && {
								params: subcall.params,
							}),
							...(subcall.receipt != null && {
								exitCode: subcall.receipt.exitCode,
								...(subcall.receipt.return != null && {
									returnData: subcall.receipt.return,
								}),
								...(subcall.receipt.gasUsed != null && {
									gasUsed: BigInt(subcall.receipt.gasUsed),
								}),
							}),
						}
					},
				},
			},
		})({
			$message: (subcall) => subcall.$message,
			index: (subcall) => subcall.index,
			$from: (subcall) => subcall.$from,
			$to: (subcall) => subcall.$to,
			valueAttoFil: (subcall) => subcall.valueAttoFil,
			method: (subcall) => subcall.method,
			methodNumber: (subcall) => subcall.methodNumber,
			params: (subcall) => subcall.params,
			exitCode: (subcall) => subcall.exitCode,
			returnData: (subcall) => subcall.returnData,
			gasUsed: (subcall) => subcall.gasUsed,
		}),

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }, context) => {
						assertFilecoinMainnet($network)
						const { getBlockMessages } = await import('$/sources/Filfox/Rest/queries.ts')
						const pageSize = resolverContextRowLimit(context)
						const continuationMatch = context.providerContinuationToken == null ?
							undefined
						:
							/^(\d+):(\d+)$/.exec(context.providerContinuationToken)
						if (
							context.providerContinuationToken != null
							&& (
								continuationMatch == null
								|| Number(continuationMatch[2]) !== pageSize
								|| !Number.isSafeInteger(Number(continuationMatch[1]))
							)
						)
							throw new Error('Filfox_Rest: invalid block messages continuation')

						const pageNumber = continuationMatch == null ? 0 : Number(continuationMatch[1])
						const page = await getBlockMessages({
							blockCid: cid,
							page: pageNumber,
							pageSize,
						})
						return {
							blockCid: cid,
							messageCount: page.totalCount,
							pageNumber,
							pageSize,
							messages: page.messages.map((message) => ({
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
									...(message.nonce != null && {
										[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'nonce')]: BigInt(message.nonce),
									}),
									[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'valueAttoFil')]: BigInt(message.value),
									...(message.methodNumber != null && {
										[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'method')]: message.methodNumber,
									}),
									...(message.gasLimit != null && {
										[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'gasLimit')]: BigInt(message.gasLimit),
									}),
								},
							})),
						}
					},
				},
			},
		})({
			$$messages: {
				select: (snapshot) => snapshot.messages,
				resolveCount: (snapshot) => snapshot.messageCount,
				continuation: (snapshot) => (
					snapshot.messages.length === 0
					|| snapshot.pageNumber * snapshot.pageSize + snapshot.messages.length >= snapshot.messageCount ?
						{
							operation: 'block-messages',
							target: snapshot.blockCid,
							terminal: true,
						}
					:
						{
							operation: 'block-messages',
							target: snapshot.blockCid,
							terminal: false,
							token: `${(snapshot.pageNumber + 1).toString()}:${snapshot.pageSize.toString()}`,
						}
				),
			},
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
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => latestNetworkTimestampReference($network),
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: latestNetworkTimestampReference,
				},
			},
		})({
			Filecoin: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
