import { type as arktype } from 'arktype'

export type CompoundCometConfigurationAssetWire = {
	address: string
	priceFeed: string
	decimals: string
	borrowCF: number
	liquidateCF: number
	liquidationFactor: number
	supplyCap: string
}

/**
 * Interest-rate curve params from official `configuration.json` `rates`.
 * @see https://docs.compound.finance/interest-rates/
 * @see https://docs.compound.finance/helper-functions/#get-protocol-configuration
 */
export type CompoundCometRatesWire = {
	supplyKink: number
	supplySlopeLow: number
	supplySlopeHigh: number
	supplyBase: number
	borrowKink: number
	borrowSlopeLow: number
	borrowSlopeHigh: number
	borrowBase: number
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
	rates: CompoundCometRatesWire
	assets: Record<string, CompoundCometConfigurationAssetWire>
}

export type CompoundCometRootsWire = {
	comet: string
	configurator?: string
	rewards?: string
	bulker?: string
}

export const compoundCometConfigurationEnvelope = arktype({
	name: 'string',
	symbol: 'string',
	baseToken: 'string',
	baseTokenAddress: 'string',
	baseTokenPriceFeed: 'string',
	'borrowMin?': 'string',
	'governor?': 'string',
	'pauseGuardian?': 'string',
	'storeFrontPriceFactor?': 'number',
	'targetReserves?': 'string',
	'rewardTokenAddress?': 'string',
	rates: {
		supplyKink: 'number',
		supplySlopeLow: 'number',
		supplySlopeHigh: 'number',
		supplyBase: 'number',
		borrowKink: 'number',
		borrowSlopeLow: 'number',
		borrowSlopeHigh: 'number',
		borrowBase: 'number',
	},
	assets: {
		'[string]': {
			address: 'string',
			priceFeed: 'string',
			decimals: '/^(0|[1-9][0-9]*)$/',
			borrowCF: 'number',
			liquidateCF: 'number',
			liquidationFactor: 'number',
			supplyCap: 'string',
		},
	},
})
export const compoundCometRootsEnvelope = arktype({
	comet: 'string',
	'configurator?': 'string',
	'rewards?': 'string',
	'bulker?': 'string',
})

export type CompoundCometConfigurationAsset = {
	symbol: string
	tokenAddress: `0x${string}`
	priceFeedAddress: `0x${string}`
	decimals: number
	borrowCF: number
	liquidateCF: number
	liquidationFactor: number
	supplyCap: string
}

/**
 * Normalized Comet interest-rate model from deployment `rates`
 * (kink utilization + piecewise slopes/base — not live utilization/APY).
 * @see https://docs.compound.finance/interest-rates/
 */
export type CompoundCometRates = {
	supplyKink: number
	supplySlopeLow: number
	supplySlopeHigh: number
	supplyBase: number
	borrowKink: number
	borrowSlopeLow: number
	borrowSlopeHigh: number
	borrowBase: number
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
	rates: CompoundCometRates
	collateralAssetCount: number
	assets: CompoundCometConfigurationAsset[]
}

export type CompoundCometRoots = {
	cometAddress: `0x${string}`
	configuratorAddress?: `0x${string}`
	rewardsAddress?: `0x${string}`
	bulkerAddress?: `0x${string}`
}
