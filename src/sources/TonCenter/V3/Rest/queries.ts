import { type as arktype, type Type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	tonCenterV3Hash,
	tonCenterV3NonnegativeInt64,
	tonCenterV3NonnegativeInteger,
	tonCenterV3NonnegativeSafeInteger,
	tonCenterV3RawAddress,
	tonCenterV3Shard,
} from '$/sources/TonCenter/V3/Rest/normalization.ts'
import type {
	TonCenterV3Block,
	TonCenterV3BlocksWire,
	TonCenterV3BlockWire,
	TonCenterV3Message,
	TonCenterV3MessagesWire,
	TonCenterV3MessageWire,
	TonCenterV3JettonMaster,
	TonCenterV3JettonMastersWire,
	TonCenterV3JettonMasterWire,
	TonCenterV3NftCollection,
	TonCenterV3NftCollectionsWire,
	TonCenterV3NftCollectionWire,
	TonCenterV3NftItem,
	TonCenterV3NftItemsWire,
	TonCenterV3NftItemWire,
	TonCenterV3Order,
	TonCenterV3Page,
	TonCenterV3Trace,
	TonCenterV3TracesWire,
	TonCenterV3TraceWire,
	TonCenterV3Transaction,
	TonCenterV3TransactionsWire,
	TonCenterV3TransactionWire,
} from '$/sources/TonCenter/V3/Rest/types.ts'

const decimalString = /^(?:0|[1-9]\d*)$/
const signedInt32Maximum = (2 ** 31) - 1

const tonCenterV3Block = arktype({
	workchain: 'number.integer',
	shard: 'string',
	seqno: 'number.integer >= 0',
	root_hash: 'string',
	file_hash: 'string',
	gen_utime: 'string',
	start_lt: 'string',
	end_lt: 'string',
	tx_count: 'number.integer >= 0',
}) satisfies Type<TonCenterV3BlockWire>

const tonCenterV3Blocks = arktype({
	blocks: tonCenterV3Block.array(),
}) satisfies Type<TonCenterV3BlocksWire>

const tonCenterV3Message = arktype({
	hash: 'string',
	'source?': 'string | null',
	'destination?': 'string | null',
	created_at: 'string',
	created_lt: 'string',
	value: 'string',
	fwd_fee: 'string',
	'ihr_fee?': 'string',
	import_fee: 'string',
	'opcode?': 'number.integer',
	'in_msg_tx_hash?': 'string',
	'out_msg_tx_hash?': 'string',
}) satisfies Type<TonCenterV3MessageWire>

const tonCenterV3Messages = arktype({
	messages: tonCenterV3Message.array(),
}) satisfies Type<TonCenterV3MessagesWire>

const tonCenterV3Trace = arktype({
	trace_id: 'string',
	'external_hash?': 'string',
	start_lt: 'string',
	end_lt: 'string',
	start_utime: 'number.integer >= 0',
	end_utime: 'number.integer >= 0',
	mc_seqno_start: 'string',
	mc_seqno_end: 'string',
	is_incomplete: 'boolean',
	trace: {
		in_msg_hash: 'string',
		in_msg: tonCenterV3Message,
		'tx_hash?': 'string',
	},
	transactions_order: 'string[]',
	trace_info: {
		messages: 'number.integer >= 0',
		pending_messages: 'number.integer >= 0',
		transactions: 'number.integer >= 0',
	},
}) satisfies Type<TonCenterV3TraceWire>

const tonCenterV3Traces = arktype({
	traces: tonCenterV3Trace.array(),
}) satisfies Type<TonCenterV3TracesWire>

