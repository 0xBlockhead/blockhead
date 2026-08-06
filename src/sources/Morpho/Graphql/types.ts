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

export type MorphoGraphqlVaultWire = {
	address?: string
	symbol?: string
	name?: string
	listed?: boolean
	asset?: {
		address?: string
		decimals?: number
	}
	chain?: {
		id?: number
	}
}

export type MorphoGraphqlVault = {
	address: `0x${string}`
	chainId: number
	symbol: string
	name: string
	listed: boolean
	assetAddress: `0x${string}`
	assetDecimals: number
}

export type MorphoGraphqlVaultsData = {
	vaults?: {
		items?: MorphoGraphqlVaultWire[]
	}
}

export type MorphoGraphqlVaultData = {
	vaultByAddress?: MorphoGraphqlVaultWire
}

export type MorphoGraphqlAccountMarketPositionWire = {
	market?: {
		marketId?: string
	}
	state?: {
		supplyAssets?: string
		supplyShares?: string
		borrowAssets?: string
		borrowShares?: string
		collateral?: string
		supplyAssetsUsd?: number
		borrowAssetsUsd?: number
		collateralUsd?: number
	}
}

export type MorphoGraphqlAccountVaultPositionWire = {
	vault?: {
		address?: string
		name?: string
		symbol?: string
	}
	state?: {
		assets?: string
		shares?: string
		assetsUsd?: number
	}
}

export type MorphoGraphqlAccountPositionsData = {
	userByAddress?: {
		address?: string
		marketPositions?: MorphoGraphqlAccountMarketPositionWire[]
		vaultPositions?: MorphoGraphqlAccountVaultPositionWire[]
	} | null
}

export type MorphoGraphqlAccountMarketPosition = {
	protocol: 'Morpho Blue'
	kind: 'market'
	chainId: number
	account: `0x${string}`
	marketId: `0x${string}`
	supplyAssets: string
	supplyShares: string
	borrowAssets: string
	borrowShares: string
	collateral: string
	supplyAssetsUsd?: number
	borrowAssetsUsd?: number
	collateralUsd?: number
}

export type MorphoGraphqlAccountVaultPosition = {
	protocol: 'Morpho Vault'
	kind: 'vault'
	chainId: number
	account: `0x${string}`
	vaultAddress: `0x${string}`
	vaultName: string
	vaultSymbol: string
	assets: string
	shares: string
	assetsUsd?: number
}

export type MorphoGraphqlAccountPosition =
	| MorphoGraphqlAccountMarketPosition
	| MorphoGraphqlAccountVaultPosition
