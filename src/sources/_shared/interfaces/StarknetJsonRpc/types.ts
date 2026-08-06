import type { components } from '$/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/openrpc.d.ts'


export type Felt = components['schemas']['FELT']

export type BlockId = components['schemas']['BLOCK_ID']

export type BlockHashAndNumber = components['schemas']['Starknet_block_hash_and_number_result']

export type SyncStatus = components['schemas']['SyncingStatus']

export type Event = components['schemas']['EMITTED_EVENT']

export type EventsFilter = components['schemas']['Events_request']

export type EventsChunk = components['schemas']['EVENTS_CHUNK']
