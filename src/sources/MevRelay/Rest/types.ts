/**
 * MEV-Boost relay Data API BidTrace wire row.
 * @see https://github.com/flashbots/relay-specs
 */
export type BidTrace = {
	slot: string
	parent_hash: string
	block_hash: string
	builder_pubkey: string
	proposer_pubkey: string
	proposer_fee_recipient: string
	gas_limit: string
	gas_used: string
	value: string
	num_tx: string
	block_number: string
}

export type ProposerPayloadDelivered = BidTrace
