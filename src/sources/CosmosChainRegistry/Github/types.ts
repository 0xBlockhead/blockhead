export type CosmosChainRegistryChain = {
	chain_name: string
	chain_id: string
	pretty_name?: string
	status?: string
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
