export type CoingeckoCoinImage = {
	thumb?: string
	small?: string
	large?: string
}

export type CoingeckoDetailPlatform = {
	decimal_place?: number | null
	contract_address?: string
}

export type CoingeckoCoin = {
	id: string
	symbol: string
	name: string
	image?: CoingeckoCoinImage
	asset_platform_id?: string | null
	platforms?: Record<string, string>
	detail_platforms?: Record<string, CoingeckoDetailPlatform>
}

export type CoingeckoAssetPlatform = {
	id: string
	name: string
	shortname?: string
	chain_identifier?: number | null
	native_coin_id?: string | null
}
