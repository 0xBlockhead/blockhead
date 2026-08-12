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
