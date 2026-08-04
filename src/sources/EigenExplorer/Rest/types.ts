export type EigenExplorerPage<_Row> = {
	data: _Row[]
	meta: {
		total: number
		skip: number
		take: number
	}
}

export type EigenExplorerStrategyShares = {
	strategyAddress: string
	shares: string
}

export type EigenExplorerStaker = {
	address: string
	operatorAddress: string | null
	createdAtBlock: string
	updatedAtBlock: string
	createdAt: string
	updatedAt: string
	shares: EigenExplorerStrategyShares[]
}

export type EigenExplorerDeposit = {
	transactionHash: string
	stakerAddress: string
	tokenAddress: string
	strategyAddress: string
	shares: string
	createdAtBlock: number
	createdAt: string
}

export type EigenExplorerWithdrawal = {
	withdrawalRoot: string
	nonce: number
	stakerAddress: string
	delegatedTo: string
	withdrawerAddress: string
	shares: EigenExplorerStrategyShares[]
	createdAtBlock: number
	createdAt: string
	updatedAtBlock: number
	updatedAt: string
	isCompleted: boolean
}

export type EigenExplorerOperatorRewardInfo = {
	address: string
	rewardTokens: string[]
	rewardStrategies: string[]
}

export type EigenExplorerOperator = {
	address: string
	metadataName: string
	metadataDescription: string | null
	metadataWebsite: string | null
	metadataLogo: string | null
	createdAtBlock: string
	updatedAtBlock: string
	createdAt: string
	updatedAt: string
	shares: EigenExplorerStrategyShares[]
}

export type EigenExplorerAvs = {
	address: string
	metadataName: string
	metadataDescription: string | null
	metadataWebsite: string | null
	metadataLogo: string | null
	totalStakers: number
	totalOperators: number
	createdAtBlock: string
	updatedAtBlock: string
	createdAt: string
	updatedAt: string
	shares: EigenExplorerStrategyShares[]
}
