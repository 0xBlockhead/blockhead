export type BeaconBlockDutySummary = {
	deposits: {
		index: number
		pubkey: string
		withdrawalCredentials: string
		amountGwei: bigint
		signature: string
		proof: string[]
	}[]
	attestations: {
		index: number
		committeeIndex: number | undefined
		aggregationBits: string | undefined
	}[]
	withdrawals: {
		index: number
		validatorIndex: number | undefined
		address: string | undefined
		amountGwei: bigint | undefined
	}[]
	slashings: {
		index: number
		kind: 'attester' | 'proposer'
	}[]
}

export type BeaconBlockRewards = {
	proposerIndex: number
	totalGwei: bigint
	attestationsGwei: bigint
	syncAggregateGwei: bigint
	proposerSlashingsGwei: bigint
	attesterSlashingsGwei: bigint
	executionOptimistic: boolean
	finalized: boolean
}

export type BeaconValidatorAttestationReward = {
	validatorIndex: number
	headGwei: bigint
	targetGwei: bigint
	sourceGwei: bigint
	inclusionDelayGwei: bigint | undefined
	inactivityGwei: bigint
}

export type BeaconValidatorSyncCommitteeReward = {
	validatorIndex: number
	rewardGwei: bigint
}
