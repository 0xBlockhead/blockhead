/**
 * Osmosis LCD (REST) named operations for osmosis-1.
 * @see https://lcd.osmosis.zone/swagger/
 */
import { TransportType } from '$/constants/TransportType.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Osmosis/bindings.ts'
import { osmosisPoolPaths } from '$/sources/Osmosis/Rest/constants.ts'
import type {
	OsmosisBlockResponse,
	OsmosisDenomTraceResponse,
	OsmosisLiquidityPerTickRangeResponse,
	OsmosisNodeInfoResponse,
	OsmosisNumPoolPositionsResponse,
	OsmosisPositionByIdResponse,
	OsmosisSpotPriceResponse,
	OsmosisStakingPoolResponse,
	OsmosisSyncingResponse,
	OsmosisUserPositionsResponse,
	OsmosisValidatorsResponse,
} from '$/sources/Osmosis/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Osmosis_LCD_Rest][0]

const osmosisPoolWire = arktype({
	'@type?': 'string',
	'address?': 'string',
	id: '/^(0|[1-9][0-9]*)$/',
	'pool_params?': {
		'swap_fee?': 'string',
		'exit_fee?': 'string',
	},
	'total_weight?': 'string',
	'total_shares?': {
		denom: 'string',
		amount: 'string',
	},
	'pool_assets?': arktype({
		token: {
			denom: 'string',
			amount: 'string',
		},
		'weight?': 'string',
	}).array(),
	'pool_liquidity?': arktype({
		denom: 'string',
		amount: 'string',
	}).array(),
	'current_tick_liquidity?': 'string',
	'token0?': 'string',
	'token1?': 'string',
	'current_sqrt_price?': 'string',
	'current_tick?': 'string',
	'tick_spacing?': 'string',
	'exponent_at_price_one?': 'string',
	'spread_factor?': 'string',
	'last_liquidity_update?': 'string',
	'incentives_address?': 'string',
	'spread_rewards_address?': 'string',
})
const osmosisPoolResponseWire = arktype({
	pool: osmosisPoolWire,
})
const osmosisPoolsResponseWire = arktype({
	pools: osmosisPoolWire.array(),
	'pagination?': {
		'next_key?': 'string | null',
		'total?': 'string',
	},
})
const osmosisLiquidityPerTickRangeResponseWire = arktype({
	liquidity: arktype({
		liquidity_amount: 'string',
		lower_tick: 'string',
		upper_tick: 'string',
	}).array(),
})
const osmosisCoinWire = arktype({
	denom: 'string',
	amount: 'string',
})
const osmosisFullPositionBreakdownWire = arktype({
	position: {
		position_id: '/^(0|[1-9][0-9]*)$/',
		address: 'string',
		pool_id: '/^(0|[1-9][0-9]*)$/',
		lower_tick: 'string',
		upper_tick: 'string',
		'join_time?': 'string',
		liquidity: 'string',
	},
	'asset0?': osmosisCoinWire,
	'asset1?': osmosisCoinWire,
	'claimable_spread_rewards?': osmosisCoinWire.array(),
	'claimable_incentives?': osmosisCoinWire.array(),
	'forfeited_incentives?': osmosisCoinWire.array(),
})
const osmosisPositionByIdResponseWire = arktype({
	position: osmosisFullPositionBreakdownWire,
})
const osmosisUserPositionsResponseWire = arktype({
	positions: osmosisFullPositionBreakdownWire.array(),
	'pagination?': {
		'next_key?': 'string | null',
		'total?': 'string',
	},
})
const osmosisNumPoolPositionsResponseWire = arktype({
	position_count: '/^(0|[1-9][0-9]*)$/',
})
const assertPoolEnvelope = (response: unknown) => {
	try {
		return osmosisPoolResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid pool response envelope`)
	}
}
const assertPoolsEnvelope = (response: unknown) => {
	try {
		return osmosisPoolsResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid pools response envelope`)
	}
}
const assertLiquidityPerTickRangeEnvelope = (response: unknown) => {
	try {
		return osmosisLiquidityPerTickRangeResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid liquidity-per-tick-range response envelope`)
	}
}
const assertPositionByIdEnvelope = (response: unknown) => {
	try {
		return osmosisPositionByIdResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid position-by-id response envelope`)
	}
}
const assertUserPositionsEnvelope = (response: unknown) => {
	try {
		return osmosisUserPositionsResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid user-positions response envelope`)
	}
}
const assertNumPoolPositionsEnvelope = (response: unknown) => {
	try {
		return osmosisNumPoolPositionsResponseWire.assert(response)
	} catch {
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid num-pool-positions response envelope`)
	}
}

