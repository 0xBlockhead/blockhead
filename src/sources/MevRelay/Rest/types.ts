/**
 * MEV-Boost relay Data API BidTrace wire rows (fail-closed arktype).
 * @see https://github.com/flashbots/mev-boost-relay/blob/main/common/types.go
 * @see https://github.com/flashbots/relay-specs
 */

import { type as arktype } from 'arktype'


const nonnegativeDecimal = arktype('/^[0-9]+$/')
const blockHash = arktype('/^0[xX][\\da-fA-F]{64}$/')
const blsPubkey = arktype('/^0[xX][\\da-fA-F]{96}$/')
const evmAddress = arktype('/^0[xX][\\da-fA-F]{40}$/')


/**
 * BidTraceV2 Data API row (`num_tx` + `block_number`).
 * Tip leftovers on `builder_blocks_received`: optional `timestamp` / `timestamp_ms` / `optimistic_submission`.
 */
export const bidTraceWire = arktype({
	slot: nonnegativeDecimal,
	parent_hash: blockHash,
	block_hash: blockHash,
	builder_pubkey: blsPubkey,
	proposer_pubkey: blsPubkey,
	proposer_fee_recipient: evmAddress,
	gas_limit: nonnegativeDecimal,
	gas_used: nonnegativeDecimal,
	value: nonnegativeDecimal,
	num_tx: nonnegativeDecimal,
	block_number: nonnegativeDecimal,
	'timestamp?': nonnegativeDecimal,
	'timestamp_ms?': nonnegativeDecimal,
	'optimistic_submission?': 'boolean',
})

export type BidTrace = typeof bidTraceWire.infer

export const bidTraceListWire = bidTraceWire.array()

export type BidTraceList = typeof bidTraceListWire.infer

export type ProposerPayloadDelivered = BidTrace
