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
	extrinsic_index: string
	call_module: string
	call_module_function: string
	account_id?: string
	extrinsic_hash?: string
	success: boolean
}

export type SubscanResponse<_Data> = {
	code: number
	message: string
	generated_at: number
	data: _Data
}
