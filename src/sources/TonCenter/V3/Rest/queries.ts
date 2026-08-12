import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/TonCenter/bindings.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	tonCenterV3Hash,
	tonCenterV3NonnegativeInt64,
	tonCenterV3NonnegativeInteger,
	tonCenterV3NonnegativeSafeInteger,
	tonCenterV3RawAddress,
	tonCenterV3Shard,
} from '$/sources/TonCenter/V3/Rest/normalization.ts'
import {
	tonCenterV3Blocks,
	tonCenterV3JettonMasters,
	tonCenterV3MasterchainInfo,
	tonCenterV3Messages,
	tonCenterV3NftCollections,
	tonCenterV3NftItems,
	tonCenterV3Traces,
	tonCenterV3Transactions,
	type TonCenterV3MessageWire,
	type TonCenterV3BlockWire,
	type TonCenterV3NftCollectionWire,
	type TonCenterV3Order,
} from '$/sources/TonCenter/V3/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TonCenter].find(({ apiFamily }) => (
	apiFamily === ApiFamily.TonCenterV3Api
))

if (binding == null)
	throw new Error('TON Center v3 mainnet binding is missing')

const decimalString = /^(?:0|[1-9]\d*)$/
const signedInt32Maximum = (2 ** 31) - 1

const getTonCenterV3RestJson = <_Json>(
	path: string
) => {
	return sourceGetJson<_Json>(binding, httpUrl(binding, path))
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
		throw new Error('TON Center v3: limit must be an integer from 1 through 1000')
	if (!Number.isSafeInteger(offset) || offset < 0 || offset > signedInt32Maximum)
		throw new Error('TON Center v3: offset must be a nonnegative int32')
	if (offset + limit > signedInt32Maximum)
		throw new Error('TON Center v3: page exceeds int32 offset bounds')

	return new URLSearchParams({
		limit: String(limit),
		offset: String(offset),
		...(order != null && {
			sort: order,
		}),
	})
}

