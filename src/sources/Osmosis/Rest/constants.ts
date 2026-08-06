export const osmosisPoolPaths = {
	all: '/osmosis/poolmanager/v1beta1/all-pools',
	byId: '/osmosis/poolmanager/v1beta1/pools',
	concentratedLiquidityPools: '/osmosis/concentratedliquidity/v1beta1/pools',
	liquidityPerTickRange: '/osmosis/concentratedliquidity/v1beta1/liquidity_per_tick_range',
	positionById: '/osmosis/concentratedliquidity/v1beta1/position_by_id',
	userPositions: '/osmosis/concentratedliquidity/v1beta1/positions',
	numPoolPositions: '/osmosis/concentratedliquidity/v1beta1/num_pool_positions',
} as const
