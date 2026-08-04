export type CompoundCometConfigurationAssetWire = {
	address: string
	priceFeed: string
	decimals: string
	borrowCF: number
	liquidateCF: number
	liquidationFactor: number
	supplyCap: string
}

export type CompoundCometConfigurationWire = {
	name: string
	symbol: string
	baseToken: string
	baseTokenAddress: string
	baseTokenPriceFeed: string
	borrowMin?: string
	governor?: string
	pauseGuardian?: string
	storeFrontPriceFactor?: number
	targetReserves?: string
	rewardTokenAddress?: string
	rates?: {
		supplyKink: number
		supplySlopeLow: number
		supplySlopeHigh: number
		supplyBase: number
		borrowKink: number
		borrowSlopeLow: number
		borrowSlopeHigh: number
		borrowBase: number
	}
	assets: Record<string, CompoundCometConfigurationAssetWire>
}

export type CompoundCometRootsWire = {
	comet: string
	configurator?: string
	rewards?: string
	bulker?: string
}

export type CompoundCometConfiguration = {
	name: string
	symbol: string
	baseTokenSymbol: string
	baseTokenAddress: `0x${string}`
	baseTokenPriceFeedAddress: `0x${string}`
	borrowMin?: string
	governorAddress?: `0x${string}`
	pauseGuardianAddress?: `0x${string}`
	storeFrontPriceFactor?: number
	targetReserves?: string
	rewardTokenAddress?: `0x${string}`
	collateralAssetCount: number
}

export type CompoundCometRoots = {
	cometAddress: `0x${string}`
	configuratorAddress?: `0x${string}`
	rewardsAddress?: `0x${string}`
	bulkerAddress?: `0x${string}`
}