const page = <_Row>(
	rows: _Row[],
	limit: number,
	offset: number
) => {
	if (rows.length > limit)
		throw new Error('TON Center v3: response exceeds requested limit')

	return {
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
		throw new Error(`TON Center v3: ${rows} are not ${order === 'desc' ? 'newest' : 'oldest'}-first`)
}

const assertTonCenterV3MessageWire = (wire: TonCenterV3MessageWire) => {
	if (
		!decimalString.test(wire.created_at)
		|| !Number.isSafeInteger(Number(wire.created_at))
		|| Number(wire.created_at) < 0
	)
		throw new Error('TON Center v3: malformed message creation time')
	if (
		wire.opcode != null
		&& (
			!Number.isSafeInteger(wire.opcode)
			|| wire.opcode < -(2 ** 31)
			|| wire.opcode > 2 ** 31 - 1
		)
	)
		throw new Error('TON Center v3: malformed message opcode')

	tonCenterV3Hash(wire.hash, 'message hash')
	if (wire.source != null)
		tonCenterV3RawAddress(wire.source)
	if (wire.destination != null)
		tonCenterV3RawAddress(wire.destination)
	tonCenterV3NonnegativeInt64(wire.created_lt, 'message logical time')
	tonCenterV3NonnegativeInt64(wire.value, 'message value')
	tonCenterV3NonnegativeInt64(wire.fwd_fee, 'message forward fee')
	if (wire.ihr_fee != null)
		tonCenterV3NonnegativeInt64(wire.ihr_fee, 'message IHR fee')
	tonCenterV3NonnegativeInt64(wire.import_fee, 'message import fee')
	if (wire.in_msg_tx_hash != null)
		tonCenterV3Hash(wire.in_msg_tx_hash, 'inbound transaction hash')
	if (wire.out_msg_tx_hash != null)
		tonCenterV3Hash(wire.out_msg_tx_hash, 'outbound transaction hash')
}

const assertTonCenterV3NftCollectionWire = (wire: TonCenterV3NftCollectionWire) => {
	const address = tonCenterV3RawAddress(wire.address)
	if (wire.code_hash != null)
		tonCenterV3Hash(wire.code_hash, 'NFT collection code hash')
	if (wire.data_hash != null)
		tonCenterV3Hash(wire.data_hash, 'NFT collection data hash')
	if (wire.last_transaction_lt != null)
		tonCenterV3NonnegativeInt64(
			wire.last_transaction_lt,
			'NFT collection last transaction logical time'
		)
	if (wire.next_item_index != null)
		tonCenterV3NonnegativeInteger(
			wire.next_item_index,
			'NFT collection next item index'
		)
	if (wire.owner_address != null)
		tonCenterV3RawAddress(wire.owner_address)

	return address
}

const blockIdentity = (
	block: TonCenterV3BlockWire
) => {
	const workchain = block.workchain
	if (!Number.isSafeInteger(workchain) || workchain < -(2 ** 31) || workchain > 2 ** 31 - 1)
		throw new Error('TON Center v3: malformed block workchain')

	const seqno = tonCenterV3NonnegativeSafeInteger(block.seqno, 'block seqno')
	const shard = tonCenterV3Shard(block.shard)
	if (
		!decimalString.test(block.gen_utime)
		|| !Number.isSafeInteger(Number(block.gen_utime))
	)
		throw new Error('TON Center v3: malformed block generation time')

	const rootHash = tonCenterV3Hash(block.root_hash, 'block root hash')
	const fileHash = tonCenterV3Hash(block.file_hash, 'block file hash')
	tonCenterV3NonnegativeInt64(block.start_lt, 'block start logical time')
	tonCenterV3NonnegativeInt64(block.end_lt, 'block end logical time')
	tonCenterV3NonnegativeSafeInteger(block.tx_count, 'block transaction count')
	if (block.min_ref_mc_seqno != null)
		tonCenterV3NonnegativeSafeInteger(block.min_ref_mc_seqno, 'block minimum referenced masterchain seqno')

	return {
		workchain,
		shard,
		seqno,
		genUtimeSeconds: Number(block.gen_utime),
		rootHash,
		fileHash,
	}
}

export const getTonCenterV3Blocks = async (
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
		workchain?: number
		shardPrefix?: string
		seqno?: bigint
		rootHash?: string
		fileHash?: string
	}
) => {
	const parameters = pageParameters(options)
	const hasBlockId = (
		options.workchain != null
		|| options.shardPrefix != null
		|| options.seqno != null
	)
	if (
		hasBlockId
		&& (
			options.workchain == null
			|| options.shardPrefix == null
			|| options.seqno == null
		)
	)
		throw new Error('TON Center v3: block workchain, shard, and seqno filters must be provided together')
	if (options.workchain != null) {
		if (
			!Number.isSafeInteger(options.workchain)
			|| options.workchain < -(2 ** 31)
			|| options.workchain > signedInt32Maximum
		)
			throw new Error('TON Center v3: block workchain filter must be an int32')
		if (options.seqno == null || options.seqno < 0n || options.seqno > BigInt(signedInt32Maximum))
			throw new Error('TON Center v3: block seqno filter must be a nonnegative int32')
		parameters.set('workchain', String(options.workchain))
		parameters.set('shard', tonCenterV3Shard(options.shardPrefix))
		parameters.set('seqno', options.seqno.toString())
	}
	if ((options.rootHash == null) !== (options.fileHash == null))
		throw new Error('TON Center v3: block root and file hash filters must be provided together')
	if (options.rootHash != null) {
		parameters.set('root_hash', tonCenterV3Hash(options.rootHash, 'block root hash'))
		parameters.set('file_hash', tonCenterV3Hash(options.fileHash, 'block file hash'))
	}
	const wire = tonCenterV3Blocks.assert(await getTonCenterV3RestJson<unknown>(
		`blocks?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const hashIdentities = new Set<string>()
	let previousGenerationTime: number | undefined
	for (const block of wire.blocks) {
		const {
			workchain,
			shard,
			seqno,
			genUtimeSeconds,
			rootHash,
			fileHash,
		} = blockIdentity(block)
		const identity = `${workchain}:${shard}:${seqno}`
		if (identities.has(identity))
			throw new Error('TON Center v3: duplicate block identity')
		identities.add(identity)
		const hashIdentity = `${rootHash}:${fileHash}`
		if (hashIdentities.has(hashIdentity))
			throw new Error('TON Center v3: duplicate block hash identity')
		hashIdentities.add(hashIdentity)
		assertOrdered(previousGenerationTime, genUtimeSeconds, options.order, 'blocks')
		previousGenerationTime = genUtimeSeconds
	}

	return page(wire.blocks, options.limit, options.offset)
}

const getTonCenterV3ExactBlock = async (
	options: Parameters<typeof getTonCenterV3Blocks>[0],
	identity: string,
	matches: (block: TonCenterV3BlockWire) => boolean
) => {
	const blocks = await getTonCenterV3Blocks(options)
	const [block] = blocks.rows
	if (blocks.rows.length !== 1 || !matches(block))
		throw new Error(`TON Center v3: block ${identity} was not resolved exactly once`)

	return block
}

export const getTonCenterV3BlockByWorkchainShardPrefixSeqno = async ({
	workchain,
	shardPrefix,
	seqno,
}: {
	workchain: number
	shardPrefix: string
	seqno: bigint
}) => {
	const normalizedShardPrefix = tonCenterV3Shard(shardPrefix)
	return getTonCenterV3ExactBlock({
		limit: 1,
		offset: 0,
		order: 'desc',
		workchain,
		shardPrefix: normalizedShardPrefix,
		seqno,
	}, `${workchain}:${normalizedShardPrefix}:${seqno.toString()}`, (block) => {
		const identity = blockIdentity(block)
		return (
			identity.workchain === workchain
			&& identity.shard === normalizedShardPrefix
			&& BigInt(identity.seqno) === seqno
		)
	})
}

export const getTonCenterV3BlockByRootHashFileHash = async ({
	rootHash,
	fileHash,
}: {
	rootHash: string
	fileHash: string
}) => {
	const normalizedRootHash = tonCenterV3Hash(rootHash, 'block root hash')
	const normalizedFileHash = tonCenterV3Hash(fileHash, 'block file hash')
	return getTonCenterV3ExactBlock({
		limit: 1,
		offset: 0,
		order: 'desc',
		rootHash: normalizedRootHash,
		fileHash: normalizedFileHash,
	}, `${normalizedRootHash}:${normalizedFileHash}`, (block) => {
		const identity = blockIdentity(block)
		return (
			identity.rootHash === normalizedRootHash
			&& identity.fileHash === normalizedFileHash
		)
	})
}

export const getTonCenterV3MasterchainInfo = async () => {
	const masterchainInfo = tonCenterV3MasterchainInfo.assert(await getTonCenterV3RestJson<unknown>(
		'masterchainInfo'
	))
	const first = blockIdentity(masterchainInfo.first)
	const last = blockIdentity(masterchainInfo.last)
	if (first.workchain !== -1 || last.workchain !== -1)
		throw new Error('TON Center v3: masterchain info contains a non-masterchain block')
	if (last.seqno < first.seqno || last.genUtimeSeconds < first.genUtimeSeconds)
		throw new Error('TON Center v3: masterchain index range is reversed')

	return masterchainInfo
}

export const getTonCenterV3Messages = async (
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
		messageHash?: string
	}
) => {
	const parameters = pageParameters(options)
	if (options.messageHash != null)
		parameters.set('msg_hash', tonCenterV3Hash(options.messageHash, 'message hash'))
	const wire = tonCenterV3Messages.assert(await getTonCenterV3RestJson<unknown>(
		`messages?${parameters.toString()}`
	))
	const identities = new Set<string>()
	let previousLogicalTime: bigint | undefined
	for (const message of wire.messages) {
		assertTonCenterV3MessageWire(message)
		const hash = tonCenterV3Hash(message.hash, 'message hash')
		if (identities.has(hash))
			throw new Error('TON Center v3: duplicate message identity')
		identities.add(hash)
		const createdLt = tonCenterV3NonnegativeInt64(message.created_lt, 'message logical time')
		assertOrdered(previousLogicalTime, createdLt, options.order, 'messages')
		previousLogicalTime = createdLt
	}

	return page(wire.messages, options.limit, options.offset)
}

export const getTonCenterV3MessageByHash = async (
	messageHash: string
) => {
	const normalizedMessageHash = tonCenterV3Hash(messageHash, 'message hash')
	const messages = await getTonCenterV3Messages({
		limit: 1,
		offset: 0,
		order: 'desc',
		messageHash: normalizedMessageHash,
	})
	const [message] = messages.rows
	if (
		messages.rows.length !== 1
		|| tonCenterV3Hash(message.hash, 'message hash') !== normalizedMessageHash
	)
		throw new Error(`TON Center v3: message ${normalizedMessageHash} was not resolved exactly once`)

	return message
}

export const getTonCenterV3CompletedTraces = async (
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
		traceId?: string
	}
) => {
	const parameters = pageParameters(options)
	if (options.traceId != null)
		parameters.set('trace_id', tonCenterV3Hash(options.traceId, 'trace ID'))
	const wire = tonCenterV3Traces.assert(await getTonCenterV3RestJson<unknown>(
		`traces?${parameters.toString()}`
	))
	const identities = new Set<string>()
	let previousLogicalTime: bigint | undefined
	for (const trace of wire.traces) {
		if (trace.is_incomplete || trace.trace_info.pending_messages !== 0)
			throw new Error('TON Center v3: trace is incomplete')
		const traceId = tonCenterV3Hash(trace.trace_id, 'trace ID')
		assertTonCenterV3MessageWire(trace.trace.in_msg)
		const rootMessageHash = tonCenterV3Hash(trace.trace.in_msg.hash, 'message hash')
		if (
			tonCenterV3Hash(trace.trace.in_msg_hash, 'root message hash') !== rootMessageHash
			|| traceId !== rootMessageHash
		)
			throw new Error('TON Center v3: trace root message identity mismatch')
		if (identities.has(traceId))
			throw new Error('TON Center v3: duplicate trace identity')
		identities.add(traceId)
		const transactionHashes = trace.transactions_order.map((hash) => (
			tonCenterV3Hash(hash, 'trace transaction hash')
		))
		if (new Set(transactionHashes).size !== transactionHashes.length)
			throw new Error('TON Center v3: duplicate trace transaction identity')
		if (trace.trace_info.transactions !== transactionHashes.length)
			throw new Error('TON Center v3: trace transaction count mismatch')

		const startLt = tonCenterV3NonnegativeInt64(trace.start_lt, 'trace start logical time')
		const endLt = tonCenterV3NonnegativeInt64(trace.end_lt, 'trace end logical time')
		if (endLt < startLt)
			throw new Error('TON Center v3: trace logical-time range is reversed')
		assertOrdered(previousLogicalTime, endLt, options.order, 'traces')
		previousLogicalTime = endLt

		if (trace.external_hash != null)
			tonCenterV3Hash(trace.external_hash, 'trace external hash')
		const startUtime = tonCenterV3NonnegativeSafeInteger(trace.start_utime, 'trace start time')
		const endUtime = tonCenterV3NonnegativeSafeInteger(trace.end_utime, 'trace end time')
		if (endUtime < startUtime)
			throw new Error('TON Center v3: trace completion-time range is reversed')
		if (!Number.isSafeInteger(endUtime * 1_000))
			throw new Error('TON Center v3: trace completion time exceeds safe millisecond bounds')
		const startMasterchainSeqno = tonCenterV3NonnegativeInt64(
			trace.mc_seqno_start,
			'trace start masterchain seqno'
		)
		const endMasterchainSeqno = tonCenterV3NonnegativeInt64(
			trace.mc_seqno_end,
			'trace end masterchain seqno'
		)
		if (endMasterchainSeqno < startMasterchainSeqno)
			throw new Error('TON Center v3: trace masterchain range is reversed')
		tonCenterV3NonnegativeSafeInteger(trace.trace_info.messages, 'trace message count')
		tonCenterV3NonnegativeSafeInteger(trace.trace_info.transactions, 'trace transaction count')
		if (trace.trace.tx_hash != null)
			tonCenterV3Hash(trace.trace.tx_hash, 'trace root transaction hash')
	}

	return page(wire.traces, options.limit, options.offset)
}

export const getTonCenterV3CompletedTrace = async (
	traceId: string
) => {
	const normalizedTraceId = tonCenterV3Hash(traceId, 'trace ID')
	const traces = await getTonCenterV3CompletedTraces({
		limit: 1,
		offset: 0,
		order: 'desc',
		traceId: normalizedTraceId,
	})
	const [trace] = traces.rows
	if (
		traces.rows.length !== 1
		|| tonCenterV3Hash(trace.trace_id, 'trace ID') !== normalizedTraceId
	)
		throw new Error(`TON Center v3: trace ${normalizedTraceId} was not resolved exactly once`)

	return trace
}

export const getTonCenterV3Transactions = async (
	options: {
		limit: number
		offset: number
		order: TonCenterV3Order
		account?: string
		logicalTime?: bigint
		traceId?: string
	}
) => {
	const parameters = pageParameters(options)
	if (options.account != null)
		parameters.set('account', tonCenterV3RawAddress(options.account))
	if (options.logicalTime != null)
		parameters.set('lt', options.logicalTime.toString())
	if (options.traceId != null)
		parameters.set('trace_id', tonCenterV3Hash(options.traceId, 'trace ID'))
	const wire = tonCenterV3Transactions.assert(await getTonCenterV3RestJson<unknown>(
		`transactions?${parameters.toString()}`
	))
	const accountLogicalTimeIdentities = new Map<string, string>()
	let previousLogicalTime: bigint | undefined
	for (const transaction of wire.transactions) {
		const account = tonCenterV3RawAddress(transaction.account)
		const logicalTime = tonCenterV3NonnegativeInt64(transaction.lt, 'transaction logical time')
		const hash = tonCenterV3Hash(transaction.hash, 'transaction hash')
		const identity = `${account}:${logicalTime}`
		const existingHash = accountLogicalTimeIdentities.get(identity)
		if (existingHash != null)
			throw new Error(
				existingHash === hash ?
					'TON Center v3: duplicate transaction identity'
				:
					'TON Center v3: conflicting transaction hash identity'
			)
		accountLogicalTimeIdentities.set(identity, hash)
		assertOrdered(previousLogicalTime, logicalTime, options.order, 'transactions')
		previousLogicalTime = logicalTime

		if (transaction.in_msg != null)
			assertTonCenterV3MessageWire(transaction.in_msg)
		for (const outboundMessage of transaction.out_msgs)
			assertTonCenterV3MessageWire(outboundMessage)
		if (
			transaction.in_msg != null
			&& (
				(
					transaction.in_msg.destination != null
					&& tonCenterV3RawAddress(transaction.in_msg.destination) !== account
				)
				|| (
					transaction.in_msg.in_msg_tx_hash != null
					&& tonCenterV3Hash(
						transaction.in_msg.in_msg_tx_hash,
						'inbound transaction hash'
					) !== hash
				)
			)
		)
			throw new Error('TON Center v3: transaction has a foreign inbound message')
		if (transaction.out_msgs.some((outboundMessage) => (
			(
				outboundMessage.source != null
				&& tonCenterV3RawAddress(outboundMessage.source) !== account
			)
			|| (
				outboundMessage.out_msg_tx_hash != null
				&& tonCenterV3Hash(
					outboundMessage.out_msg_tx_hash,
					'outbound transaction hash'
				) !== hash
			)
		)))
			throw new Error('TON Center v3: transaction has a foreign outbound message')

		const workchain = transaction.block_ref.workchain
		if (!Number.isSafeInteger(workchain) || workchain < -(2 ** 31) || workchain > 2 ** 31 - 1)
			throw new Error('TON Center v3: malformed transaction block workchain')

		tonCenterV3Shard(transaction.block_ref.shard)
		tonCenterV3NonnegativeSafeInteger(transaction.block_ref.seqno, 'transaction block seqno')
		tonCenterV3NonnegativeSafeInteger(transaction.now, 'transaction timestamp')
		tonCenterV3NonnegativeInt64(transaction.total_fees, 'transaction total fees')
		tonCenterV3Hash(transaction.prev_trans_hash, 'previous transaction hash')
		tonCenterV3NonnegativeInt64(transaction.prev_trans_lt, 'previous transaction logical time')
		if (transaction.account_state_before != null)
			tonCenterV3NonnegativeInt64(
				transaction.account_state_before.balance,
				'transaction balance before'
			)
		if (transaction.account_state_after != null)
			tonCenterV3NonnegativeInt64(
				transaction.account_state_after.balance,
				'transaction balance after'
			)
		if (transaction.trace_id != null) {
			const traceId = tonCenterV3Hash(transaction.trace_id, 'transaction trace ID')
			if (
				options.traceId != null
				&& traceId !== tonCenterV3Hash(options.traceId, 'trace ID')
			)
				throw new Error('TON Center v3: transaction has a foreign trace identity')
		} else if (options.traceId != null)
			throw new Error('TON Center v3: trace transaction is missing its trace identity')
		if (transaction.trace_external_hash != null)
			tonCenterV3Hash(transaction.trace_external_hash, 'transaction trace external hash')
	}

	return page(wire.transactions, options.limit, options.offset)
}

export const getTonCenterV3TransactionByAccountLt = async ({
	account,
	logicalTime,
}: {
	account: string
	logicalTime: bigint
}) => {
	const normalizedAccount = tonCenterV3RawAddress(account)
	const transactions = await getTonCenterV3Transactions({
		limit: 1,
		offset: 0,
		order: 'desc',
		account: normalizedAccount,
		logicalTime,
	})
	const [transaction] = transactions.rows
	if (
		transactions.rows.length !== 1
		|| tonCenterV3RawAddress(transaction.account) !== normalizedAccount
		|| tonCenterV3NonnegativeInt64(transaction.lt, 'transaction logical time') !== logicalTime
	)
		throw new Error(`TON Center v3: transaction ${normalizedAccount}:${logicalTime.toString()} was not resolved exactly once`)

	return transaction
}

export const getTonCenterV3JettonMasters = async (
	options: {
		limit: number
		offset: number
	}
) => {
	const parameters = pageParameters(options)
	const wire = tonCenterV3JettonMasters.assert(await getTonCenterV3RestJson<unknown>(
		`jetton/masters?${parameters.toString()}`
	))
	const identities = new Set<string>()
	for (const master of wire.jetton_masters) {
		const address = tonCenterV3RawAddress(master.address)
		if (identities.has(address))
			throw new Error('TON Center v3: duplicate jetton master identity')
		identities.add(address)

		if (master.admin_address != null)
			tonCenterV3RawAddress(master.admin_address)
		if (master.code_hash != null)
			tonCenterV3Hash(master.code_hash, 'jetton master code hash')
		if (master.data_hash != null)
			tonCenterV3Hash(master.data_hash, 'jetton master data hash')
		if (master.jetton_wallet_code_hash != null)
			tonCenterV3Hash(master.jetton_wallet_code_hash, 'jetton wallet code hash')
		if (master.last_transaction_lt != null)
			tonCenterV3NonnegativeInt64(
				master.last_transaction_lt,
				'jetton master last transaction logical time'
			)
		if (master.total_supply != null)
			tonCenterV3NonnegativeInteger(master.total_supply, 'jetton total supply')
	}

	return page(wire.jetton_masters, options.limit, options.offset)
}

export const getTonCenterV3NftCollections = async (
	options: {
		limit: number
		offset: number
	}
) => {
	const parameters = pageParameters(options)
	const wire = tonCenterV3NftCollections.assert(await getTonCenterV3RestJson<unknown>(
		`nft/collections?${parameters.toString()}`
	))
	const identities = new Set<string>()
	for (const collection of wire.nft_collections) {
		const address = assertTonCenterV3NftCollectionWire(collection)
		if (identities.has(address))
			throw new Error('TON Center v3: duplicate NFT collection identity')
		identities.add(address)
	}

	return page(wire.nft_collections, options.limit, options.offset)
}

export const getTonCenterV3NftItems = async (
	options: {
		limit: number
		offset: number
	}
) => {
	const parameters = pageParameters(options)
	const wire = tonCenterV3NftItems.assert(await getTonCenterV3RestJson<unknown>(
		`nft/items?${parameters.toString()}`
	))
	const identities = new Set<string>()
	const collectionItemIdentities = new Set<string>()
	for (const item of wire.nft_items) {
		const address = tonCenterV3RawAddress(item.address)
		if (identities.has(address))
			throw new Error('TON Center v3: duplicate NFT item identity')
		identities.add(address)
		const embeddedCollectionAddress = item.collection == null ?
			undefined
			:
			assertTonCenterV3NftCollectionWire(item.collection)
		const explicitCollectionAddress = item.collection_address == null ?
			undefined
			:
			tonCenterV3RawAddress(item.collection_address)
		if (
			embeddedCollectionAddress != null
			&& explicitCollectionAddress != null
			&& embeddedCollectionAddress !== explicitCollectionAddress
		)
			throw new Error('TON Center v3: NFT item has a foreign embedded collection')
		const collectionAddress = explicitCollectionAddress ?? embeddedCollectionAddress
		const index = item.index == null ?
			undefined
			:
			tonCenterV3NonnegativeInteger(item.index, 'NFT item index')
		if (collectionAddress != null && index != null) {
			const collectionItemIdentity = `${collectionAddress}:${index}`
			if (collectionItemIdentities.has(collectionItemIdentity))
				throw new Error('TON Center v3: duplicate NFT collection item identity')
			collectionItemIdentities.add(collectionItemIdentity)
		}

		if (item.auction_contract_address != null)
			tonCenterV3RawAddress(item.auction_contract_address)
		if (item.code_hash != null)
			tonCenterV3Hash(item.code_hash, 'NFT item code hash')
		if (item.data_hash != null)
			tonCenterV3Hash(item.data_hash, 'NFT item data hash')
		if (item.last_transaction_lt != null)
			tonCenterV3NonnegativeInt64(
				item.last_transaction_lt,
				'NFT item last transaction logical time'
			)
		if (item.owner_address != null)
			tonCenterV3RawAddress(item.owner_address)
		if (item.real_owner != null)
			tonCenterV3RawAddress(item.real_owner)
		if (item.sale_contract_address != null)
			tonCenterV3RawAddress(item.sale_contract_address)
	}

	return page(wire.nft_items, options.limit, options.offset)
}
