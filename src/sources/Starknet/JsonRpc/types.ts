import type { JsonValue } from '$/typescript/JsonValue.ts'

export type StarknetFelt = `0x${string}`

export type StarknetBlockId =
	| 'latest'
	| 'pre_confirmed'
	| {
		block_hash: StarknetFelt
	}
	| {
		block_number: number
	}

export type StarknetBlockHashAndNumber = {
	block_hash: StarknetFelt
	block_number: number
}

export type StarknetSyncStatus = false | {
	starting_block_hash: StarknetFelt
	starting_block_num: number
	current_block_hash: StarknetFelt
	current_block_num: number
	highest_block_hash: StarknetFelt
	highest_block_num: number
}

export type StarknetEvent = {
	from_address: StarknetFelt
	keys: StarknetFelt[]
	data: StarknetFelt[]
	block_hash?: StarknetFelt
	block_number?: number
	transaction_hash: StarknetFelt
	transaction_index: number
	event_index: number
}

export type StarknetEventsFilter = {
	from_block?: StarknetBlockId
	to_block?: StarknetBlockId
	address?: string
	keys?: StarknetFelt[][]
	chunk_size: number
	continuation_token?: string
}

export type StarknetEventsChunk = {
	events: StarknetEvent[]
	continuation_token?: string
}

export type StarknetWire = JsonValue
