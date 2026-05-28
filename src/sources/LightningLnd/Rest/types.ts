export type LndGetInfoResponse = {
	version?: string
	identity_pubkey: string
	alias?: string
	color?: string
	num_active_channels?: number
	num_inactive_channels?: number
	num_pending_channels?: number
	uris?: string[]
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
}
