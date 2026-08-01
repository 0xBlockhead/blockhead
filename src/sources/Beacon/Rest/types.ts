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
