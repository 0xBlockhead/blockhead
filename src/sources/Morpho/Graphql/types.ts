export type MorphoGraphqlMarketWire = {
	marketId?: string
	chain?: {
		id?: number
	}
	loanAsset?: {
		address?: string
	}
	collateralAsset?: {
		address?: string
	}
	lltv?: string
	irmAddress?: string
	oracle?: {
		address?: string
	}
}

export type MorphoGraphqlMarket = {
	marketId: `0x${string}`
	chainId: number
	loanAssetAddress: `0x${string}`
	collateralAssetAddress: `0x${string}`
	lltvWad: string
	irmAddress: `0x${string}`
	oracleAddress: `0x${string}`
}

export type MorphoGraphqlMarketsData = {
	markets?: {
		items?: MorphoGraphqlMarketWire[]
	}
}

export type MorphoGraphqlMarketData = {
	marketById?: MorphoGraphqlMarketWire
}
