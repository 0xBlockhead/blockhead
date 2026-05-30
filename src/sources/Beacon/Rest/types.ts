export type BeaconHeader = {
	bodyRoot: string
	canonical: boolean | undefined
	parentRoot: string
	proposerIndex: number
	root: string
	signature: string
	slot: number
	stateRoot: string
}

/** Response payload for `GET /eth/v1/beacon/headers/head`. */
export type BeaconHeaderHeadResponse = {
	data?: {
		header?: {
			message?: {
				slot?: string
			}
		}
	}
}

/** Response payload for `GET /eth/v1/beacon/headers/{block_id}`. */
export type BeaconHeaderResponse = {
	data?: {
		root?: string
		canonical?: boolean
		header?: {
			message?: {
				slot?: string
				proposer_index?: string
				parent_root?: string
				state_root?: string
				body_root?: string
			}
			signature?: string
		}
	}
}

/** Beacon REST `/eth/v1/beacon/states/…/validators/…` (Ethereum beacon-APIs). */
export type BeaconValidatorSummary = {
	balanceGwei: bigint
	effectiveBalanceGwei: bigint
	pubkey: `0x${string}`
	slashed: boolean
	status: string
}

/** Response payload for `GET /eth/v1/beacon/states/head/validators/{index}`. */
export type BeaconValidatorResponse = {
	data?: {
		balance?: string
		index?: string
		status?: string
		validator?: {
			effective_balance?: string
			pubkey?: string
			slashed?: boolean
		}
	}
}

export type BeaconFinalityCheckpoint = {
	epoch: number
	root: `0x${string}`
}

export type BeaconFinalityCheckpoints = {
	previousJustified: BeaconFinalityCheckpoint
	currentJustified: BeaconFinalityCheckpoint
	finalized: BeaconFinalityCheckpoint
}

/** `GET /eth/v1/beacon/genesis` */
export type BeaconGenesisResponse = {
	data?: {
		genesis_time?: string
	}
}

/** One row from `GET /eth/v1/config/fork_schedule`. */
export type BeaconForkScheduleEntry = {
	epoch: number
	previousVersion: `0x${string}`
	currentVersion: `0x${string}`
}

export type BeaconCommittee = {
	slot: number
	index: number
	validatorIndices: number[]
}

export type BeaconSyncCommittee = {
	validatorIndices: number[]
}

export type BeaconBlockDutySummary = {
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
