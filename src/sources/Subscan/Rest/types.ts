export type SubscanBlock = {
	block_num: number
	block_hash: string
	parent_hash: string
	state_root?: string
	extrinsics_root?: string
	event_count?: number
	extrinsics_count?: number
}

export type SubscanExtrinsic = {
	block_num: number
	block_timestamp?: number
	extrinsic_index: string
	call_module: string
	call_module_function: string
	account_id?: string
	extrinsic_hash?: string
	fee?: string
	finalized?: boolean
	nonce?: number
	success: boolean
}

export type SubscanExtrinsicList = {
	count: number
	extrinsics: SubscanExtrinsic[]
}

export type SubscanReferendumTimeline = {
	block: number
	status: string
	time: number
}

export type SubscanReferendum = {
	referendum_index: number
	origins: string
	created_block: number
	latest_block_num: number
	latest_block_timestamp: number
	status: string
	ayes_amount: string
	nays_amount: string
	timeline: SubscanReferendumTimeline[]
}

export type SubscanReferendumListItem = Pick<
	SubscanReferendum,
	| 'referendum_index'
	| 'origins'
	| 'created_block'
	| 'latest_block_num'
	| 'latest_block_timestamp'
	| 'status'
>

export type SubscanReferendumList = {
	count: number
	list: SubscanReferendumListItem[]
}

export type SubscanResponse<_Data> = {
	code: number
	message: string
	generated_at: number
	data: _Data
}
