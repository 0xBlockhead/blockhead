/**
 * dYdX Indexer Comlink REST wire shapes (fail-closed arktype envelopes).
 *
 * @see https://docs.dydx.exchange/api_integration-indexer/indexer_api
 * @see https://raw.githubusercontent.com/dydxprotocol/v4-chain/main/indexer/services/comlink/public/swagger.json
 */

import { type as arktype } from 'arktype'


const naturalNumberString = arktype(/^(?:0|[1-9]\d*)$/)
const nonEmptyString = arktype('string > 0')

const perpetualMarketStatus = arktype("'ACTIVE' | 'PAUSED' | 'CANCEL_ONLY' | 'POST_ONLY' | 'INITIALIZING' | 'FINAL_SETTLEMENT'")
const perpetualMarketType = arktype("'CROSS' | 'ISOLATED'")
const positionSide = arktype("'LONG' | 'SHORT'")
const perpetualPositionStatus = arktype("'OPEN' | 'CLOSED' | 'LIQUIDATED'")
const orderSide = arktype("'BUY' | 'SELL'")
const orderType = arktype("'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET' | 'TRAILING_STOP' | 'TAKE_PROFIT' | 'TAKE_PROFIT_MARKET' | 'TWAP' | 'TWAP_SUBORDER'")
const orderTimeInForce = arktype("'GTT' | 'FOK' | 'IOC'")
const orderStatus = arktype("'OPEN' | 'FILLED' | 'CANCELED' | 'BEST_EFFORT_CANCELED' | 'BEST_EFFORT_OPENED' | 'UNTRIGGERED' | 'ERROR'")
const fillLiquidity = arktype("'TAKER' | 'MAKER'")
const fillType = arktype("'LIMIT' | 'LIQUIDATED' | 'LIQUIDATION' | 'DELEVERAGED' | 'OFFSETTING' | 'TWAP_SUBORDER'")
const marketType = arktype("'PERPETUAL' | 'SPOT'")

export const dydxHeightResponseWire = arktype({
	height: naturalNumberString,
	time: nonEmptyString,
})

export type DydxHeightResponse = typeof dydxHeightResponseWire.infer

export const dydxPerpetualMarketWire = arktype({
	atomicResolution: 'number.integer',
	baseOpenInterest: 'string',
	clobPairId: 'string',
	'defaultFundingRate1H?': 'string',
	initialMarginFraction: 'string',
	maintenanceMarginFraction: 'string',
	marketType: perpetualMarketType,
	nextFundingRate: 'string',
	openInterest: 'string',
	'openInterestLowerCap?': 'string',
	'openInterestUpperCap?': 'string',
	oraclePrice: 'string',
	priceChange24H: 'string',
	quantumConversionExponent: 'number.integer',
	status: perpetualMarketStatus,
	stepBaseQuantums: 'number.integer',
	stepSize: 'string',
	subticksPerTick: 'number.integer',
	ticker: 'string',
	tickSize: 'string',
	trades24H: 'number.integer >= 0',
	volume24H: 'string',
})

export type DydxPerpetualMarket = typeof dydxPerpetualMarketWire.infer

export const dydxPerpetualMarketsResponseWire = arktype({
	markets: {
		'[string]': dydxPerpetualMarketWire,
	},
})

export type DydxPerpetualMarketsResponse = typeof dydxPerpetualMarketsResponseWire.infer

export const dydxPerpetualPositionWire = arktype({
	'closedAt?': 'string | null',
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	entryPrice: 'string',
	'exitPrice?': 'string | null',
	market: 'string',
	maxSize: 'string',
	netFunding: 'string',
	realizedPnl: 'string',
	side: positionSide,
	size: 'string',
	status: perpetualPositionStatus,
	subaccountNumber: 'number.integer >= 0',
	sumClose: 'string',
	sumOpen: 'string',
	unrealizedPnl: 'string',
})

export type DydxPerpetualPosition = typeof dydxPerpetualPositionWire.infer

const dydxAssetPositionWire = arktype({
	assetId: 'string',
	side: positionSide,
	size: 'string',
	subaccountNumber: 'number.integer >= 0',
	symbol: 'string',
})

