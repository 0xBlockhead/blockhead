import { type as arktype } from 'arktype'


export type PendleMarketDetailsWire = {
	liquidity: number
	totalTvl: number
	tradingVolume: number
	underlyingApy: number
	swapFeeApy: number
	pendleApy: number
	ytFloatingApy: number
	impliedApy: number
	feeRate: number
	totalPt: number
	totalSy: number
	totalSupply: number
	totalActiveSupply: number
	aggregatedApy: number
	maxBoostedApy: number
}

export type PendleMarketWire = {
	name: string
	protocol: string
	icon: string
	address: string
	expiry: string
	pt: string
	yt: string
	sy: string
	underlyingAsset: string
	accountingAsset: string
	details: PendleMarketDetailsWire
	isNew: boolean
	isPrime: boolean
	timestamp: string
	categoryIds: string[]
	chainId: number
}

export type PendleMarketsAllResponseWire = {
	total: number
	limit: number
	skip: number
	results: PendleMarketWire[]
}

export type PendleMarketDetails = {
	liquidityUsd: number
	totalTvlUsd: number
	tradingVolumeUsd: number
	underlyingApy: number
	swapFeeApy: number
	pendleApy: number
	ytFloatingApy: number
	impliedApy: number
	feeRate: number
	totalPt: number
	totalSy: number
	totalSupply: number
	totalActiveSupply: number
	aggregatedApy: number
	maxBoostedApy: number
}

export type PendleMarket = {
	chainId: number
	marketAddress: `0x${string}`
	name: string
	protocol: string
	icon: string
	expiryTimestampMs: number
	ptAddress: `0x${string}`
	ytAddress: `0x${string}`
	syAddress: `0x${string}`
	underlyingAssetAddress: `0x${string}`
	accountingAssetAddress: `0x${string}`
	categoryIds: string[]
	isNew: boolean
	isPrime: boolean
	observedAtTimestampMs: number
	details: PendleMarketDetails
}

export type PendleMarketsPage = {
	total: number
	limit: number
	skip: number
	markets: PendleMarket[]
}

/** Wire for `GET /v1/sdk/{chainId}/markets/{market}/tokens`. */
export type PendleMarketTokensWire = {
	tokensMintSy: string[]
	tokensRedeemSy: string[]
	tokensIn: string[]
	tokensOut: string[]
}

export type PendleMarketTokens = {
	chainId: number
	marketAddress: `0x${string}`
	tokensMintSy: `0x${string}`[]
	tokensRedeemSy: `0x${string}`[]
	tokensIn: `0x${string}`[]
	tokensOut: `0x${string}`[]
}

export const pendleMarketDetailsEnvelope = arktype({
	liquidity: 'number',
	totalTvl: 'number',
	tradingVolume: 'number',
	underlyingApy: 'number',
	swapFeeApy: 'number',
	pendleApy: 'number',
	ytFloatingApy: 'number',
	impliedApy: 'number',
	feeRate: 'number',
	totalPt: 'number',
	totalSy: 'number',
	totalSupply: 'number',
	totalActiveSupply: 'number',
	aggregatedApy: 'number',
	maxBoostedApy: 'number',
})

export const pendleMarketEnvelope = arktype({
	name: 'string',
	protocol: 'string',
	icon: 'string',
	address: 'string',
	expiry: 'string',
	pt: 'string',
	yt: 'string',
	sy: 'string',
	underlyingAsset: 'string',
	accountingAsset: 'string',
	details: pendleMarketDetailsEnvelope,
	isNew: 'boolean',
	isPrime: 'boolean',
	timestamp: 'string',
	categoryIds: 'string[]',
	chainId: 'number',
	'rewardTokens?': 'string[]',
	'inputTokens?': 'string[]',
	'outputTokens?': 'string[]',
}).onUndeclaredKey('reject')

export const pendleMarketsAllEnvelope = arktype({
	total: 'number',
	limit: 'number',
	skip: 'number',
	results: pendleMarketEnvelope.array(),
})

export const pendleMarketTokensEnvelope = arktype({
	tokensMintSy: 'string[]',
	tokensRedeemSy: 'string[]',
	tokensIn: 'string[]',
	tokensOut: 'string[]',
})
