import { type as arktype } from 'arktype'

export type CosmosChainRegistryLogoUris = {
	png?: string
	svg?: string
}

export type CosmosChainRegistryIbcTrace = {
	type: string
	counterparty: {
		chain_name: string
		base_denom: string
		channel_id?: string
	}
	chain?: {
		channel_id?: string
		path?: string
	}
}

export type CosmosChainRegistryAsset = {
	base: string
	name: string
	symbol: string
	display?: string
	type_asset?: string
	denom_units?: {
		denom: string
		exponent: number
	}[]
	traces?: CosmosChainRegistryIbcTrace[]
}

export type CosmosChainRegistryChain = {
	chain_name: string
	chain_id: string
	pretty_name?: string
	status?: string
	network_type?: string
	bech32_prefix?: string
	logo_URIs?: CosmosChainRegistryLogoUris
	images?: CosmosChainRegistryLogoUris[]
}

export type CosmosChainRegistryAssetList = {
	chain_name: string
	assets: CosmosChainRegistryAsset[]
}

const nonEmptyString = arktype('string > 0')
const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)

export const cosmosChainRegistryLogoUrisWire = arktype({
	'png?': nonEmptyString,
	'svg?': nonEmptyString,
})

export const cosmosChainRegistryChainWire = arktype({
	chain_name: nonEmptyString,
	chain_id: nonEmptyString,
	'pretty_name?': nonEmptyString,
	'status?': nonEmptyString,
	'network_type?': nonEmptyString,
	'bech32_prefix?': nonEmptyString,
	'logo_URIs?': cosmosChainRegistryLogoUrisWire,
	'images?': cosmosChainRegistryLogoUrisWire.array(),
})

export const cosmosChainRegistryIbcTraceWire = arktype({
	type: nonEmptyString,
	counterparty: {
		chain_name: nonEmptyString,
		base_denom: nonEmptyString,
		'channel_id?': nonEmptyString,
	},
	'chain?': {
		'channel_id?': nonEmptyString,
		'path?': nonEmptyString,
	},
})

export const cosmosChainRegistryAssetWire = arktype({
	base: nonEmptyString,
	name: nonEmptyString,
	symbol: nonEmptyString,
	'display?': nonEmptyString,
	'type_asset?': nonEmptyString,
	'denom_units?': arktype({
		denom: nonEmptyString,
		exponent: unsignedSafe,
	}).array(),
	'traces?': cosmosChainRegistryIbcTraceWire.array(),
})

export const cosmosChainRegistryAssetListWire = arktype({
	chain_name: nonEmptyString,
	assets: cosmosChainRegistryAssetWire.array(),
})

export const assertCosmosChainRegistryEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`CosmosChainRegistry_Github: invalid ${label} envelope`)
	}
}
