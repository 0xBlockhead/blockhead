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
