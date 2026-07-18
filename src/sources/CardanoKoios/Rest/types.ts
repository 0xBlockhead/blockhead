export interface CardanoKoiosTip {
	hash: string
	epoch_no: number
	era: string
	abs_slot: number
	block_height: number
	block_time: number
}

export interface CardanoKoiosBlock extends CardanoKoiosTip {
	tx_count: number
}

export interface CardanoKoiosBlockTransaction {
	tx_hash: string
}

export interface CardanoKoiosStakePool {
	pool_id_bech32: string
}

export interface CardanoKoiosDRep {
	drep_id: string
	has_script: boolean
}

export interface CardanoKoiosGovernanceProposal {
	proposal_tx_hash: string
	proposal_index: number
	proposal_type: string
}

export interface CardanoKoiosAsset {
	policy_id: string
	asset_name: string
}

export interface CardanoKoiosProtocolParameters {
	epoch_no: number
	min_fee_a: number
	min_fee_b: number
	max_block_size: number
	max_tx_size: number
	max_bh_size: number
	key_deposit: string
	pool_deposit: string
	max_epoch: number
	optimal_pool_count: number
	monetary_expand_rate: number
	treasury_growth_rate: number
	decentralisation: number
	protocol_major: number
	protocol_minor: number
	min_pool_cost: string
	coins_per_utxo_size: string
}

export interface CardanoKoiosCommittee {
	quorum_numerator: number
	quorum_denominator: number
	members: unknown[]
}
