import { type as arktype } from 'arktype'

export type AaveChainWire = {
	chainId: number
	name: string
	icon?: string
}

export type AaveMarketWire = {
	name: string
	address: string
	icon: string
	totalMarketSize: string
	totalAvailableLiquidity: string
	chain: AaveChainWire
}

export type AaveMarketsData = {
	markets: AaveMarketWire[]
}

export type AaveMarketData = {
	market: AaveMarketWire | null
}

export const aaveMarketEnvelope = arktype({
	name: 'string',
	address: 'string',
	icon: 'string',
	totalMarketSize: 'string',
	totalAvailableLiquidity: 'string',
	chain: {
		chainId: 'number',
		name: 'string',
		'icon?': 'string',
	},
})
export const aaveMarketsEnvelope = aaveMarketEnvelope.array()
