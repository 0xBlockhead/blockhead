import { type } from 'arktype'


const outgoingEnvelope = {
	connection_id: 'string',
	message_id: 'number.integer >= 0',
} as const

const channelUpdateEnvelope = {
	...outgoingEnvelope,
	version: 'string',
	'subaccountNumber?': 'number.integer >= 0',
} as const

const naturalNumberString = type(/^\d+$/)

const positionSide = type("'LONG' | 'SHORT'")
const perpetualPositionStatus = type("'OPEN' | 'CLOSED' | 'LIQUIDATED'")
const perpetualMarketStatus = type("'ACTIVE' | 'PAUSED' | 'CANCEL_ONLY' | 'POST_ONLY' | 'INITIALIZING' | 'FINAL_SETTLEMENT'")
const orderSide = type("'BUY' | 'SELL'")
const orderType = type("'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET' | 'TRAILING_STOP' | 'TAKE_PROFIT' | 'TAKE_PROFIT_MARKET' | 'TWAP' | 'TWAP_SUBORDER'")
const orderTimeInForce = type("'GTT' | 'FOK' | 'IOC'")
const orderStatus = type("'OPEN' | 'FILLED' | 'CANCELED' | 'BEST_EFFORT_CANCELED' | 'BEST_EFFORT_OPENED' | 'UNTRIGGERED' | 'ERROR'")
const fillLiquidity = type("'TAKER' | 'MAKER'")
const fillType = type("'LIMIT' | 'LIQUIDATED' | 'LIQUIDATION' | 'DELEVERAGED' | 'OFFSETTING' | 'TWAP_SUBORDER'")
const tradeType = type("'LIMIT' | 'LIQUIDATED' | 'DELEVERAGED' | 'TWAP_SUBORDER'")
const transferType = type("'TRANSFER_IN' | 'TRANSFER_OUT' | 'DEPOSIT' | 'WITHDRAWAL'")

const perpetualMarket = type({
	atomicResolution: 'number.integer',
	baseOpenInterest: 'string',
	clobPairId: 'string',
	'defaultFundingRate1H?': 'string',
	initialMarginFraction: 'string',
	maintenanceMarginFraction: 'string',
	marketType: "'CROSS' | 'ISOLATED'",
	nextFundingRate: 'string',
	openInterest: 'string',
	'openInterestLowerCap?': 'string',
	'openInterestUpperCap?': 'string',
	'oraclePrice?': 'string',
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
}).onUndeclaredKey('reject')

const perpetualMarkets = type({
	'[string]': perpetualMarket,
})

export const DydxMarketsSnapshot = type({
	markets: perpetualMarkets,
}).onUndeclaredKey('reject')

const tradingPerpetualMarketUpdate = type({
	'atomicResolution?': 'number.integer',
	'baseAsset?': 'string',
	'baseOpenInterest?': 'string',
	'basePositionSize?': 'string',
	'clobPairId?': 'string',
	'defaultFundingRate1H?': 'string',
	'id?': 'string',
	'incrementalPositionSize?': 'string',
	'initialMarginFraction?': 'string',
	'maintenanceMarginFraction?': 'string',
	'marketId?': 'number.integer >= 0',
	'marketType?': "'CROSS' | 'ISOLATED'",
	'maxPositionSize?': 'string',
	'nextFundingRate?': 'string',
	'openInterest?': 'string',
	'openInterestLowerCap?': 'string',
	'openInterestUpperCap?': 'string',
	'priceChange24H?': 'string',
	'quantumConversionExponent?': 'number.integer',
	'quoteAsset?': 'string',
	'status?': perpetualMarketStatus,
	'stepBaseQuantums?': 'number.integer',
	'stepSize?': 'string',
	'subticksPerTick?': 'number.integer',
	'ticker?': 'string',
	'tickSize?': 'string',
	'trades24H?': 'number.integer >= 0',
	'volume24H?': 'string',
}).onUndeclaredKey('reject')

const oraclePriceMarketUpdate = type({
	effectiveAt: 'string',
	effectiveAtHeight: naturalNumberString,
	marketId: 'number.integer >= 0',
	oraclePrice: 'string',
}).onUndeclaredKey('reject')

export const DydxMarketsUpdate = type({
	'oraclePrices?': {
		'[string]': oraclePriceMarketUpdate,
	},
	'trading?': {
		'[string]': tradingPerpetualMarketUpdate,
	},
}).onUndeclaredKey('reject')

const orderbookSnapshotLevel = type({
	price: 'string',
	size: 'string',
}).onUndeclaredKey('reject')