const lcdGetJson = <_Json>(path: string) => (
	sourceGetJson<_Json>(
		binding,
		httpUrl(binding, path)
	)
)

export const osmosisLcdRestEndpoints = binding.endpoints.map(({ locator: url }) => ({
	url,
	transportType: TransportType.Http,
	providerName: 'Osmosis LCD',
}))

const assertPoolId = (poolId: string) => {
	if (!/^(0|[1-9]\d*)$/.test(poolId))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid pool id ${poolId}`)
}

const assertPositionId = (positionId: string) => {
	if (!/^(0|[1-9]\d*)$/.test(positionId))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid position id ${positionId}`)
}

const assertOwnerAddress = (address: string) => {
	if (!/^osmo1[0-9a-z]{38,58}$/.test(address))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid owner address ${address}`)
}

const assertDenom = (denom: string, label: string) => {
	if (denom.length === 0)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid ${label}`)
}

const assertTraceKey = (traceKey: string) => {
	if (traceKey.length === 0)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid denom trace key`)
}

const assertBlockHeight = (height: bigint) => {
	if (height < 0n)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid block height ${height}`)
}

/** ICS-20 denom hash (with or without `ibc/` prefix) or `trace:<path>/<baseDenom>`. */
export const getDenomTrace = (traceKey: string) => {
	assertTraceKey(traceKey)
	if (traceKey.startsWith('trace:')) {
		const body = traceKey.slice('trace:'.length)
		const separator = body.lastIndexOf('/')
		if (separator <= 0 || separator === body.length - 1)
			throw new Error(`${Source.Osmosis_LCD_Rest}: invalid denom trace path key`)

		return Promise.resolve({
			denom_trace: {
				path: body.slice(0, separator),
				base_denom: body.slice(separator + 1),
			},
		} satisfies OsmosisDenomTraceResponse)
	}

	const hash = (
		traceKey.startsWith('hash:') ?
			traceKey.slice('hash:'.length)
		: traceKey.startsWith('ibc/') ?
			traceKey.slice('ibc/'.length)
		:
			traceKey
	)
	if (!/^[0-9A-Fa-f]{64}$/.test(hash))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid denom hash ${traceKey}`)

	return lcdGetJson<OsmosisDenomTraceResponse>(
		`/ibc/apps/transfer/v1/denom_traces/${hash}`
	)
}

export const getNodeInfo = () => (
	lcdGetJson<OsmosisNodeInfoResponse>('/cosmos/base/tendermint/v1beta1/node_info')
)

export const getLatestBlock = () => (
	lcdGetJson<OsmosisBlockResponse>('/cosmos/base/tendermint/v1beta1/blocks/latest')
)

export const getBlock = ({
	height,
}: {
	height: bigint
}) => {
	assertBlockHeight(height)
	return lcdGetJson<OsmosisBlockResponse>(
		`/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`
	)
}

export const getSyncing = () => (
	lcdGetJson<OsmosisSyncingResponse>('/cosmos/base/tendermint/v1beta1/syncing')
)

export const getStakingPool = () => (
	lcdGetJson<OsmosisStakingPoolResponse>('/cosmos/staking/v1beta1/pool')
)

export const getValidators = ({
	limit = 24,
	status,
}: {
	limit?: number
	status?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid validators limit ${String(limit)}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(status != null && { status }),
	})
	return lcdGetJson<OsmosisValidatorsResponse>(
		`/cosmos/staking/v1beta1/validators?${parameters}`
	)
}

export const getPool = (poolId: string) => {
	assertPoolId(poolId)
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.byId}/${poolId}`
	)
		.then((response) => {
			const envelope = assertPoolEnvelope(response)
			if (envelope.pool.id !== poolId)
				throw new Error(`${Source.Osmosis_LCD_Rest}: pool id mismatch ${envelope.pool.id} !== ${poolId}`)

			return envelope
		})
}

export const getPools = () => (
	lcdGetJson<unknown>(
		osmosisPoolPaths.all
	)
		.then((response) => {
			const envelope = assertPoolsEnvelope(response)
			if (new Set(envelope.pools.map((pool) => pool.id)).size !== envelope.pools.length)
				throw new Error(`${Source.Osmosis_LCD_Rest}: all-pools response contains duplicate pool ids`)

			return envelope
		})
)

