import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	blockchairAddressInfinitableChains,
	blockchairBitcoinLikeChains,
	blockchairBlockInfinitableChains,
	blockchairChains,
	blockchairEthereumLikeChains,
	blockchairRawBlockChains,
	blockchairRawTransactionChains,
	blockchairTransactionInfinitableChains,
} from '$/sources/Blockchair/Rest/constants.ts'


// Types

export type BlockchairChain = (typeof blockchairChains)[number]['chain']

export type BlockchairBitcoinLikeChain = (typeof blockchairBitcoinLikeChains)[number]['chain']

export type BlockchairEthereumLikeChain = (typeof blockchairEthereumLikeChains)[number]['chain']

export type BlockchairBlockInfinitableChain = (typeof blockchairBlockInfinitableChains)[number]['chain']

export type BlockchairTransactionInfinitableChain = (
	typeof blockchairTransactionInfinitableChains
)[number]['chain']

export type BlockchairAddressInfinitableChain = (
	typeof blockchairAddressInfinitableChains
)[number]['chain']

export type BlockchairRawBlockChain = (typeof blockchairRawBlockChains)[number]['chain']

export type BlockchairRawTransactionChain = (typeof blockchairRawTransactionChains)[number]['chain']

export type BlockchairApiMetadata = {
	version?: string
	last_major_update?: string
	next_major_update?: string
	documentation?: string
	notice?: string
}

export type BlockchairCacheMetadata = {
	live?: boolean
	duration?: number | string
	since?: string
	until?: string
	time?: number | null
}

export type BlockchairContext = {
	code: number
	error?: string
	source?: string
	state?: number
	state_layer_2?: number
	market_price_usd?: number
	cache?: BlockchairCacheMetadata
	api?: BlockchairApiMetadata
	servers?: string
	time?: number | null
	render_time?: number
	full_time?: number
	request_cost?: number
	results?: number | null
	limit?: number | string | null
	offset?: number | string | null
	rows?: number | null
}

export type BlockchairResponse<_Data> = {
	data: _Data
	context: BlockchairContext
}

export type BlockchairLargestTransaction = {
	hash?: string
	value_usd?: number | null
}

export type BlockchairBitcoinLikeStats = {
	blocks?: number
	transactions?: number
	outputs?: number
	circulation?: number
	blocks_24h?: number
	transactions_24h?: number
	difficulty?: number
	volume_24h?: number
	mempool_transactions?: number
	mempool_size?: number
	mempool_tps?: number
	mempool_total_fee_usd?: number
	mempool_outputs?: number
	best_block_height?: number
	best_block_hash?: string
	best_block_time?: string
	blockchain_size?: number
	average_transaction_fee_24h?: number
	average_transaction_fee_usd_24h?: number
	median_transaction_fee_24h?: number
	median_transaction_fee_usd_24h?: number
	inflation_24h?: number
	inflation_usd_24h?: number
	cdd_24h?: number
	largest_transaction_24h?: BlockchairLargestTransaction
	nodes?: number
	hashrate_24h?: string
	market_price_usd?: number
	market_price_btc?: number
	market_price_usd_change_24h_percentage?: number
	market_cap_usd?: number
	market_dominance_percentage?: number
	next_retarget_time_estimate?: string | null
	next_difficulty_estimate?: number | null
	countdowns?: JsonValue[]
	suggested_transaction_fee_per_byte_sat?: number
	hodling_addresses?: number
}

export type BlockchairEthereumLikeStats = {
	blocks?: number
	transactions?: number
	calls?: number
	accounts?: number
	circulation?: string | number
	blocks_24h?: number
	transactions_24h?: number
	calls_24h?: number
	difficulty?: string | number
	volume_24h?: string | number
	mempool_transactions?: number
	mempool_size?: number
	mempool_tps?: number
	best_block_height?: number
	best_block_hash?: string
	best_block_time?: string
	blockchain_size?: number
	average_transaction_fee_24h?: number
	average_transaction_fee_usd_24h?: number
	median_transaction_fee_24h?: number
	median_transaction_fee_usd_24h?: number
	market_price_usd?: number
	market_price_btc?: number
	market_price_usd_change_24h_percentage?: number
	market_cap_usd?: number
	market_dominance_percentage?: number
	suggested_transaction_fee_gwei?: number
	suggested_transaction_fee_gwei_options?: Record<string, number>
	layer_2?: JsonValue
}

