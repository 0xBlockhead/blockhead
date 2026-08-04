export type OsmosisCoin = {
	denom: string
	amount: string
}

export type OsmosisPagination = {
	next_key?: string | null
	total?: string
}

export type OsmosisNodeInfoResponse = {
	default_node_info: {
		network: string
		version?: string
		moniker?: string
	}
	application_version?: {
		name?: string
		app_name?: string
		version?: string
		cosmos_sdk_version?: string
	}
}

export type OsmosisBlockResponse = {
	block_id: {
		hash: string
	}
	block: {
		header: {
			height: string
			time: string
			proposer_address: string
			chain_id: string
		}
	}
}

export type OsmosisDenomTrace = {
	path: string
	base_denom: string
}

export type OsmosisDenomTraceResponse = {
	denom_trace: OsmosisDenomTrace
}

export type OsmosisPoolAsset = {
	token: OsmosisCoin
	weight?: string
}

export type OsmosisPoolManagerPool = {
	'@type'?: string
	address?: string
	id: string
	pool_params?: {
		swap_fee?: string
		exit_fee?: string
	}
	total_weight?: string
	total_shares?: OsmosisCoin
	pool_assets?: OsmosisPoolAsset[]
	pool_liquidity?: OsmosisCoin[]
	current_tick_liquidity?: string
	token0?: string
	token1?: string
	current_sqrt_price?: string
	current_tick?: string
	tick_spacing?: string
	exponent_at_price_one?: string
	spread_factor?: string
}

export type OsmosisPoolResponse = {
	pool: OsmosisPoolManagerPool
}

export type OsmosisPoolsResponse = {
	pools: OsmosisPoolManagerPool[]
	pagination?: OsmosisPagination
}

export type OsmosisSpotPriceResponse = {
	spot_price: string
}
