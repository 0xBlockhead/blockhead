import { type as arktype } from 'arktype'

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

export type EigenExplorerAllocation = {
	avsAddress: string
	operatorSetId: number
	operatorAddress: string
	strategyAddress: string
	magnitude: string
	effectBlock: number
	createdAt: string
	createdAtBlock: number
	updatedAt: string
	updatedAtBlock: number
}

export type EigenExplorerSlash = {
	avsAddress: string
	operatorSetId: number
	operatorAddress: string
	strategies: string[]
	wadSlashed: string[]
	description: string
	createdAt: string
	createdAtBlock: number
	updatedAt: string
	updatedAtBlock: number
}

export type EigenExplorerRewardStrategy = {
	strategyAddress: string
	tokens: string[]
}


export const eigenExplorerStrategySharesEnvelope = arktype({
	strategyAddress: 'string',
	shares: 'string',
})

export const eigenExplorerStakerEnvelope = arktype({
	address: 'string',
	operatorAddress: 'string | null',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
})

export const eigenExplorerDepositEnvelope = arktype({
	transactionHash: 'string',
	stakerAddress: 'string',
	tokenAddress: 'string',
	strategyAddress: 'string',
	shares: 'string',
	createdAtBlock: 'number',
	createdAt: 'string',
})

export const eigenExplorerWithdrawalEnvelope = arktype({
	withdrawalRoot: 'string',
	nonce: 'number',
	stakerAddress: 'string',
	delegatedTo: 'string',
	withdrawerAddress: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
	createdAtBlock: 'number',
	createdAt: 'string',
	updatedAtBlock: 'number',
	updatedAt: 'string',
	isCompleted: 'boolean',
})

export const eigenExplorerOperatorRewardInfoEnvelope = arktype({
	address: 'string',
	rewardTokens: 'string[]',
	rewardStrategies: 'string[]',
})

export const eigenExplorerOperatorEnvelope = arktype({
	address: 'string',
	metadataName: 'string',
	metadataDescription: 'string | null',
	metadataWebsite: 'string | null',
	metadataLogo: 'string | null',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
})

export const eigenExplorerAvsEnvelope = arktype({
	address: 'string',
	metadataName: 'string',
	metadataDescription: 'string | null',
	metadataWebsite: 'string | null',
	metadataLogo: 'string | null',
	totalStakers: 'number',
	totalOperators: 'number',
	createdAtBlock: 'string',
	updatedAtBlock: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	shares: eigenExplorerStrategySharesEnvelope.array(),
})

const eigenExplorerPageMetaEnvelope = arktype({
	total: 'number',
	skip: 'number',
	take: 'number',
})

export const eigenExplorerDepositPageEnvelope = arktype({
	data: eigenExplorerDepositEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerWithdrawalPageEnvelope = arktype({
	data: eigenExplorerWithdrawalEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerOperatorPageEnvelope = arktype({
	data: eigenExplorerOperatorEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerAvsPageEnvelope = arktype({
	data: eigenExplorerAvsEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerRewardStrategyEnvelope = arktype({
	strategyAddress: 'string',
	tokens: 'string[]',
})

export const eigenExplorerRewardStrategiesEnvelope = arktype({
	strategies: eigenExplorerRewardStrategyEnvelope.array(),
	total: 'number',
})

export const eigenExplorerAllocationEnvelope = arktype({
	avsAddress: 'string',
	operatorSetId: 'number',
	operatorAddress: 'string',
	strategyAddress: 'string',
	magnitude: 'string',
	effectBlock: 'number',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
})

export const eigenExplorerSlashEnvelope = arktype({
	avsAddress: 'string',
	operatorSetId: 'number',
	operatorAddress: 'string',
	strategies: 'string[]',
	wadSlashed: 'string[]',
	description: 'string',
	createdAt: 'string',
	createdAtBlock: 'number',
	updatedAt: 'string',
	updatedAtBlock: 'number',
})

export const eigenExplorerAllocationPageEnvelope = arktype({
	data: eigenExplorerAllocationEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerSlashPageEnvelope = arktype({
	data: eigenExplorerSlashEnvelope.array(),
	meta: eigenExplorerPageMetaEnvelope,
})

export const eigenExplorerStrategyTvlEnvelope = arktype({
	tvl: 'number',
	tvlEth: 'number',
	'change24h?': {
		value: 'number',
		percent: 'number',
	},
	'change7d?': {
		value: 'number',
		percent: 'number',
	},
})
