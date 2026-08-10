export type LndGetInfoResponse = {
	version?: string
	identity_pubkey: string
	alias?: string
	color?: string
	num_active_channels?: number
	num_inactive_channels?: number
	num_pending_channels?: number
	num_peers?: number
	block_height?: number
	best_header_timestamp?: string
	synced_to_chain?: boolean
	synced_to_graph?: boolean
	uris?: string[]
}

export type LndAmount = {
	sat?: string
	msat?: string
}

export type LndWalletBalanceResponse = {
	total_balance?: string
	confirmed_balance?: string
	unconfirmed_balance?: string
	locked_balance?: string
	reserved_balance_anchor_chan?: string
}

export type LndChannelBalanceResponse = {
	balance?: string
	pending_open_balance?: string
	local_balance?: LndAmount
	remote_balance?: LndAmount
	unsettled_local_balance?: LndAmount
	unsettled_remote_balance?: LndAmount
	pending_open_local_balance?: LndAmount
	pending_open_remote_balance?: LndAmount
}

export type LndChannelPoint = {
	funding_txid_bytes?: string
	funding_txid_str?: string
	output_index?: number
}

export type LndHtlc = {
	incoming?: boolean
	amount?: string
	hash_lock?: string
	expiration_height?: number
	htlc_index?: string
	state?: string
}

export type LndChannel = {
	active?: boolean
	remote_pubkey: string
	channel_point: string
	chan_id: string
	capacity?: string
	local_balance?: string
	remote_balance?: string
	unsettled_balance?: string
	commit_fee?: string
	commit_weight?: string
	fee_per_kw?: string
	private?: boolean
	initiator?: boolean
	num_updates?: string
	pending_htlcs?: LndHtlc[]
}

export type LndListChannelsResponse = {
	channels?: LndChannel[]
}

export type LndInvoice = {
	memo?: string
	r_hash?: string
	r_hash_str?: string
	value?: string
	value_msat?: string
	settled?: boolean
	creation_date?: string
	settle_date?: string
	payment_request?: string
	expiry?: string
	private?: boolean
	add_index?: string
	settle_index?: string
	amt_paid_msat?: string
	state?: string
}

export type LndListInvoicesResponse = {
	invoices?: LndInvoice[]
	last_index_offset?: string
	first_index_offset?: string
}

export type LndPayment = {
	payment_hash: string
	payment_preimage?: string
	value_msat?: string
	fee_msat?: string
	creation_date?: string
	creation_time_ns?: string
	payment_request?: string
	status?: string
	failure_reason?: string
	payment_index?: string
}

export type LndListPaymentsResponse = {
	payments?: LndPayment[]
	first_index_offset?: string
	last_index_offset?: string
	total_num_payments?: string
}

export type LndNetworkInfoResponse = {
	graph_diameter?: number
	avg_out_degree?: number
	max_out_degree?: number
	num_nodes?: number
	num_channels?: number
	total_network_capacity?: string
	avg_channel_size?: number
	min_channel_size?: string
	max_channel_size?: string
	median_channel_size_sat?: string
	num_zombie_chans?: string
}

export type LndNodeAddress = {
	network?: string
	addr: string
}

export type LndGraphNode = {
	last_update?: number
	pub_key: string
	alias?: string
	addresses?: LndNodeAddress[]
	color?: string
}

export type LndRoutingPolicy = {
	time_lock_delta?: number
	min_htlc?: string
	fee_base_msat?: string
	fee_rate_milli_msat?: string
	disabled?: boolean
	max_htlc_msat?: string
	last_update?: number
}

export type LndChannelEdge = {
	channel_id: string
	chan_point?: string
	last_update?: number
	node1_pub: string
	node2_pub: string
	capacity?: string
	node1_policy?: LndRoutingPolicy
	node2_policy?: LndRoutingPolicy
}

export type LndNodeInfoResponse = {
	node: LndGraphNode
	num_channels?: number
	total_capacity?: string
	channels?: LndChannelEdge[]
}