export const getConcentratedLiquidityPools = ({
	limit = 24,
	offset = 0,
}: {
	limit?: number
	offset?: number
} = {}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid concentrated liquidity pools limit ${String(limit)}`)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid concentrated liquidity pools offset ${String(offset)}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.offset': String(offset),
		'pagination.count_total': 'true',
	})
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.concentratedLiquidityPools}?${parameters}`
	)
		.then((response) => {
			const envelope = assertPoolsEnvelope(response)
			if (new Set(envelope.pools.map((pool) => pool.id)).size !== envelope.pools.length)
				throw new Error(`${Source.Osmosis_LCD_Rest}: concentrated liquidity pools response contains duplicate pool ids`)
			for (const pool of envelope.pools) {
				if (pool['@type'] != null && !pool['@type'].includes('concentratedliquidity'))
					throw new Error(`${Source.Osmosis_LCD_Rest}: non-CL pool in concentrated liquidity list ${pool.id}`)
			}

			return envelope
		})
}

export const getLiquidityPerTickRange = ({
	poolId,
}: {
	poolId: string
}) => {
	assertPoolId(poolId)
	const parameters = new URLSearchParams({
		pool_id: poolId,
	})
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.liquidityPerTickRange}?${parameters}`
	)
		.then((response) => (
			assertLiquidityPerTickRangeEnvelope(response) as OsmosisLiquidityPerTickRangeResponse
		))
}

/**
 * Full CL position breakdown by position id.
 * @see https://github.com/osmosis-labs/osmosis/blob/main/proto/osmosis/concentratedliquidity/v1beta1/query.proto PositionById
 */
export const getPositionById = ({
	positionId,
}: {
	positionId: string
}) => {
	assertPositionId(positionId)
	const parameters = new URLSearchParams({
		position_id: positionId,
	})
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.positionById}?${parameters}`
	)
		.then((response) => (
			assertPositionByIdEnvelope(response) as OsmosisPositionByIdResponse
		))
}

/**
 * All CL positions for an Osmosis bech32 owner (paginated).
 * Optional `poolId` filters to one concentrated pool (`pool_id` query param).
 * @see https://github.com/osmosis-labs/osmosis/blob/main/proto/osmosis/concentratedliquidity/v1beta1/query.proto UserPositions
 */
export const getPositionsByOwner = ({
	address,
	poolId,
	limit = 24,
	offset = 0,
}: {
	address: string
	poolId?: string
	limit?: number
	offset?: number
}) => {
	assertOwnerAddress(address)
	if (poolId != null)
		assertPoolId(poolId)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid user positions limit ${String(limit)}`)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid user positions offset ${String(offset)}`)

	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.offset': String(offset),
		'pagination.count_total': 'true',
		...(poolId != null && {
			pool_id: poolId,
		}),
	})
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.userPositions}/${address}?${parameters}`
	)
		.then((response) => {
			const envelope = assertUserPositionsEnvelope(response) as OsmosisUserPositionsResponse
			if (new Set(envelope.positions.map((row) => row.position.position_id)).size !== envelope.positions.length)
				throw new Error(`${Source.Osmosis_LCD_Rest}: user positions response contains duplicate position ids`)
			if (poolId != null) {
				for (const row of envelope.positions) {
					if (row.position.pool_id !== poolId)
						throw new Error(`${Source.Osmosis_LCD_Rest}: user positions pool id mismatch ${row.position.pool_id} !== ${poolId}`)
				}
			}

			return envelope
		})
}

/**
 * Count of CL positions in a concentrated liquidity pool.
 * LCD path exists in proto; some public LCD nodes currently return gRPC Unimplemented.
 * There is no honest pool-wide position *list* endpoint — only this count.
 * @see https://github.com/osmosis-labs/osmosis/blob/main/proto/osmosis/concentratedliquidity/v1beta1/query.proto NumPoolPositions
 */
export const getNumPoolPositions = ({
	poolId,
}: {
	poolId: string
}) => {
	assertPoolId(poolId)
	return lcdGetJson<unknown>(
		`${osmosisPoolPaths.numPoolPositions}/${poolId}`
	)
		.then((response) => (
			assertNumPoolPositionsEnvelope(response) as OsmosisNumPoolPositionsResponse
		))
}

export const getSpotPrice = ({
	poolId,
	baseAssetDenom,
	quoteAssetDenom,
}: {
	poolId: string
	baseAssetDenom: string
	quoteAssetDenom: string
}) => {
	assertPoolId(poolId)
	assertDenom(baseAssetDenom, 'base asset denom')
	assertDenom(quoteAssetDenom, 'quote asset denom')
	const search = new URLSearchParams({
		base_asset_denom: baseAssetDenom,
		quote_asset_denom: quoteAssetDenom,
	})
	return lcdGetJson<OsmosisSpotPriceResponse>(
		`/osmosis/poolmanager/v1beta1/pools/${poolId}/prices?${search.toString()}`
	)
}