const tonCenterV3Transaction = arktype({
	account: 'string',
	hash: 'string',
	lt: 'string',
	block_ref: {
		workchain: 'number.integer',
		shard: 'string',
		seqno: 'number.integer >= 0',
	},
	now: 'number.integer >= 0',
	total_fees: 'string',
	prev_trans_hash: 'string',
	prev_trans_lt: 'string',
	orig_status: 'string',
	end_status: 'string',
	description: {
		type: 'string',
		aborted: 'boolean',
		destroyed: 'boolean',
	},
	'account_state_before?': {
		balance: 'string',
	},
	'account_state_after?': {
		balance: 'string',
	},
	'in_msg?': tonCenterV3Message.or('null'),
	out_msgs: tonCenterV3Message.array(),
	'trace_id?': 'string',
	'trace_external_hash?': 'string',
}) satisfies Type<TonCenterV3TransactionWire>

const tonCenterV3Transactions = arktype({
	transactions: tonCenterV3Transaction.array(),
}) satisfies Type<TonCenterV3TransactionsWire>

const tonCenterV3Content = arktype({
	'[string]': 'unknown',
	'uri?': 'string',
})

const tonCenterV3JettonMaster = arktype({
	address: 'string',
	'admin_address?': 'string',
	'code_hash?': 'string',
	'data_hash?': 'string',
	'jetton_content?': tonCenterV3Content,
	'jetton_wallet_code_hash?': 'string',
	'last_transaction_lt?': 'string',
	'mintable?': 'boolean',
	'total_supply?': 'string',
}) satisfies Type<TonCenterV3JettonMasterWire>

const tonCenterV3JettonMasters = arktype({
	jetton_masters: tonCenterV3JettonMaster.array(),
}) satisfies Type<TonCenterV3JettonMastersWire>

const tonCenterV3NftCollection = arktype({
	address: 'string',
	'code_hash?': 'string',
	'collection_content?': tonCenterV3Content,
	'data_hash?': 'string',
	'last_transaction_lt?': 'string',
	'next_item_index?': 'string',
	'owner_address?': 'string',
}) satisfies Type<TonCenterV3NftCollectionWire>

const tonCenterV3NftCollections = arktype({
	nft_collections: tonCenterV3NftCollection.array(),
}) satisfies Type<TonCenterV3NftCollectionsWire>

const tonCenterV3NftItem = arktype({
	address: 'string',
	'auction_contract_address?': 'string',
	'code_hash?': 'string',
	'collection?': tonCenterV3NftCollection,
	'collection_address?': 'string',
	'content?': tonCenterV3Content,
	'data_hash?': 'string',
	'index?': 'string',
	'init?': 'boolean',
	'last_transaction_lt?': 'string',
	'on_sale?': 'boolean',
	'owner_address?': 'string',
	'real_owner?': 'string',
	'sale_contract_address?': 'string',
}) satisfies Type<TonCenterV3NftItemWire>

const tonCenterV3NftItems = arktype({
	nft_items: tonCenterV3NftItem.array(),
}) satisfies Type<TonCenterV3NftItemsWire>

const assertTonCenterV3Binding = (binding: SourceBinding) => {
	if (
		binding.provider !== SourceProvider.TonCenter
		|| binding.source !== Source.TonCenter_V3_Rest
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'ton:-239'
		|| binding.wireProtocol !== WireProtocol.HttpRest
		|| binding.apiFamily !== ApiFamily.RestJson
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericRead)
		|| binding.delivery !== SourceDelivery.HttpProxy
		|| binding.proxyId == null
		|| binding.credentials.length !== 1
		|| binding.credentials[0]?.scope !== SourceCredentialScope.None
		|| binding.endpoints.length !== 1
		|| binding.endpoints[0]?.endpointKind !== SourceEndpointKind.HttpUrl
		|| binding.endpoints[0].locator !== 'https://toncenter.com/api/v3/'
		|| binding.endpoints[0].origin !== 'https://toncenter.com'
		|| binding.endpoints[0].corsEnabled !== false
	)
		throw new Error('TonCenter_V3_Rest: expected canonical TON mainnet v3 binding')
}

