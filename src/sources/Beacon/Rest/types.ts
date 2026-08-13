export type BeaconBlockDutySummary = {
	deposits: {
		index: number
		indexInBlock: number
		pubkey: string
		withdrawalCredentials: string
		amountGwei: bigint
		signature: string
		proof: string[]
	}[]
	attestations: {
		index: number
		indexInBlock: number
		committeeIndex?: number
		aggregationBits?: string
	}[]
	withdrawals: {
		index: number
		withdrawalIndex: number
		indexInBlock: number
		validatorIndex?: number
		address?: string
		amountGwei?: bigint
	}[]
	slashings: {
		index: number
		indexInKind: number
		kind: 'attester' | 'proposer'
	}[]
}

export type BeaconExecutionPayloadBid = {
	builderIndex: number
	slot: number
	parentExecutionBlockHash: string
	parentBeaconBlockRoot: string
	executionBlockHash: string
	prevRandao: string
	feeRecipient: string
	gasLimit: bigint
	valueGwei: bigint
	executionPaymentGwei: bigint
	blobKzgCommitments: string[]
	executionRequestsRoot: string
	signature: string
}

export type BeaconBlockSnapshot = BeaconBlockDutySummary & {
	version: string
	root: string
	slot: number
	proposerIndex: number
	parentRoot: string
	stateRoot: string
	bodyRoot: string
	signature: string
	canonical: boolean
	executionOptimistic: boolean
	finalized: boolean
	executionBlockHash?: string
	executionPayloadBid?: BeaconExecutionPayloadBid
}

export type BeaconExecutionRequests = {
	deposits: {
		pubkey: string
		withdrawalCredentials: string
		amountGwei: bigint
		signature: string
		requestIndex: bigint
	}[]
	withdrawals: {
		sourceAddress: string
		validatorPubkey: string
		amountGwei: bigint
	}[]
	consolidations: {
		sourceAddress: string
		sourcePubkey: string
		targetPubkey: string
	}[]
}

export type BeaconExecutionPayloadEnvelope = {
	version: 'gloas'
	executionOptimistic: boolean
	finalized: boolean
	beaconBlockRoot: string
	parentBeaconBlockRoot: string
	builderIndex: number
	signature: string
	executionBlockHash: string
	parentExecutionBlockHash: string
	blockNumber: bigint
	feeRecipient: string
	gasLimit: bigint
	gasUsed: bigint
	timestampSeconds: bigint
	slotNumber: number
	baseFeePerGas: bigint
	blobGasUsed: bigint
	excessBlobGas: bigint
	blockAccessList: string
	transactionCount: number
	executionRequests: BeaconExecutionRequests
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

export type BeaconDataColumnSidecars = {
	version: 'fulu' | 'gloas'
	executionOptimistic: boolean
	finalized: boolean
	sidecars: {
		index: number
		columns: string[]
		kzgProofs: string[]
		kzgCommitments: string[]
		beaconBlockRoot: string | undefined
		slot: number | undefined
	}[]
}