export const dydxSubaccountResponseWire = arktype({
	address: 'string',
	assetPositions: {
		'[string]': dydxAssetPositionWire,
	},
	equity: 'string',
	freeCollateral: 'string',
	latestProcessedBlockHeight: naturalNumberString,
	marginEnabled: 'boolean',
	openPerpetualPositions: {
		'[string]': dydxPerpetualPositionWire,
	},
	subaccountNumber: 'number.integer >= 0',
	updatedAtHeight: naturalNumberString,
})

export type DydxSubaccountResponse = typeof dydxSubaccountResponseWire.infer

export const dydxOrderResponseWire = arktype({
	'builderAddress?': 'string',
	clientId: 'string',
	clientMetadata: 'string',
	clobPairId: 'string',
	'createdAt?': 'string',
	'createdAtHeight?': naturalNumberString,
	'duration?': 'string',
	'feePpm?': 'string',
	'goodTilBlock?': naturalNumberString,
	'goodTilBlockTime?': 'string',
	id: 'string',
	'interval?': 'string',
	orderFlags: 'string',
	'orderRouterAddress?': 'string',
	postOnly: 'boolean',
	price: 'string',
	'priceTolerance?': 'string',
	reduceOnly: 'boolean',
	side: orderSide,
	size: 'string',
	status: orderStatus,
	subaccountId: 'string',
	subaccountNumber: 'number.integer >= 0',
	ticker: 'string',
	timeInForce: orderTimeInForce,
	totalFilled: 'string',
	'triggerPrice?': 'string',
	type: orderType,
	'updatedAt?': 'string',
	'updatedAtHeight?': naturalNumberString,
})

export type DydxOrderResponse = typeof dydxOrderResponseWire.infer

export const dydxOrdersResponseWire = dydxOrderResponseWire.array()

export type DydxOrdersResponse = typeof dydxOrdersResponseWire.infer

export const dydxFillResponseWire = arktype({
	'affiliateRevShare': 'string',
	'builderAddress?': 'string',
	'builderFee?': 'string',
	'clientMetadata?': 'string',
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	'entryPriceBefore?': 'string',
	fee: 'string',
	id: 'string',
	liquidity: fillLiquidity,
	market: 'string',
	marketType: marketType,
	'orderId?': 'string',
	'orderRouterAddress?': 'string',
	'orderRouterFee?': 'string',
	'positionSideBefore?': 'string',
	'positionSizeBefore?': 'string',
	price: 'string',
	side: orderSide,
	size: 'string',
	subaccountNumber: 'number.integer >= 0',
	type: fillType,
})

export type DydxFillResponse = typeof dydxFillResponseWire.infer

export const dydxFillsResponseWire = arktype({
	fills: dydxFillResponseWire.array(),
	'offset?': 'number.integer >= 0',
	'pageSize?': 'number.integer >= 0',
	'totalResults?': 'number.integer >= 0',
})

export type DydxFillsResponse = typeof dydxFillsResponseWire.infer

export const dydxPerpetualPositionsResponseWire = arktype({
	positions: dydxPerpetualPositionWire.array(),
})

export type DydxPerpetualPositionsResponse = typeof dydxPerpetualPositionsResponseWire.infer

export const dydxHistoricalFundingWire = arktype({
	effectiveAt: 'string',
	effectiveAtHeight: naturalNumberString,
	price: 'string',
	rate: 'string',
	ticker: 'string',
})

export type DydxHistoricalFunding = typeof dydxHistoricalFundingWire.infer

export const dydxHistoricalFundingResponseWire = arktype({
	historicalFunding: dydxHistoricalFundingWire.array(),
})

export type DydxHistoricalFundingResponse = typeof dydxHistoricalFundingResponseWire.infer

/** Protocol funding settles on UTC hour boundaries; indexer REST omits `nextFundingAt`. */
export const dydxFundingIntervalMs = 3_600_000

export const dydxNextFundingAtMs = (
	observedAtMs: number
) => (
	observedAtMs % dydxFundingIntervalMs === 0 ?
		observedAtMs + dydxFundingIntervalMs
	:
		Math.ceil(observedAtMs / dydxFundingIntervalMs) * dydxFundingIntervalMs
)
