export type CosmosChainRegistryLogoUris = {
	png?: string
	svg?: string
}

export type CosmosChainRegistryChain = {
	chain_name: string
	chain_id: string
	pretty_name?: string
	status?: string
	logo_URIs?: CosmosChainRegistryLogoUris
	images?: CosmosChainRegistryLogoUris[]
}

export type CosmosChainRegistryAssetList = {
	assets: {
		base: string
		name: string
		symbol: string
		display?: string
		type_asset?: string
		denom_units?: {
			denom: string
			exponent: number
		}[]
	}[]
}
