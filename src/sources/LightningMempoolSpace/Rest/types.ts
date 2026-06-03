export type MempoolSpaceLightningLocalizedLabel = {
	en?: string
}

export type MempoolSpaceLightningNode = {
	public_key: string
	alias?: string | null
	first_seen?: number | null
	updated_at?: number | null
	color?: string | null
	sockets?: string | null
	iso_code?: string | null
	city?: MempoolSpaceLightningLocalizedLabel | null
	country?: MempoolSpaceLightningLocalizedLabel | null
	active_channel_count?: number | null
	channels?: number | null
	capacity?: number | string | null
}

export type MempoolSpaceLightningRankedNode = {
	publicKey: string
	alias?: string | null
	channels?: number | null
	capacity?: number | string | null
	firstSeen?: number | null
	updatedAt?: number | null
	iso_code?: string | null
	city?: MempoolSpaceLightningLocalizedLabel | null
	country?: MempoolSpaceLightningLocalizedLabel | null
}

export type MempoolSpaceLightningSearchResult = {
	nodes: {
		public_key: string
		alias?: string | null
		capacity?: number | null
		channels?: number | null
		status?: number | null
	}[]
	channels: MempoolSpaceLightningChannelSummary[]
}

export type MempoolSpaceLightningChannelNode = {
	alias?: string | null
	public_key: string
	channels?: number | null
	capacity?: number | string | null
	base_fee_mtokens?: number | string | null
	cltv_delta?: number | null
	fee_rate?: number | null
	is_disabled?: number | boolean | null
	max_htlc_mtokens?: number | string | null
	min_htlc_mtokens?: number | string | null
	updated_at?: string | null
	funding_balance?: number | string | null
	closing_balance?: number | string | null
}

export type MempoolSpaceLightningChannel = {
	id: string
	short_id?: string | null
	status?: number | null
	capacity?: number | string | null
	transaction_id?: string | null
	transaction_vout?: number | null
	closing_transaction_id?: string | null
	closing_fee?: number | string | null
	closing_reason?: number | string | null
	closing_date?: string | null
	updated_at?: string | null
	created?: string | null
	fee_rate?: number | null
	node_left?: MempoolSpaceLightningChannelNode | null
	node_right?: MempoolSpaceLightningChannelNode | null
	node?: MempoolSpaceLightningChannelNode | null
}

export type MempoolSpaceLightningChannelSummary = Pick<
	MempoolSpaceLightningChannel,
	| 'id'
	| 'short_id'
	| 'status'
	| 'capacity'
	| 'closing_reason'
	| 'closing_date'
	| 'fee_rate'
	| 'node'
>

export type MempoolSpaceLightningStatistics = {
	added: string
	channel_count?: number | null
	node_count?: number | null
	total_capacity?: number | string | null
	tor_nodes?: number | null
	clearnet_nodes?: number | null
	unannounced_nodes?: number | null
	avg_capacity?: number | string | null
	avg_fee_rate?: number | null
	med_capacity?: number | string | null
	med_fee_rate?: number | null
}

export type MempoolSpaceLightningStatisticsResponse = {
	latest: MempoolSpaceLightningStatistics
}
