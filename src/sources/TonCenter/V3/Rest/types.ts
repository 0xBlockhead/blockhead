import { type } from 'arktype'


export type TonCenterV3Order = 'asc' | 'desc'

const tonCenterV3Block = type({
	workchain: 'number.integer',
	shard: 'string',
	seqno: 'number.integer >= 0',
	root_hash: 'string',
	file_hash: 'string',
	gen_utime: 'string',
	start_lt: 'string',
	end_lt: 'string',
	tx_count: 'number.integer >= 0',
})

export type TonCenterV3BlockWire = typeof tonCenterV3Block.infer

export const tonCenterV3Blocks = type({
	blocks: tonCenterV3Block.array(),
})

const tonCenterV3Message = type({
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
})

export type TonCenterV3MessageWire = typeof tonCenterV3Message.infer

export const tonCenterV3Messages = type({
	messages: tonCenterV3Message.array(),
})

const tonCenterV3Trace = type({
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
})

export type TonCenterV3TraceWire = typeof tonCenterV3Trace.infer

export const tonCenterV3Traces = type({
	traces: tonCenterV3Trace.array(),
})

const tonCenterV3Transaction = type({
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
})

export type TonCenterV3TransactionWire = typeof tonCenterV3Transaction.infer

export const tonCenterV3Transactions = type({
	transactions: tonCenterV3Transaction.array(),
})

const tonCenterV3Content = type({
	'[string]': 'unknown',
	'uri?': 'string',
})

const tonCenterV3JettonMaster = type({
	address: 'string',
	'admin_address?': 'string',
	'code_hash?': 'string',
	'data_hash?': 'string',
	'jetton_content?': tonCenterV3Content,
	'jetton_wallet_code_hash?': 'string',
	'last_transaction_lt?': 'string',
	'mintable?': 'boolean',
	'total_supply?': 'string',
})

export type TonCenterV3JettonMasterWire = typeof tonCenterV3JettonMaster.infer

export const tonCenterV3JettonMasters = type({
	jetton_masters: tonCenterV3JettonMaster.array(),
})

const tonCenterV3NftCollection = type({
	address: 'string',
	'code_hash?': 'string',
	'collection_content?': tonCenterV3Content,
	'data_hash?': 'string',
	'last_transaction_lt?': 'string',
	'next_item_index?': 'string',
	'owner_address?': 'string',
})

export type TonCenterV3NftCollectionWire = typeof tonCenterV3NftCollection.infer

export const tonCenterV3NftCollections = type({
	nft_collections: tonCenterV3NftCollection.array(),
})

const tonCenterV3NftItem = type({
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
})

export type TonCenterV3NftItemWire = typeof tonCenterV3NftItem.infer

export const tonCenterV3NftItems = type({
	nft_items: tonCenterV3NftItem.array(),
})

export type TonCenterV3Page<_Row> = {
	rows: _Row[]
	nextOffset?: number
}