export type BlockchairChainStats = (
	| BlockchairBitcoinLikeStats
	| BlockchairEthereumLikeStats
	| Record<string, JsonValue>
)

export type BlockchairStats = BlockchairChainStats

export type BlockchairStatsByChain = Record<string, BlockchairChainStats>

export type BlockchairBitcoinLikeBlock = {
	id: number
	hash: string
	date?: string
	time?: string
	median_time?: string | null
	size?: number
	stripped_size?: number
	weight?: number
	version?: number
	version_hex?: string
	version_bits?: string
	merkle_root?: string
	nonce?: number
	bits?: number
	difficulty?: number
	chainwork?: string
	coinbase_data_hex?: string | null
	transaction_count?: number
	witness_count?: number
	input_count?: number
	output_count?: number
	input_total?: number
	input_total_usd?: number
	output_total?: number
	output_total_usd?: number
	fee_total?: number
	fee_total_usd?: number
	fee_per_kb?: number
	fee_per_kb_usd?: number
	fee_per_kwu?: number
	fee_per_kwu_usd?: number
	cdd_total?: number
	generation?: number
	generation_usd?: number
	reward?: number
	reward_usd?: number
	guessed_miner?: string | null
}

export type BlockchairBitcoinLikeTransaction = {
	block_id?: number
	id?: number
	hash: string
	date?: string
	time?: string
	size?: number
	weight?: number
	version?: number
	lock_time?: number
	is_coinbase?: boolean
	has_witness?: boolean
	input_count?: number
	output_count?: number
	input_total?: number
	input_total_usd?: number
	output_total?: number
	output_total_usd?: number
	fee?: number
	fee_usd?: number
	fee_per_kb?: number
	fee_per_kb_usd?: number
	fee_per_kwu?: number
	fee_per_kwu_usd?: number
	cdd_total?: number
	is_rbf?: boolean
}

export type BlockchairBitcoinLikeInput = {
	block_id?: number
	transaction_hash?: string
	index?: number
	time?: string
	value?: number
	value_usd?: number
	recipient?: string
	type?: string
	script_hex?: string
	is_from_coinbase?: boolean
	is_spendable?: boolean
	spending_block_id?: number | null
	spending_transaction_hash?: string | null
	spending_index?: number | null
	spending_time?: string | null
	spending_value_usd?: number | null
	spending_sequence?: number | null
	spending_signature_hex?: string | null
	spending_witness?: string | null
	lifespan?: number | null
	cdd?: number | null
}

export type BlockchairBitcoinLikeOutput = BlockchairBitcoinLikeInput

export type BlockchairBitcoinLikeAddress = {
	type?: string
	script_hex?: string
	balance?: number
	balance_usd?: number
	received?: number
	received_usd?: number
	spent?: number
	spent_usd?: number
	output_count?: number
	unspent_output_count?: number
	first_seen_receiving?: string | null
	last_seen_receiving?: string | null
	first_seen_spending?: string | null
	last_seen_spending?: string | null
	transaction_count?: number
}

export type BlockchairBitcoinLikeBlockDashboard = {
	block: BlockchairBitcoinLikeBlock
	transactions: BlockchairBitcoinLikeTransaction[]
}

export type BlockchairBitcoinLikeTransactionDashboard = {
	transaction: BlockchairBitcoinLikeTransaction
	inputs: BlockchairBitcoinLikeInput[]
	outputs: BlockchairBitcoinLikeOutput[]
}

