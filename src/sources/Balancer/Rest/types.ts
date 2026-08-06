import { type as arktype } from 'arktype'

export type BalancerPoolTokenWire = {
	address: string
	symbol: string
	balance: string
	decimals: number
	weight: string | null
}

export type BalancerPoolAprItemWire = {
	title: string
	type: string
	apr: number
}

export type BalancerPoolStakingGaugeWire = {
	gaugeAddress: string
	version: number
}

export type BalancerPoolStakingWire = {
	type: string
	gauge: BalancerPoolStakingGaugeWire | null
}

export type BalancerPoolDynamicDataWire = {
	totalLiquidity: string
	totalShares: string
	swapFee: string
	aprItems?: BalancerPoolAprItemWire[]
}

export type BalancerUserStakedBalanceWire = {
	balance: string
	balanceUsd: number
	stakingId: string
	stakingType: string
}

export type BalancerUserBalanceWire = {
	stakedBalances: BalancerUserStakedBalanceWire[]
	walletBalance: string
	walletBalanceUsd: number
	totalBalance: string
	totalBalanceUsd: number
}

export type BalancerPoolWire = {
	id: string
	address: string
	name: string
	type: string
	version: number
	protocolVersion: number
	chain: string
	poolTokens: BalancerPoolTokenWire[]
	dynamicData: BalancerPoolDynamicDataWire
	staking?: BalancerPoolStakingWire | null
	userBalance?: BalancerUserBalanceWire | null
}

export type BalancerPoolData = {
	poolGetPool?: BalancerPoolWire | null
}

export type BalancerPoolsData = {
	poolGetPools?: BalancerPoolWire[]
}

export type BalancerPoolsCountData = {
	poolGetPoolsCount?: number
}

export type BalancerVotingGaugeTokenWire = {
	address: string
	symbol: string
	logoURI?: string | null
}

export type BalancerVotingGaugeWire = {
	address: string
	relativeWeightCap?: string | null
	isKilled: boolean
}

export type BalancerVotingPoolWire = {
	id: string
	address: string
	chain: string
	type: string
	symbol: string
	protocolVersion: number
	gauge: BalancerVotingGaugeWire
	tokens: BalancerVotingGaugeTokenWire[]
}

export type BalancerVotingListData = {
	veBalGetVotingList?: BalancerVotingPoolWire[]
}

export type BalancerVeBalUserBalanceData = {
	veBalGetUserBalance?: string
}

export type BalancerVeBalUserWire = {
	balance: string
	locked: string
	lockedUsd: string
	rank: number | null
}

export type BalancerVeBalUserData = {
	veBalGetUser?: BalancerVeBalUserWire | null
}

export type BalancerPoolEventWire = {
	id: string
	type: string
	chain: string
	poolId: string
	valueUSD: number
	blockNumber: number
	blockTimestamp: number
	tx: string
	userAddress: string
}

export type BalancerPoolEventsData = {
	poolEvents?: BalancerPoolEventWire[]
}

export type BalancerPool = {
	id: `0x${string}`
	address: `0x${string}`
	name: string
	type: string
	version: number
	protocolVersion: number
	chainId: number
	vaultAddress: `0x${string}`
	swapFee: string
	totalLiquidity: string
	totalShares: string
	poolTokens: {
		address: `0x${string}`
		symbol: string
		balance: string
		decimals: number
		weight?: string
	}[]
	aprItems: {
		title: string
		type: string
		apr: number
	}[]
	gaugeAddress?: `0x${string}`
	gaugeVersion?: number
	stakingType?: string
}

export type BalancerAccountPoolBalance = {
	poolId: `0x${string}`
	poolAddress: `0x${string}`
	chainId: number
	totalBalance: string
	totalBalanceUsd: number
	walletBalance: string
	walletBalanceUsd: number
	stakedBalances: {
		balance: string
		balanceUsd: number
		stakingId: string
		stakingType: string
	}[]
	gaugeAddress?: `0x${string}`
	gaugeVersion?: number
	stakingType?: string
}

