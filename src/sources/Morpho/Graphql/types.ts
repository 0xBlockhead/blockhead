export type MorphoGraphqlMarket = {
	marketId: string
	chain: {
		id: number
	}
	loanAsset: {
		address: string
	}
	collateralAsset: {
		address: string
	}
	lltv: string
	irmAddress: string
	oracle: {
		address: string
	}
}

export type MorphoGraphqlMarketsData = {
	markets: {
		items: MorphoGraphqlMarket[]
	}
}