export type BlockchairBitcoinLikeAddressDashboard = {
	address: BlockchairBitcoinLikeAddress
	transactions: string[] | BlockchairBitcoinLikeTransaction[]
	utxo?: BlockchairBitcoinLikeOutput[]
}

export type BlockchairEthereumLikeBlock = {
	id: number
	hash: string
	date?: string
	time?: string
	size?: number
	miner?: string
	extra_data_hex?: string
	difficulty?: string | number
	gas_used?: number
	gas_limit?: number
	base_fee_per_gas?: number | null
	logs_bloom?: string
	mix_hash?: string
	nonce?: string
	receipts_root?: string
	sha3_uncles?: string
	state_root?: string
	total_difficulty?: string | number
	transaction_count?: number
	uncle_count?: number
}

export type BlockchairEthereumLikeTransaction = {
	block_id?: number
	id?: number
	hash: string
	date?: string
	time?: string
	sender?: string
	recipient?: string | null
	value?: string | number
	value_usd?: number | null
	input_hex?: string
	fee?: string | number
	fee_usd?: number | null
	gas_used?: number
	gas_limit?: number
	gas_price?: number
	nonce?: number
	transaction_index?: number
	success?: boolean
	type?: number
}

export type BlockchairEthereumLikeAddress = {
	type?: 'account' | 'contract' | string
	contract_code_hex?: string | null
	contract_created?: string | null
	contract_destroyed?: string | null
	balance?: string | number
	balance_usd?: number | null
	received?: string | number
	received_usd?: number | null
	spent?: string | number
	spent_usd?: number | null
	fees?: string | number
	fees_usd?: number | null
	receiving_transaction_count?: number
	spending_transaction_count?: number
	transaction_count?: number
	nonce?: number
}

export type BlockchairEthereumLikeCall = {
	block_id?: number
	transaction_hash?: string
	index?: string
	time?: string
	sender?: string
	recipient?: string | null
	value?: string | number
	value_usd?: number | null
	transferred?: boolean
	input_hex?: string
	output_hex?: string
	trace_type?: string
	call_type?: string
	success?: boolean
}

export type BlockchairEthereumLikeBlockDashboard = {
	block: BlockchairEthereumLikeBlock
	transactions: BlockchairEthereumLikeTransaction[]
	uncles?: BlockchairEthereumLikeBlock[]
}

export type BlockchairEthereumLikeTransactionDashboard = {
	transaction: BlockchairEthereumLikeTransaction
	calls?: BlockchairEthereumLikeCall[]
	layer_2?: JsonValue
}

export type BlockchairEthereumLikeAddressDashboard = {
	address: BlockchairEthereumLikeAddress
	transactions: BlockchairEthereumLikeTransaction[]
	calls?: BlockchairEthereumLikeCall[]
	layer_2?: JsonValue
}

export type BlockchairBlock = BlockchairBitcoinLikeBlock | BlockchairEthereumLikeBlock

export type BlockchairTransaction = (
	| BlockchairBitcoinLikeTransaction
	| BlockchairEthereumLikeTransaction
)

export type BlockchairAddress = BlockchairBitcoinLikeAddress | BlockchairEthereumLikeAddress

export type BlockchairInfinitableParams = {
	query?: string
	sort?: string
	aggregate?: string
	limit?: number
	offset?: number
}

export type BlockchairAddressDashboardParams = {
	limit?: number
	offset?: number
	state?: string
	transactionDetails?: boolean
}

export type BlockchairEthereumAddressDashboardParams = {
	limit?: number
	offset?: number
	erc20?: boolean | string
	erc721?: boolean
	assetsInUsd?: boolean
	contractDetails?: boolean
	nonce?: boolean
}

export type BlockchairEthereumTransactionDashboardParams = {
	erc20?: boolean | string
	erc721?: boolean
	assetsInUsd?: boolean
	effects?: boolean
	traceMempool?: boolean
}

export type BlockchairRequestOptions = {
	apiKey?: string
}