export type BalancerVotingGauge = {
	poolId: `0x${string}`
	poolAddress: `0x${string}`
	chainId: number
	poolType: string
	symbol: string
	protocolVersion: number
	gaugeAddress: `0x${string}`
	isKilled: boolean
	relativeWeightCap?: string
	tokens: {
		address: `0x${string}`
		symbol: string
		logoURI?: string
	}[]
}

export type BalancerVeBalUser = {
	chainId: number
	account: `0x${string}`
	balance: string
	locked: string
	lockedUsd: string
	rank?: number
}

export type BalancerPoolEvent = {
	id: string
	type: string
	chainId: number
	poolId: `0x${string}`
	valueUsd: number
	blockNumber: number
	blockTimestampMs: number
	txHash: `0x${string}`
	userAddress: `0x${string}`
}

const balancerPoolTokenEnvelope = arktype({
	address: 'string',
	symbol: 'string',
	balance: 'string',
	decimals: 'number',
	'weight?': 'string | null',
})

const balancerPoolAprItemEnvelope = arktype({
	title: 'string',
	type: 'string',
	apr: 'number',
})

const balancerPoolStakingEnvelope = arktype({
	type: 'string',
	gauge: arktype({
		gaugeAddress: 'string',
		version: 'number',
	}).or(arktype.null),
})

const balancerUserStakedBalanceEnvelope = arktype({
	balance: 'string',
	balanceUsd: 'number',
	stakingId: 'string',
	stakingType: 'string',
})

export const balancerUserBalanceEnvelope = arktype({
	stakedBalances: balancerUserStakedBalanceEnvelope.array(),
	walletBalance: 'string',
	walletBalanceUsd: 'number',
	totalBalance: 'string',
	totalBalanceUsd: 'number',
})

const balancerPoolEnvelope = arktype({
	id: 'string',
	address: 'string',
	name: 'string',
	type: 'string',
	version: 'number',
	protocolVersion: 'number',
	chain: 'string',
	poolTokens: balancerPoolTokenEnvelope.array(),
	dynamicData: {
		totalLiquidity: 'string',
		totalShares: 'string',
		swapFee: 'string',
		'aprItems?': balancerPoolAprItemEnvelope.array(),
	},
	'staking?': balancerPoolStakingEnvelope.or(arktype.null),
	'userBalance?': balancerUserBalanceEnvelope.or(arktype.null),
})

export const balancerPoolListEnvelope = balancerPoolEnvelope.array()

export const balancerPoolDetailEnvelope = balancerPoolEnvelope

export const balancerPoolsCountEnvelope = arktype('number')

export const balancerVotingPoolEnvelope = arktype({
	id: 'string',
	address: 'string',
	chain: 'string',
	type: 'string',
	symbol: 'string',
	protocolVersion: 'number',
	gauge: {
		address: 'string',
		'relativeWeightCap?': 'string | null',
		isKilled: 'boolean',
	},
	tokens: arktype({
		address: 'string',
		symbol: 'string',
		'logoURI?': 'string | null',
	}).array(),
})

export const balancerVotingListEnvelope = balancerVotingPoolEnvelope.array()

export const balancerVeBalUserBalanceEnvelope = arktype('string')

export const balancerVeBalUserEnvelope = arktype({
	balance: 'string',
	locked: 'string',
	lockedUsd: 'string',
	rank: 'number | null',
})

export const balancerPoolEventEnvelope = arktype({
	id: 'string',
	type: 'string',
	chain: 'string',
	poolId: 'string',
	valueUSD: 'number',
	blockNumber: 'number',
	blockTimestamp: 'number',
	tx: 'string',
	userAddress: 'string',
})

export const balancerPoolEventsEnvelope = balancerPoolEventEnvelope.array()
