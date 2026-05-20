export type BeaconHeader = {
	bodyRoot: string
	canonical: boolean | undefined
	parentRoot: string
	proposerIndex: number
	root: string
	slot: number
	stateRoot: string
}

/** Beacon REST `/eth/v1/beacon/states/…/validators/…` (Ethereum beacon-APIs). */
export type BeaconValidatorSummary = {
	balanceGwei: bigint
	effectiveBalanceGwei: bigint
	pubkey: `0x${string}`
	slashed: boolean
	status: string
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

/** One row from `GET /eth/v1/config/fork_schedule`. */
export type BeaconForkScheduleEntry = {
	epoch: number
	previousVersion: `0x${string}`
	currentVersion: `0x${string}`
}
