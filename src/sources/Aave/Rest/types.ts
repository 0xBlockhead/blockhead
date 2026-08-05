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

export type AaveAmountWire = {
	value: string
}

export type AaveReserveWire = {
	underlyingToken: {
		address: string
		name: string
		symbol: string
		decimals: number
		imageUrl: string
		chainId: number
	}
	isFrozen: boolean
	isPaused: boolean
	size: {
		amount: AaveAmountWire
	}
	supplyInfo: {
		apy: AaveAmountWire
	}
	borrowInfo?: {
		apy: AaveAmountWire
		availableLiquidity: {
			amount: AaveAmountWire
		}
	}
}

export type AaveMarketSnapshotWire = AaveMarketWire & {
	reserves: AaveReserveWire[]
}

export type AaveMarketsData = {
	markets: AaveMarketWire[]
}

export type AaveMarketData = {
	market: AaveMarketSnapshotWire | null
}

const aaveMarketSummaryEnvelope = arktype({
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
export const aaveMarketEnvelope = aaveMarketSummaryEnvelope.and({
	reserves: arktype({
		underlyingToken: {
			address: 'string',
			name: 'string',
			symbol: 'string',
			decimals: 'number.integer >= 0',
			imageUrl: 'string',
			chainId: 'number',
		},
		isFrozen: 'boolean',
		isPaused: 'boolean',
		size: {
			amount: {
				value: 'string',
			},
		},
		supplyInfo: {
			apy: {
				value: 'string',
			},
		},
		'borrowInfo?': {
			apy: {
				value: 'string',
			},
			availableLiquidity: {
				amount: {
					value: 'string',
				},
			},
		},
	}).array(),
})
export const aaveMarketsEnvelope = aaveMarketSummaryEnvelope.array()