// Initial orderbooks come from REST; subsequent updates use compact price-size tuples.
export const DydxOrderbookSnapshot = type({
	asks: orderbookSnapshotLevel.array(),
	bids: orderbookSnapshotLevel.array(),
}).onUndeclaredKey('reject')

const orderbookDeltaLevel = type([
	'string',
	'string',
])

export const DydxOrderbookUpdate = type({
	'asks?': orderbookDeltaLevel.array(),
	'bids?': orderbookDeltaLevel.array(),
}).onUndeclaredKey('reject')

const tradeSnapshot = type({
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	id: 'string',
	price: 'string',
	side: orderSide,
	size: 'string',
	type: tradeType,
}).onUndeclaredKey('reject')

const tradeUpdate = type({
	createdAt: 'string',
	id: 'string',
	price: 'string',
	side: orderSide,
	size: 'string',
	type: tradeType,
}).onUndeclaredKey('reject')

export const DydxTradesSnapshot = type({
	'offset?': 'number.integer >= 0',
	'pageSize?': 'number.integer >= 0',
	'totalResults?': 'number.integer >= 0',
	trades: tradeSnapshot.array(),
}).onUndeclaredKey('reject')

export const DydxTradesUpdate = type({
	trades: tradeUpdate.array(),
}).onUndeclaredKey('reject')

export const DydxBlockHeightSnapshot = type({
	height: naturalNumberString,
	time: 'string',
}).onUndeclaredKey('reject')

export const DydxBlockHeightUpdate = type({
	blockHeight: naturalNumberString,
	time: 'string',
}).onUndeclaredKey('reject')

const candleResolution = type("'1MIN' | '5MINS' | '15MINS' | '30MINS' | '1HOUR' | '4HOURS' | '1DAY'")

const candleSnapshot = type({
	baseTokenVolume: 'string',
	close: 'string',
	high: 'string',
	id: 'string',
	low: 'string',
	'orderbookMidPriceClose?': 'string | null',
	'orderbookMidPriceOpen?': 'string | null',
	open: 'string',
	resolution: candleResolution,
	startedAt: 'string',
	startingOpenInterest: 'string',
	ticker: 'string',
	trades: 'number >= 0',
	usdVolume: 'string',
}).onUndeclaredKey('reject')

export const DydxCandlesSnapshot = type({
	candles: candleSnapshot.array(),
}).onUndeclaredKey('reject')

export const DydxCandleUpdate = type({
	baseTokenVolume: 'string',
	close: 'string',
	high: 'string',
	low: 'string',
	open: 'string',
	resolution: candleResolution,
	startedAt: 'string',
	startingOpenInterest: 'string',
	ticker: 'string',
	trades: 'number >= 0',
	usdVolume: 'string',
}).onUndeclaredKey('reject')

const perpetualPosition = type({
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	'closedAt?': 'string | null',
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
}).onUndeclaredKey('reject')

const assetPosition = type({
	assetId: 'string',
	side: positionSide,
	size: 'string',
	subaccountNumber: 'number.integer >= 0',
	symbol: 'string',
}).onUndeclaredKey('reject')

const subaccountDefinition = {
	address: 'string',
	assetPositions: {
		'[string]': assetPosition,
	},
	equity: 'string',
	freeCollateral: 'string',
	latestProcessedBlockHeight: naturalNumberString,
	marginEnabled: 'boolean',
	openPerpetualPositions: {
		'[string]': perpetualPosition,
	},
	subaccountNumber: 'number.integer >= 0',
	updatedAtHeight: naturalNumberString,
} as const

const subaccount = type(subaccountDefinition).onUndeclaredKey('reject')

const order = type({
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
}).onUndeclaredKey('reject')

export const DydxSubaccountSnapshot = type({
	...subaccountDefinition,
	blockHeight: naturalNumberString,
	orders: order.array(),
}).onUndeclaredKey('reject')

const emptySubaccountSnapshot = type({}).onUndeclaredKey('reject')

// The server keeps a valid subscription open when its initial account lookup returns 404.
export const DydxSubaccountInitialContents = DydxSubaccountSnapshot.or(emptySubaccountSnapshot)

export const DydxParentSubaccountSnapshot = type({
	address: 'string',
	blockHeight: naturalNumberString,
	childSubaccounts: subaccount.array(),
	equity: 'string',
	freeCollateral: 'string',
	orders: order.array(),
	parentSubaccountNumber: 'number.integer >= 0',
}).onUndeclaredKey('reject')

export const DydxParentSubaccountInitialContents = DydxParentSubaccountSnapshot.or(emptySubaccountSnapshot)

