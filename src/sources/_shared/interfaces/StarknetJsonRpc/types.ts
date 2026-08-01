export type Felt = `0x${string}`

export type BlockId =
	| 'l1_accepted'
	| 'latest'
	| 'pre_confirmed'
	| {
		block_hash: Felt
	}
	| {
		block_number: number
	}

export type BlockHashAndNumber = {
	block_hash: Felt
	block_number: number
}

export type SyncStatus = false | {
	starting_block_hash: Felt
	starting_block_num: number
	current_block_hash: Felt
	current_block_num: number
	highest_block_hash: Felt
	highest_block_num: number
}

export type Event = {
	from_address: Felt
	keys: Felt[]
	data: Felt[]
	block_hash?: Felt
	block_number?: number
	transaction_hash: Felt
	transaction_index: number
	event_index: number
}

export type EventsFilter = {
	from_block?: BlockId
	to_block?: BlockId
	address?: Felt | Felt[]
	keys?: Felt[][]
	chunk_size: number
	continuation_token?: string
}

export type EventsChunk = {
	events: Event[]
	continuation_token?: string
}
