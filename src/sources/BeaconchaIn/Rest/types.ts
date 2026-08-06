export type BeaconchaInResponse<_Data> = {
	status: string
	data: _Data | null
}

export type BeaconchaInEpoch = {
	epoch: number
	ts: string
	finalized: boolean
	validatorscount: number
	averagevalidatorbalance: number
	totalvalidatorbalance: number
	globalparticipationrate: number
	eligibleether: number
	votedether: number
	blockscount: number
	proposedblocks: number
	missedblocks: number
	orphanedblocks: number
	scheduledblocks: number
	attestationscount: number
	attesterslashingscount: number
	proposerslashingscount: number
	depositscount: number
	withdrawalcount: number
	voluntaryexitscount: number
	rewards_exported: boolean
}

export type BeaconchaInSlot = {
	slot: number
	epoch: number
	blockroot: string
	parentroot: string
	stateroot: string
	signature: string
	proposer: number
	/** `'0'` scheduled, `'1'` proposed/canonical, `'2'` missed, `'3'` orphaned */
	status: string
	attestationscount?: number
	attesterslashingscount?: number
	proposerslashingscount?: number
	depositscount?: number
	withdrawalcount?: number
	voluntaryexitscount?: number
}

export type BeaconchaInValidator = {
	validator_index: number
	pubkey: string
	balance: number
	effective_balance: number
	status: string
	slashed: boolean
	activation_eligibility_epoch?: number
	activation_epoch?: number
	exit_epoch?: number
	withdrawable_epoch?: number
	withdrawal_credentials?: string
	last_attestation_slot?: number
	name?: string
	total_withdrawals?: number
}

/** @see https://docs.beaconcha.in/api-reference/slots/attestations-for-a-slot */
export type BeaconchaInAttestation = {
	aggregationbits: string
	block_index: number
	committeeindex: number
	slot: number
	block_slot: number
	beaconblockroot?: string
	block_root?: string
	signature?: string
	source_epoch?: number
	source_root?: string
	target_epoch?: number
	target_root?: string
	validators?: number[]
}

/**
 * Per-validator attestation duty within an epoch window.
 * When `slim=true`, `week` / `week_start` / `week_end` / `committeeindex` are omitted.
 * @see https://docs.beaconcha.in/api-reference/validators/validator-attestations-history
 */
export type BeaconchaInValidatorAttestation = {
	attesterslot: number
	epoch: number
	inclusionslot: number
	/** `1` included on-chain; `0` missed */
	status: number
	validatorindex: number
	committeeindex?: number
	week?: number
	week_start?: string
	week_end?: string
}

/** @see https://docs.beaconcha.in/api-reference/slots/withdrawals-for-a-slot */
export type BeaconchaInWithdrawal = {
	address: string
	amount: number
	block_slot: number
	validatorindex: number
	/** Global sequential withdrawal index (same axis Beacon_Rest uses for `indexInSlot`). */
	withdrawalindex: number
}

/** @see https://docs.beaconcha.in/api-reference/slots/attester-slashings-for-a-slot */
export type BeaconchaInAttesterSlashing = {
	block_index: number
	block_slot: number
	block_root?: string
	attestation1_beaconblockroot?: string
	attestation1_index?: number
	attestation1_indices?: number[]
	attestation1_signature?: string
	attestation1_slot?: number
	attestation1_source_epoch?: number
	attestation1_source_root?: string
	attestation1_target_epoch?: number
	attestation1_target_root?: string
	attestation2_beaconblockroot?: string
	attestation2_index?: number
	attestation2_indices?: number[]
	attestation2_signature?: string
	attestation2_slot?: number
	attestation2_source_epoch?: number
	attestation2_source_root?: string
	attestation2_target_epoch?: number
	attestation2_target_root?: string
}

/** @see https://docs.beaconcha.in/api-reference/slots/proposer-slashings */
export type BeaconchaInProposerSlashing = {
	block_index: number
	block_slot: number
	proposerindex: number
	header1_slot?: number
	header1_stateroot?: string
	header1_parentroot?: string
	header2_slot?: number
	header2_stateroot?: string
	header2_parentroot?: string
}
