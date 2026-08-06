import type { components } from '$/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/openrpc.d.ts'


export type Felt = components['schemas']['FELT']

export type BlockId = components['schemas']['BLOCK_ID']

export type BlockHashAndNumber = components['schemas']['Starknet_block_hash_and_number_result']

export type SyncStatus = components['schemas']['SyncingStatus']

export type Event = components['schemas']['EMITTED_EVENT']

export type EventsFilter = components['schemas']['Events_request']

export type EventsChunk = components['schemas']['EVENTS_CHUNK']

export type ResourcePrice = components['schemas']['RESOURCE_PRICE']

export type BlockWithTxHashes = components['schemas']['BLOCK_WITH_TX_HASHES']

/**
 * Wire transaction + hash from `starknet_getTransactionByHash`.
 * OpenRPC collapses `TXN_WITH_HASH` to `unknown` via unsupported composition; reconstruct from `TXN` + hash.
 */
export type TransactionWithHash = components['schemas']['TXN'] & {
	transaction_hash: components['schemas']['TXN_HASH']
}

export type FeePayment = components['schemas']['FEE_PAYMENT']

export type MessageToL1 = components['schemas']['MSG_TO_L1']

export type TransactionReceiptWithBlockInfo = components['schemas']['TXN_RECEIPT_WITH_BLOCK_INFO']