const perpetualPositionUpdate = type({
	address: 'string',
	entryPrice: 'string',
	'exitPrice?': 'string',
	market: 'string',
	maxSize: 'string',
	netFunding: 'string',
	positionId: 'string',
	'realizedPnl?': 'string',
	side: positionSide,
	size: 'string',
	status: perpetualPositionStatus,
	subaccountNumber: 'number.integer >= 0',
	sumClose: 'string',
	sumOpen: 'string',
	'unrealizedPnl?': 'string',
}).onUndeclaredKey('reject')

const assetPositionUpdate = type({
	address: 'string',
	assetId: 'string',
	positionId: 'string',
	side: positionSide,
	size: 'string',
	subaccountNumber: 'number.integer >= 0',
	symbol: 'string',
}).onUndeclaredKey('reject')

const orderUpdate = type({
	clientId: 'string',
	'clientMetadata?': 'string',
	'clobPairId?': 'string',
	'createdAtHeight?': naturalNumberString,
	'duration?': 'string',
	'goodTilBlock?': naturalNumberString,
	'goodTilBlockTime?': 'string | null',
	id: 'string',
	'interval?': 'string',
	orderFlags: 'string',
	'postOnly?': 'boolean',
	'price?': 'string',
	'priceTolerance?': 'string',
	'reduceOnly?': 'boolean',
	'removalReason?': 'string',
	'side?': orderSide,
	'size?': 'string',
	status: orderStatus,
	subaccountId: 'string',
	'ticker?': 'string',
	'timeInForce?': orderTimeInForce,
	'totalFilled?': 'string',
	'totalOptimisticFilled?': 'string',
	'triggerPrice?': 'string',
	'type?': orderType,
	'updatedAt?': 'string',
	'updatedAtHeight?': naturalNumberString,
}).onUndeclaredKey('reject')

const fillUpdate = type({
	'clientMetadata?': 'string',
	clobPairId: 'string',
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	eventId: 'string',
	id: 'string',
	liquidity: fillLiquidity,
	'orderId?': 'string',
	price: 'string',
	quoteAmount: 'string',
	side: orderSide,
	size: 'string',
	subaccountId: 'string',
	ticker: 'string',
	transactionHash: 'string',
	type: fillType,
}).onUndeclaredKey('reject')

const transferParty = type({
	address: 'string',
	'subaccountNumber?': 'number.integer >= 0',
}).onUndeclaredKey('reject')

const transferUpdate = type({
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	recipient: transferParty,
	sender: transferParty,
	size: 'string',
	symbol: 'string',
	transactionHash: 'string',
	type: transferType,
}).onUndeclaredKey('reject')

const tradingRewardUpdate = type({
	createdAt: 'string',
	createdAtHeight: naturalNumberString,
	tradingReward: 'string',
}).onUndeclaredKey('reject')

export const DydxSubaccountUpdate = type({
	'assetPositions?': assetPositionUpdate.array(),
	'blockHeight?': naturalNumberString,
	'fills?': fillUpdate.array(),
	'orders?': orderUpdate.array(),
	'perpetualPositions?': perpetualPositionUpdate.array(),
	'tradingReward?': tradingRewardUpdate,
	'transfers?': transferUpdate,
}).onUndeclaredKey('reject')

const connectedMessage = type({
	...outgoingEnvelope,
	type: "'connected'",
}).onUndeclaredKey('reject')

const errorMessage = type({
	...outgoingEnvelope,
	'channel?': 'string',
	'id?': 'string',
	message: 'string',
	type: "'error'",
}).onUndeclaredKey('reject')

const unsubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_markets' | 'v4_orderbook' | 'v4_trades' | 'v4_subaccounts' | 'v4_parent_subaccounts' | 'v4_candles' | 'v4_block_height'",
	'id?': 'string',
	type: "'unsubscribed'",
}).onUndeclaredKey('reject')

const pongMessage = type({
	...outgoingEnvelope,
	'id?': 'number.integer >= 0',
	type: "'pong'",
}).onUndeclaredKey('reject')

const marketsSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_markets'",
	contents: DydxMarketsSnapshot,
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const orderbookSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_orderbook'",
	contents: DydxOrderbookSnapshot,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const tradesSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_trades'",
	contents: DydxTradesSnapshot,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const subaccountSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_subaccounts'",
	contents: DydxSubaccountInitialContents,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const blockHeightSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_block_height'",
	contents: DydxBlockHeightSnapshot,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const candlesSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_candles'",
	contents: DydxCandlesSnapshot,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const parentSubaccountSubscribedMessage = type({
	...outgoingEnvelope,
	channel: "'v4_parent_subaccounts'",
	contents: DydxParentSubaccountInitialContents,
	id: 'string',
	type: "'subscribed'",
}).onUndeclaredKey('reject')

const marketsDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_markets'",
	contents: DydxMarketsUpdate,
	'id?': 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const orderbookDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_orderbook'",
	contents: DydxOrderbookUpdate,
	id: 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const tradesDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_trades'",
	contents: DydxTradesUpdate,
	id: 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const subaccountDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_subaccounts'",
	contents: DydxSubaccountUpdate,
	id: 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const blockHeightDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_block_height'",
	contents: DydxBlockHeightUpdate,
	'id?': 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const candlesDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_candles'",
	contents: DydxCandleUpdate,
	id: 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const parentSubaccountDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_parent_subaccounts'",
	contents: DydxSubaccountUpdate,
	id: 'string',
	type: "'channel_data'",
}).onUndeclaredKey('reject')

const marketsBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_markets'",
	contents: DydxMarketsUpdate.array(),
	'id?': 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const orderbookBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_orderbook'",
	contents: DydxOrderbookUpdate.array(),
	id: 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const tradesBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_trades'",
	contents: DydxTradesUpdate.array(),
	id: 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const subaccountBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_subaccounts'",
	contents: DydxSubaccountUpdate.array(),
	id: 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const blockHeightBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_block_height'",
	contents: DydxBlockHeightUpdate.array(),
	'id?': 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const candlesBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_candles'",
	contents: DydxCandleUpdate.array(),
	id: 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

const parentSubaccountBatchDataMessage = type({
	...channelUpdateEnvelope,
	channel: "'v4_parent_subaccounts'",
	contents: DydxSubaccountUpdate.array(),
	id: 'string',
	type: "'channel_batch_data'",
}).onUndeclaredKey('reject')

export const DydxWebSocketMessage = type.or(
	connectedMessage,
	errorMessage,
	unsubscribedMessage,
	pongMessage,
	marketsSubscribedMessage,
	orderbookSubscribedMessage,
	tradesSubscribedMessage,
	subaccountSubscribedMessage,
	blockHeightSubscribedMessage,
	candlesSubscribedMessage,
	parentSubaccountSubscribedMessage,
	marketsDataMessage,
	orderbookDataMessage,
	tradesDataMessage,
	subaccountDataMessage,
	blockHeightDataMessage,
	candlesDataMessage,
	parentSubaccountDataMessage,
	marketsBatchDataMessage,
	orderbookBatchDataMessage,
	tradesBatchDataMessage,
	subaccountBatchDataMessage,
	blockHeightBatchDataMessage,
	candlesBatchDataMessage,
	parentSubaccountBatchDataMessage
)

export type DydxWebSocketMessage = typeof DydxWebSocketMessage.infer

export const parseDydxWebSocketMessage = (message: unknown) => (
	DydxWebSocketMessage.assert(JSON.parse(type('string').assert(message)))
)

const unkeyedSubscription = type({
	'batched?': 'boolean',
	channel: "'v4_markets' | 'v4_block_height'",
	'timestamp?': 'string',
	type: "'subscribe'",
}).onUndeclaredKey('reject')

const unkeyedUnsubscription = type({
	channel: "'v4_markets' | 'v4_block_height'",
	'timestamp?': 'string',
	type: "'unsubscribe'",
}).onUndeclaredKey('reject')

const keyedSubscription = type({
	'batched?': 'boolean',
	channel: "'v4_orderbook' | 'v4_trades' | 'v4_subaccounts' | 'v4_parent_subaccounts' | 'v4_candles'",
	id: 'string',
	'timestamp?': 'string',
	type: "'subscribe'",
}).onUndeclaredKey('reject')

const keyedUnsubscription = type({
	channel: "'v4_orderbook' | 'v4_trades' | 'v4_subaccounts' | 'v4_parent_subaccounts' | 'v4_candles'",
	id: 'string',
	'timestamp?': 'string',
	type: "'unsubscribe'",
}).onUndeclaredKey('reject')

export const DydxWebSocketSubscription = type.or(
	unkeyedSubscription,
	keyedSubscription
)

export type DydxWebSocketSubscription = typeof DydxWebSocketSubscription.infer

export const DydxIndexerLiveRequest = type({
	targetKey: "'cosmos:dydx-mainnet-1'",
	subscription: DydxWebSocketSubscription,
}).onUndeclaredKey('reject')

export type DydxIndexerLiveRequest = typeof DydxIndexerLiveRequest.infer

const ping = type({
	'id?': 'number.integer >= 0',
	type: "'ping'",
}).onUndeclaredKey('reject')

export const DydxWebSocketRequest = type.or(
	DydxWebSocketSubscription,
	unkeyedUnsubscription,
	keyedUnsubscription,
	ping
)

export type DydxWebSocketRequest = typeof DydxWebSocketRequest.infer
