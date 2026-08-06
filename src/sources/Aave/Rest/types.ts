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

export type AaveUserSupplyPositionWire = {
	market: {
		address: string
		chain: {
			chainId: number
		}
	}
	currency: {
		address: string
		symbol: string
		decimals: number
		name?: string
		chainId: number
	}
	balance: {
		amount: {
			value: string
		}
		usd: string
	}
	apy: {
		value: string
	}
	isCollateral: boolean
	canBeCollateral: boolean
}

export type AaveUserBorrowPositionWire = {
	market: {
		address: string
		chain: {
			chainId: number
		}
	}
	currency: {
		address: string
		symbol: string
		decimals: number
		name?: string
		chainId: number
	}
	debt: {
		amount: {
			value: string
		}
		usd: string
	}
	apy: {
		value: string
	}
}

export type AaveAccountPositionsData = {
	userSupplies: AaveUserSupplyPositionWire[]
	userBorrows: AaveUserBorrowPositionWire[]
}

export type AaveAccountSupplyPosition = {
	protocol: 'Aave V3'
	kind: 'supply'
	chainId: number
	account: `0x${string}`
	poolAddress: `0x${string}`
	underlyingTokenAddress: `0x${string}`
	symbol: string
	decimals: number
	balance: string
	balanceUsd: string
	apy: string
	isCollateral: boolean
	canBeCollateral: boolean
}

export type AaveAccountBorrowPosition = {
	protocol: 'Aave V3'
	kind: 'borrow'
	chainId: number
	account: `0x${string}`
	poolAddress: `0x${string}`
	underlyingTokenAddress: `0x${string}`
	symbol: string
	decimals: number
	debt: string
	debtUsd: string
	apy: string
}

export type AaveAccountPosition =
	| AaveAccountSupplyPosition
	| AaveAccountBorrowPosition

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

const aaveAccountPositionMarketWire = arktype({
	address: 'string',
	chain: {
		chainId: 'number',
	},
})

const aaveAccountPositionCurrencyWire = arktype({
	address: 'string',
	symbol: 'string',
	decimals: 'number.integer >= 0',
	'name?': 'string',
	chainId: 'number',
})

export const aaveUserSupplyPositionEnvelope = arktype({
	market: aaveAccountPositionMarketWire,
	currency: aaveAccountPositionCurrencyWire,
	balance: {
		amount: {
			value: 'string',
		},
		usd: 'string',
	},
	apy: {
		value: 'string',
	},
	isCollateral: 'boolean',
	canBeCollateral: 'boolean',
})

export const aaveUserBorrowPositionEnvelope = arktype({
	market: aaveAccountPositionMarketWire,
	currency: aaveAccountPositionCurrencyWire,
	debt: {
		amount: {
			value: 'string',
		},
		usd: 'string',
	},
	apy: {
		value: 'string',
	},
})

export const aaveAccountPositionsEnvelope = arktype({
	userSupplies: aaveUserSupplyPositionEnvelope.array(),
	userBorrows: aaveUserBorrowPositionEnvelope.array(),
})
