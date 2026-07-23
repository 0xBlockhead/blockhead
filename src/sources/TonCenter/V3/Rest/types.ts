import type { Source } from '$/sources/Source.ts'

export type TonCenterV3Order = 'asc' | 'desc'

export type TonCenterV3BlockWire = {
	workchain: number
	shard: string
	seqno: number
	root_hash: string
	file_hash: string
	gen_utime: string
	start_lt: string
	end_lt: string
	tx_count: number
}

export type TonCenterV3BlocksWire = {
	blocks: TonCenterV3BlockWire[]
}

export type TonCenterV3MessageWire = {
	hash: string
	source?: string | null
	destination?: string | null
	created_at: string
	created_lt: string
	value: string
	fwd_fee: string
	ihr_fee?: string
	import_fee: string
	opcode?: number
	in_msg_tx_hash?: string
	out_msg_tx_hash?: string
}

export type TonCenterV3MessagesWire = {
	messages: TonCenterV3MessageWire[]
}

export type TonCenterV3TraceNodeWire = {
	in_msg_hash: string
	in_msg: TonCenterV3MessageWire
	tx_hash?: string
}

export type TonCenterV3TraceWire = {
	trace_id: string
	external_hash?: string
	start_lt: string
	end_lt: string
	start_utime: number
	end_utime: number
	mc_seqno_start: string
	mc_seqno_end: string
	is_incomplete: boolean
	trace: TonCenterV3TraceNodeWire
	transactions_order: string[]
	trace_info: {
		messages: number
		pending_messages: number
		transactions: number
	}
}

export type TonCenterV3TracesWire = {
	traces: TonCenterV3TraceWire[]
}

export type TonCenterV3TransactionWire = {
	account: string
	hash: string
	lt: string
	block_ref: {
		workchain: number
		shard: string
		seqno: number
	}
	now: number
	total_fees: string
	prev_trans_hash: string
	prev_trans_lt: string
	orig_status: string
	end_status: string
	description: {
		type: string
		aborted: boolean
		destroyed: boolean
	}
	account_state_before?: {
		balance: string
	}
	account_state_after?: {
		balance: string
	}
	in_msg?: TonCenterV3MessageWire | null
	out_msgs: TonCenterV3MessageWire[]
	trace_id?: string
	trace_external_hash?: string
}

export type TonCenterV3TransactionsWire = {
	transactions: TonCenterV3TransactionWire[]
}

export type TonCenterV3ContentWire = {
	[key: string]: unknown
	uri?: string
}

export type TonCenterV3JettonMasterWire = {
	address: string
	admin_address?: string
	code_hash?: string
	data_hash?: string
	jetton_content?: TonCenterV3ContentWire
	jetton_wallet_code_hash?: string
	last_transaction_lt?: string
	mintable?: boolean
	total_supply?: string
}

export type TonCenterV3JettonMastersWire = {
	jetton_masters: TonCenterV3JettonMasterWire[]
}

export type TonCenterV3NftCollectionWire = {
	address: string
	code_hash?: string
	collection_content?: TonCenterV3ContentWire
	data_hash?: string
	last_transaction_lt?: string
	next_item_index?: string
	owner_address?: string
}

export type TonCenterV3NftCollectionsWire = {
	nft_collections: TonCenterV3NftCollectionWire[]
}

export type TonCenterV3NftItemWire = {
	address: string
	auction_contract_address?: string
	code_hash?: string
	collection?: TonCenterV3NftCollectionWire
	collection_address?: string
	content?: TonCenterV3ContentWire
	data_hash?: string
	index?: string
	init?: boolean
	last_transaction_lt?: string
	on_sale?: boolean
	owner_address?: string
	real_owner?: string
	sale_contract_address?: string
}

export type TonCenterV3NftItemsWire = {
	nft_items: TonCenterV3NftItemWire[]
}

export type TonCenterV3Block = {
	workchain: number
	shard: string
	seqno: number
	rootHash: string
	fileHash: string
	genUtimeSeconds: number
	startLt: bigint
	endLt: bigint
	transactionCount: number
}

export type TonCenterV3Message = {
	hash: string
	source?: string
	destination?: string
	createdAtSeconds: number
	createdLt: bigint
	valueNano: bigint
	forwardFeeNano: bigint
	ihrFeeNano?: bigint
	importFeeNano: bigint
	opcode?: number
	inboundTransactionHash?: string
	outboundTransactionHash?: string
}

export type TonCenterV3Trace = {
	traceId: string
	externalHash?: string
	startLt: bigint
	endLt: bigint
	startUtimeSeconds: number
	endUtimeSeconds: number
	masterchainStartSeqno: bigint
	masterchainEndSeqno: bigint
	rootMessage: TonCenterV3Message
	transactionHashes: string[]
	messageCount: number
	transactionCount: number
}

export type TonCenterV3Transaction = {
	account: string
	logicalTime: bigint
	hash: string
	block: {
		workchain: number
		shard: string
		seqno: number
	}
	timestampSeconds: number
	totalFeesNano: bigint
	previousTransactionHash: string
	previousTransactionLogicalTime: bigint
	originalStatus: string
	endStatus: string
	transactionKind: string
	aborted: boolean
	destroyed: boolean
	balanceBeforeNano?: bigint
	balanceAfterNano?: bigint
	inboundMessage?: TonCenterV3Message
	outboundMessages: TonCenterV3Message[]
	traceId?: string
	traceExternalHash?: string
}

export type TonCenterV3JettonMaster = {
	address: string
	adminAddress?: string
	codeHash?: string
	dataHash?: string
	content?: TonCenterV3ContentWire
	metadataUri?: string
	walletCodeHash?: string
	lastTransactionLogicalTime?: bigint
	mintable?: boolean
	totalSupplyUnits?: bigint
}

export type TonCenterV3NftCollection = {
	address: string
	codeHash?: string
	content?: TonCenterV3ContentWire
	metadataUri?: string
	dataHash?: string
	lastTransactionLogicalTime?: bigint
	nextItemIndex?: bigint
	ownerAddress?: string
}

export type TonCenterV3NftItem = {
	address: string
	auctionContractAddress?: string
	codeHash?: string
	collection?: TonCenterV3NftCollection
	collectionAddress?: string
	content?: TonCenterV3ContentWire
	metadataUri?: string
	dataHash?: string
	index?: bigint
	initialized?: boolean
	lastTransactionLogicalTime?: bigint
	onSale?: boolean
	ownerAddress?: string
	realOwnerAddress?: string
	saleContractAddress?: string
}

export type TonCenterV3Page<_Row> = {
	source: Source
	target: 'ton:-239'
	rows: _Row[]
	nextOffset?: number
}
