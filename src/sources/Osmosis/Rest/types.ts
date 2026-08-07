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
		data: {
			txs?: string[]
		}
	}
}

export type OsmosisSyncingResponse = {
	syncing: boolean
}

export type OsmosisStakingPoolResponse = {
	pool: {
		bonded_tokens: string
		not_bonded_tokens: string
	}
}

export type OsmosisValidatorsResponse = {
	validators: {
		operator_address: string
		jailed: boolean
		status: string
		tokens: string
		delegator_shares?: string
		description?: {
			moniker?: string
			identity?: string
			website?: string
			security_contact?: string
			details?: string
		}
		commission?: {
			commission_rates?: {
				rate?: string
				max_rate?: string
				max_change_rate?: string
			}
			update_time?: string
		}
		min_self_delegation?: string
		/** Transport leftovers — unenrolled on Osmosis LCD tip / bonded-count path. */
		unbonding_height?: string
		unbonding_time?: string
	}[]
	pagination?: OsmosisPagination
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
	last_liquidity_update?: string
	incentives_address?: string
	spread_rewards_address?: string
}

export type OsmosisPoolResponse = {
	pool: OsmosisPoolManagerPool
}

export type OsmosisPoolsResponse = {
	pools: OsmosisPoolManagerPool[]
	pagination?: OsmosisPagination
}

export type OsmosisLiquidityPerTickRange = {
	liquidity_amount: string
	lower_tick: string
	upper_tick: string
}

export type OsmosisLiquidityPerTickRangeResponse = {
	liquidity: OsmosisLiquidityPerTickRange[]
}

export type OsmosisConcentratedPosition = {
	position_id: string
	address: string
	pool_id: string
	lower_tick: string
	upper_tick: string
	join_time?: string
	liquidity: string
}

export type OsmosisFullPositionBreakdown = {
	position: OsmosisConcentratedPosition
	asset0?: OsmosisCoin
	asset1?: OsmosisCoin
	claimable_spread_rewards?: OsmosisCoin[]
	claimable_incentives?: OsmosisCoin[]
	forfeited_incentives?: OsmosisCoin[]
}

export type OsmosisPositionByIdResponse = {
	position: OsmosisFullPositionBreakdown
}

export type OsmosisUserPositionsResponse = {
	positions: OsmosisFullPositionBreakdown[]
	pagination?: OsmosisPagination
}

export type OsmosisNumPoolPositionsResponse = {
	position_count: string
}

export type OsmosisSpotPriceResponse = {
	spot_price: string
}
