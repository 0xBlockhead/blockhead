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