const pageParameters = ({
	limit,
	offset,
	order,
}: {
	limit: number
	offset: number
	order?: TonCenterV3Order
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error('TonCenter_V3_Rest: limit must be an integer from 1 through 1000')
	if (!Number.isSafeInteger(offset) || offset < 0 || offset > signedInt32Maximum)
		throw new Error('TonCenter_V3_Rest: offset must be a nonnegative int32')
	if (offset + limit > signedInt32Maximum)
		throw new Error('TonCenter_V3_Rest: page exceeds int32 offset bounds')

	return new URLSearchParams({
		limit: String(limit),
		offset: String(offset),
		...(order != null && {
			sort: order,
		}),
	})
}

const page = <_Row>(
	binding: SourceBinding,
	rows: _Row[],
	limit: number,
	offset: number
): TonCenterV3Page<_Row> => {
	if (rows.length > limit)
		throw new Error('TonCenter_V3_Rest: response exceeds requested limit')

	return {
		source: binding.source,
		target: 'ton:-239',
		rows,
		...(rows.length === limit && {
			nextOffset: offset + rows.length,
		}),
	}
}

const assertOrdered = (
	previous: bigint | number | undefined,
	current: bigint | number,
	order: TonCenterV3Order,
	rows: string
) => {
	if (
		previous != null
		&& (
			order === 'desc' ?
				current > previous
			:
				current < previous
		)
	)
		throw new Error(`TonCenter_V3_Rest: ${rows} are not ${order === 'desc' ? 'newest' : 'oldest'}-first`)
}

const message = (wire: TonCenterV3MessageWire): TonCenterV3Message => {
	if (
		!decimalString.test(wire.created_at)
		|| !Number.isSafeInteger(Number(wire.created_at))
		|| Number(wire.created_at) < 0
	)
		throw new Error('TonCenter_V3_Rest: malformed message creation time')
	if (
		wire.opcode != null
		&& (
			!Number.isSafeInteger(wire.opcode)
			|| wire.opcode < -(2 ** 31)
			|| wire.opcode > 2 ** 31 - 1
		)
	)
		throw new Error('TonCenter_V3_Rest: malformed message opcode')

	return {
		hash: tonCenterV3Hash(wire.hash, 'message hash'),
		...(wire.source != null && {
			source: tonCenterV3RawAddress(wire.source),
		}),
		...(wire.destination != null && {
			destination: tonCenterV3RawAddress(wire.destination),
		}),
		createdAtSeconds: Number(wire.created_at),
		createdLt: tonCenterV3NonnegativeInt64(wire.created_lt, 'message logical time'),
		valueNano: tonCenterV3NonnegativeInt64(wire.value, 'message value'),
		forwardFeeNano: tonCenterV3NonnegativeInt64(wire.fwd_fee, 'message forward fee'),
		...(wire.ihr_fee != null && {
			ihrFeeNano: tonCenterV3NonnegativeInt64(wire.ihr_fee, 'message IHR fee'),
		}),
		importFeeNano: tonCenterV3NonnegativeInt64(wire.import_fee, 'message import fee'),
		...(wire.opcode != null && {
			opcode: wire.opcode,
		}),
		...(wire.in_msg_tx_hash != null && {
			inboundTransactionHash: tonCenterV3Hash(wire.in_msg_tx_hash, 'inbound transaction hash'),
		}),
		...(wire.out_msg_tx_hash != null && {
			outboundTransactionHash: tonCenterV3Hash(wire.out_msg_tx_hash, 'outbound transaction hash'),
		}),
	}
}

const nftCollection = (wire: TonCenterV3NftCollectionWire): TonCenterV3NftCollection => ({
	address: tonCenterV3RawAddress(wire.address),
	...(wire.code_hash != null && {
		codeHash: tonCenterV3Hash(wire.code_hash, 'NFT collection code hash'),
	}),
	...(wire.collection_content != null && {
		content: wire.collection_content,
		...(wire.collection_content.uri != null && {
			metadataUri: wire.collection_content.uri,
		}),
	}),
	...(wire.data_hash != null && {
		dataHash: tonCenterV3Hash(wire.data_hash, 'NFT collection data hash'),
	}),
	...(wire.last_transaction_lt != null && {
		lastTransactionLogicalTime: tonCenterV3NonnegativeInt64(
			wire.last_transaction_lt,
			'NFT collection last transaction logical time'
		),
	}),
	...(wire.next_item_index != null && {
		nextItemIndex: tonCenterV3NonnegativeInteger(
			wire.next_item_index,
			'NFT collection next item index'
		),
	}),
	...(wire.owner_address != null && {
		ownerAddress: tonCenterV3RawAddress(wire.owner_address),
	}),
})

export const getTonCenterV3Blocks = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3Blocks.assert(await getJson<unknown>(
		binding,
		`blocks?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const hashIdentities = new Set<string>()
	let previousGenerationTime: number | undefined
	const rows = wire.blocks.map((block): TonCenterV3Block => {
		const workchain = block.workchain
		if (!Number.isSafeInteger(workchain) || workchain < -(2 ** 31) || workchain > 2 ** 31 - 1)
			throw new Error('TonCenter_V3_Rest: malformed block workchain')
		const seqno = tonCenterV3NonnegativeSafeInteger(block.seqno, 'block seqno')
		const shard = tonCenterV3Shard(block.shard)
		const identity = `${workchain}:${shard}:${seqno}`
		if (identities.has(identity))
			throw new Error('TonCenter_V3_Rest: duplicate block identity')
		identities.add(identity)
		if (
			!decimalString.test(block.gen_utime)
			|| !Number.isSafeInteger(Number(block.gen_utime))
		)
			throw new Error('TonCenter_V3_Rest: malformed block generation time')

		const rootHash = tonCenterV3Hash(block.root_hash, 'block root hash')
		const fileHash = tonCenterV3Hash(block.file_hash, 'block file hash')
		const hashIdentity = `${rootHash}:${fileHash}`
		if (hashIdentities.has(hashIdentity))
			throw new Error('TonCenter_V3_Rest: duplicate block hash identity')
		hashIdentities.add(hashIdentity)
		const genUtimeSeconds = Number(block.gen_utime)
		assertOrdered(previousGenerationTime, genUtimeSeconds, options.order, 'blocks')
		previousGenerationTime = genUtimeSeconds

		return {
			workchain,
			shard,
			seqno,
			rootHash,
			fileHash,
			genUtimeSeconds,
			startLt: tonCenterV3NonnegativeInt64(block.start_lt, 'block start logical time'),
			endLt: tonCenterV3NonnegativeInt64(block.end_lt, 'block end logical time'),
			transactionCount: tonCenterV3NonnegativeSafeInteger(block.tx_count, 'block transaction count'),
		}
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3Messages = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3Messages.assert(await getJson<unknown>(
		binding,
		`messages?${parameters.toString()}`
	))
	const identities = new Set<string>()
	let previousLogicalTime: bigint | undefined
	const rows = wire.messages.map((wireMessage) => {
		const normalizedMessage = message(wireMessage)
		if (identities.has(normalizedMessage.hash))
			throw new Error('TonCenter_V3_Rest: duplicate message identity')
		identities.add(normalizedMessage.hash)
		assertOrdered(previousLogicalTime, normalizedMessage.createdLt, options.order, 'messages')
		previousLogicalTime = normalizedMessage.createdLt
		return normalizedMessage
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3CompletedTraces = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3Traces.assert(await getJson<unknown>(
		binding,
		`traces?${parameters.toString()}`
	))
	const identities = new Set<string>()
	let previousLogicalTime: bigint | undefined
	const rows = wire.traces.map((trace): TonCenterV3Trace => {
		if (trace.is_incomplete || trace.trace_info.pending_messages !== 0)
			throw new Error('TonCenter_V3_Rest: trace is incomplete')
		const traceId = tonCenterV3Hash(trace.trace_id, 'trace ID')
		const rootMessage = message(trace.trace.in_msg)
		if (
			tonCenterV3Hash(trace.trace.in_msg_hash, 'root message hash') !== rootMessage.hash
			|| traceId !== rootMessage.hash
		)
			throw new Error('TonCenter_V3_Rest: trace root message identity mismatch')
		if (identities.has(traceId))
			throw new Error('TonCenter_V3_Rest: duplicate trace identity')
		identities.add(traceId)
		const transactionHashes = trace.transactions_order.map((hash) => (
			tonCenterV3Hash(hash, 'trace transaction hash')
		))
		if (new Set(transactionHashes).size !== transactionHashes.length)
			throw new Error('TonCenter_V3_Rest: duplicate trace transaction identity')
		if (trace.trace_info.transactions !== transactionHashes.length)
			throw new Error('TonCenter_V3_Rest: trace transaction count mismatch')

		const endLt = tonCenterV3NonnegativeInt64(trace.end_lt, 'trace end logical time')
		assertOrdered(previousLogicalTime, endLt, options.order, 'traces')
		previousLogicalTime = endLt

		return {
			traceId,
			...(trace.external_hash != null && {
				externalHash: tonCenterV3Hash(trace.external_hash, 'trace external hash'),
			}),
			startLt: tonCenterV3NonnegativeInt64(trace.start_lt, 'trace start logical time'),
			endLt,
			startUtimeSeconds: tonCenterV3NonnegativeSafeInteger(trace.start_utime, 'trace start time'),
			endUtimeSeconds: tonCenterV3NonnegativeSafeInteger(trace.end_utime, 'trace end time'),
			masterchainStartSeqno: tonCenterV3NonnegativeInt64(trace.mc_seqno_start, 'trace start masterchain seqno'),
			masterchainEndSeqno: tonCenterV3NonnegativeInt64(trace.mc_seqno_end, 'trace end masterchain seqno'),
			rootMessage,
			transactionHashes,
			messageCount: tonCenterV3NonnegativeSafeInteger(trace.trace_info.messages, 'trace message count'),
			transactionCount: tonCenterV3NonnegativeSafeInteger(trace.trace_info.transactions, 'trace transaction count'),
		}
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3Transactions = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3Transactions.assert(await getJson<unknown>(
		binding,
		`transactions?${parameters.toString()}`
	))
	const accountLogicalTimeIdentities = new Map<string, string>()
	let previousLogicalTime: bigint | undefined
	const rows = wire.transactions.map((transaction): TonCenterV3Transaction => {
		const account = tonCenterV3RawAddress(transaction.account)
		const logicalTime = tonCenterV3NonnegativeInt64(transaction.lt, 'transaction logical time')
		const hash = tonCenterV3Hash(transaction.hash, 'transaction hash')
		const identity = `${account}:${logicalTime}`
		const existingHash = accountLogicalTimeIdentities.get(identity)
		if (existingHash != null)
			throw new Error(
				existingHash === hash ?
					'TonCenter_V3_Rest: duplicate transaction identity'
				:
					'TonCenter_V3_Rest: conflicting transaction hash identity'
			)
		accountLogicalTimeIdentities.set(identity, hash)
		assertOrdered(previousLogicalTime, logicalTime, options.order, 'transactions')
		previousLogicalTime = logicalTime

		const inboundMessage = transaction.in_msg == null ?
			undefined
		:
			message(transaction.in_msg)
		const outboundMessages = transaction.out_msgs.map(message)
		if (
			inboundMessage != null
			&& (
				(inboundMessage.destination != null && inboundMessage.destination !== account)
				|| (
					inboundMessage.inboundTransactionHash != null
					&& inboundMessage.inboundTransactionHash !== hash
				)
			)
		)
			throw new Error('TonCenter_V3_Rest: transaction has a foreign inbound message')
		if (outboundMessages.some((outboundMessage) => (
			(outboundMessage.source != null && outboundMessage.source !== account)
			|| (
				outboundMessage.outboundTransactionHash != null
				&& outboundMessage.outboundTransactionHash !== hash
			)
		)))
			throw new Error('TonCenter_V3_Rest: transaction has a foreign outbound message')

		const workchain = transaction.block_ref.workchain
		if (!Number.isSafeInteger(workchain) || workchain < -(2 ** 31) || workchain > 2 ** 31 - 1)
			throw new Error('TonCenter_V3_Rest: malformed transaction block workchain')

		return {
			account,
			logicalTime,
			hash,
			block: {
				workchain,
				shard: tonCenterV3Shard(transaction.block_ref.shard),
				seqno: tonCenterV3NonnegativeSafeInteger(transaction.block_ref.seqno, 'transaction block seqno'),
			},
			timestampSeconds: tonCenterV3NonnegativeSafeInteger(transaction.now, 'transaction timestamp'),
			totalFeesNano: tonCenterV3NonnegativeInt64(transaction.total_fees, 'transaction total fees'),
			previousTransactionHash: tonCenterV3Hash(transaction.prev_trans_hash, 'previous transaction hash'),
			previousTransactionLogicalTime: tonCenterV3NonnegativeInt64(transaction.prev_trans_lt, 'previous transaction logical time'),
			originalStatus: transaction.orig_status,
			endStatus: transaction.end_status,
			transactionKind: transaction.description.type,
			aborted: transaction.description.aborted,
			destroyed: transaction.description.destroyed,
			...(transaction.account_state_before != null && {
				balanceBeforeNano: tonCenterV3NonnegativeInt64(
					transaction.account_state_before.balance,
					'transaction balance before'
				),
			}),
			...(transaction.account_state_after != null && {
				balanceAfterNano: tonCenterV3NonnegativeInt64(
					transaction.account_state_after.balance,
					'transaction balance after'
				),
			}),
			...(inboundMessage != null && {
				inboundMessage,
			}),
			outboundMessages,
			...(transaction.trace_id != null && {
				traceId: tonCenterV3Hash(transaction.trace_id, 'transaction trace ID'),
			}),
			...(transaction.trace_external_hash != null && {
				traceExternalHash: tonCenterV3Hash(transaction.trace_external_hash, 'transaction trace external hash'),
			}),
		}
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3JettonMasters = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3JettonMasters.assert(await getJson<unknown>(
		binding,
		`jetton/masters?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const rows = wire.jetton_masters.map((master): TonCenterV3JettonMaster => {
		const address = tonCenterV3RawAddress(master.address)
		if (identities.has(address))
			throw new Error('TonCenter_V3_Rest: duplicate jetton master identity')
		identities.add(address)

		return {
			address,
			...(master.admin_address != null && {
				adminAddress: tonCenterV3RawAddress(master.admin_address),
			}),
			...(master.code_hash != null && {
				codeHash: tonCenterV3Hash(master.code_hash, 'jetton master code hash'),
			}),
			...(master.data_hash != null && {
				dataHash: tonCenterV3Hash(master.data_hash, 'jetton master data hash'),
			}),
			...(master.jetton_content != null && {
				content: master.jetton_content,
				...(master.jetton_content.uri != null && {
					metadataUri: master.jetton_content.uri,
				}),
			}),
			...(master.jetton_wallet_code_hash != null && {
				walletCodeHash: tonCenterV3Hash(
					master.jetton_wallet_code_hash,
					'jetton wallet code hash'
				),
			}),
			...(master.last_transaction_lt != null && {
				lastTransactionLogicalTime: tonCenterV3NonnegativeInt64(
					master.last_transaction_lt,
					'jetton master last transaction logical time'
				),
			}),
			...(master.mintable != null && {
				mintable: master.mintable,
			}),
			...(master.total_supply != null && {
				totalSupplyUnits: tonCenterV3NonnegativeInteger(
					master.total_supply,
					'jetton total supply'
				),
			}),
		}
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3NftCollections = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3NftCollections.assert(await getJson<unknown>(
		binding,
		`nft/collections?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const rows = wire.nft_collections.map((collection) => {
		const normalizedCollection = nftCollection(collection)
		if (identities.has(normalizedCollection.address))
			throw new Error('TonCenter_V3_Rest: duplicate NFT collection identity')
		identities.add(normalizedCollection.address)
		return normalizedCollection
	})

	return page(binding, rows, options.limit, options.offset)
}

export const getTonCenterV3NftItems = async (
	binding: SourceBinding,
	options: {
		limit: number
		offset: number
	}
) => {
	assertTonCenterV3Binding(binding)
	const parameters = pageParameters(options)
	const wire = tonCenterV3NftItems.assert(await getJson<unknown>(
		binding,
		`nft/items?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const collectionItemIdentities = new Set<string>()
	const rows = wire.nft_items.map((item): TonCenterV3NftItem => {
		const address = tonCenterV3RawAddress(item.address)
		if (identities.has(address))
			throw new Error('TonCenter_V3_Rest: duplicate NFT item identity')
		identities.add(address)
		const collection = item.collection == null ?
			undefined
			:
			nftCollection(item.collection)
		const explicitCollectionAddress = item.collection_address == null ?
			undefined
			:
			tonCenterV3RawAddress(item.collection_address)
		if (
			collection != null
			&& explicitCollectionAddress != null
			&& collection.address !== explicitCollectionAddress
		)
			throw new Error('TonCenter_V3_Rest: NFT item has a foreign embedded collection')
		const collectionAddress = explicitCollectionAddress ?? collection?.address
		const index = item.index == null ?
			undefined
			:
			tonCenterV3NonnegativeInteger(item.index, 'NFT item index')
		if (collectionAddress != null && index != null) {
			const collectionItemIdentity = `${collectionAddress}:${index}`
			if (collectionItemIdentities.has(collectionItemIdentity))
				throw new Error('TonCenter_V3_Rest: duplicate NFT collection item identity')
			collectionItemIdentities.add(collectionItemIdentity)
		}

		return {
			address,
			...(item.auction_contract_address != null && {
				auctionContractAddress: tonCenterV3RawAddress(item.auction_contract_address),
			}),
			...(item.code_hash != null && {
				codeHash: tonCenterV3Hash(item.code_hash, 'NFT item code hash'),
			}),
			...(collection != null && {
				collection,
			}),
			...(collectionAddress != null && {
				collectionAddress,
			}),
			...(item.content != null && {
				content: item.content,
				...(item.content.uri != null && {
					metadataUri: item.content.uri,
				}),
			}),
			...(item.data_hash != null && {
				dataHash: tonCenterV3Hash(item.data_hash, 'NFT item data hash'),
			}),
			...(index != null && {
				index,
			}),
			...(item.init != null && {
				initialized: item.init,
			}),
			...(item.last_transaction_lt != null && {
				lastTransactionLogicalTime: tonCenterV3NonnegativeInt64(
					item.last_transaction_lt,
					'NFT item last transaction logical time'
				),
			}),
			...(item.on_sale != null && {
				onSale: item.on_sale,
			}),
			...(item.owner_address != null && {
				ownerAddress: tonCenterV3RawAddress(item.owner_address),
			}),
			...(item.real_owner != null && {
				realOwnerAddress: tonCenterV3RawAddress(item.real_owner),
			}),
			...(item.sale_contract_address != null && {
				saleContractAddress: tonCenterV3RawAddress(item.sale_contract_address),
			}),
		}
	})

	return page(binding, rows, options.limit, options.offset)
}
