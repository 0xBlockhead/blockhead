import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	DydxWebSocketRequest,
	parseDydxWebSocketMessage,
} from '$/sources/Dydx/WebSocket/types.ts'


const envelope = {
	connection_id: 'connection-1',
	message_id: 1,
}

const market = {
	atomicResolution: -10,
	baseOpenInterest: '782.0931',
	clobPairId: '0',
	defaultFundingRate1H: '0',
	initialMarginFraction: '0.02',
	maintenanceMarginFraction: '0.012',
	marketType: 'CROSS',
	nextFundingRate: '-0.0000000000001',
	openInterest: '308.7674',
	openInterestLowerCap: '0',
	openInterestUpperCap: '0',
	priceChange24H: '-746.07211',
	quantumConversionExponent: -9,
	status: 'ACTIVE',
	stepBaseQuantums: 1_000_000,
	stepSize: '0.0001',
	subticksPerTick: 100_000,
	ticker: 'BTC-USD',
	tickSize: '1',
	trades24H: 6_131,
	volume24H: '42428295.3917',
}

const parse = (message: object) => parseDydxWebSocketMessage(JSON.stringify(message))

describe('dYdX Indexer WebSocket wire contract', () => {
	it('parses exact control messages', () => {
		expect(parse({
			...envelope,
			type: 'connected',
		})).toMatchObject({
			type: 'connected',
		})
		expect(parse({
			...envelope,
			channel: 'v4_markets',
			message: 'subscription rejected',
			type: 'error',
		})).toMatchObject({
			type: 'error',
		})
		expect(parse({
			...envelope,
			id: 7,
			type: 'pong',
		})).toMatchObject({
			type: 'pong',
		})
	})

	it('keeps market snapshots separate from sparse trading and oracle updates', () => {
		expect(parse({
			...envelope,
			channel: 'v4_markets',
			contents: {
				markets: {
					'BTC-USD': market,
				},
			},
			type: 'subscribed',
		})).toMatchObject({
			contents: {
				markets: {
					'BTC-USD': {
						ticker: 'BTC-USD',
					},
				},
			},
		})

		expect(parse({
			...envelope,
			channel: 'v4_markets',
			contents: {
				oraclePrices: {
					'BTC-USD': {
						effectiveAt: '2026-08-03T00:00:00.000Z',
						effectiveAtHeight: '9007199254740993',
						marketId: 0,
						oraclePrice: '65555.000000000000000001',
					},
				},
				trading: {
					'BTC-USD': {
						baseAsset: 'BTC',
						basePositionSize: '0.01',
						incrementalPositionSize: '0.001',
						marketType: 'CROSS',
						maxPositionSize: '100',
						nextFundingRate: '-0.0000000000002',
						quoteAsset: 'USD',
						tickSize: '1',
						volume24H: '42428296.0',
					},
				},
			},
			type: 'channel_data',
			version: '2.0.0',
		})).toMatchObject({
			contents: {
				oraclePrices: {
					'BTC-USD': {
						effectiveAtHeight: '9007199254740993',
					},
				},
			},
		})
	})

	it('models orderbook snapshots as objects and deltas as exact price-size tuples', () => {
		expect(parse({
			...envelope,
			channel: 'v4_orderbook',
			contents: {
				asks: [{
					price: '65555',
					size: '0.2',
				}],
				bids: [{
					price: '65554',
					size: '0.1',
				}],
			},
			id: 'BTC-USD',
			type: 'subscribed',
		})).toMatchObject({
			type: 'subscribed',
		})

		expect(parse({
			...envelope,
			channel: 'v4_orderbook',
			contents: {
				bids: [[
					'65554',
					'0',
				]],
			},
			id: 'BTC-USD',
			type: 'channel_data',
			version: '1.0.0',
		})).toMatchObject({
			type: 'channel_data',
		})

		expect(() => parse({
			...envelope,
			channel: 'v4_orderbook',
			contents: {
				bids: [{
					price: '65554',
					size: '0',
				}],
			},
			id: 'BTC-USD',
			type: 'channel_data',
			version: '1.0.0',
		})).toThrow()
		expect(() => parse({
			...envelope,
			channel: 'v4_orderbook',
			contents: {
				asks: [[
					'65555',
					'0.2',
					'offset-not-requested',
				]],
			},
			id: 'BTC-USD',
			type: 'channel_data',
			version: '1.0.0',
		})).toThrow()
	})

	it('keeps trade snapshot heights out of incremental updates', () => {
		expect(parse({
			...envelope,
			channel: 'v4_trades',
			contents: {
				offset: 0,
				pageSize: 1,
				totalResults: 1,
				trades: [{
					createdAt: '2026-08-03T00:00:00.000Z',
					createdAtHeight: '9007199254740993',
					id: 'trade-1',
					price: '65554.25',
					side: 'BUY',
					size: '0.0001',
					type: 'LIMIT',
				}],
			},
			id: 'BTC-USD',
			type: 'subscribed',
		})).toMatchObject({
			type: 'subscribed',
		})

		expect(parse({
			...envelope,
			channel: 'v4_trades',
			contents: [{
				trades: [{
					createdAt: '2026-08-03T00:00:01.000Z',
					id: 'trade-2',
					price: '65555.25',
					side: 'SELL',
					size: '0.0002',
					type: 'TWAP_SUBORDER',
				}],
			}],
			id: 'BTC-USD',
			type: 'channel_batch_data',
			version: '1.0.0',
		})).toMatchObject({
			type: 'channel_batch_data',
		})

		expect(() => parse({
			...envelope,
			channel: 'v4_trades',
			contents: {
				trades: [{
					createdAt: '2026-08-03T00:00:01.000Z',
					createdAtHeight: '1',
					id: 'trade-2',
					price: '65555.25',
					side: 'SELL',
					size: '0.0002',
					type: 'LIMIT',
				}],
			},
			id: 'BTC-USD',
			type: 'channel_data',
			version: '1.0.0',
		})).toThrow()
	})

	it('distinguishes the block-height snapshot and update keys', () => {
		expect(parse({
			...envelope,
			channel: 'v4_block_height',
			contents: {
				height: '9007199254740993',
				time: '2026-08-03T00:00:00.000Z',
			},
			id: 'v4_block_height',
			type: 'subscribed',
		})).toMatchObject({
			contents: {
				height: '9007199254740993',
			},
		})
		expect(parse({
			...envelope,
			channel: 'v4_block_height',
			contents: {
				blockHeight: '9007199254740994',
				time: '2026-08-03T00:00:01.000Z',
			},
			type: 'channel_data',
			version: '1.0.0',
		})).toMatchObject({
			contents: {
				blockHeight: '9007199254740994',
			},
		})
	})

	it('covers candle and parent-subaccount channels without a catch-all payload', () => {
		expect(parse({
			...envelope,
			channel: 'v4_candles',
			contents: {
				candles: [{
					baseTokenVolume: '10',
					close: '65555',
					high: '65560',
					id: 'candle-1',
					low: '65550',
					open: '65552',
					orderbookMidPriceClose: '65555.5',
					orderbookMidPriceOpen: '65552.5',
					resolution: '1MIN',
					startedAt: '2026-08-03T00:00:00.000Z',
					startingOpenInterest: '308.7674',
					ticker: 'BTC-USD',
					trades: 10,
					usdVolume: '655550',
				}],
			},
			id: 'BTC-USD/1MIN',
			type: 'subscribed',
		})).toMatchObject({
			channel: 'v4_candles',
		})
		expect(parse({
			...envelope,
			channel: 'v4_candles',
			contents: {
				baseTokenVolume: '11',
				close: '65556',
				high: '65560',
				low: '65550',
				open: '65552',
				resolution: '1MIN',
				startedAt: '2026-08-03T00:00:00.000Z',
				startingOpenInterest: '308.7674',
				ticker: 'BTC-USD',
				trades: 11,
				usdVolume: '720000',
			},
			id: 'BTC-USD/1MIN',
			type: 'channel_data',
			version: '1.0.0',
		})).toMatchObject({
			type: 'channel_data',
		})
		expect(parse({
			...envelope,
			channel: 'v4_parent_subaccounts',
			contents: {},
			id: 'dydx1futureaccount/0',
			type: 'subscribed',
		})).toMatchObject({
			channel: 'v4_parent_subaccounts',
		})
	})

	it('parses public subaccount snapshots and every incremental field family', () => {
		expect(parse({
			...envelope,
			channel: 'v4_subaccounts',
			contents: {
				address: 'dydx1account',
				assetPositions: {},
				blockHeight: '100',
				equity: '100.25',
				freeCollateral: '90.25',
				latestProcessedBlockHeight: '100',
				marginEnabled: true,
				openPerpetualPositions: {},
				orders: [],
				subaccountNumber: 0,
				updatedAtHeight: '100',
			},
			id: 'dydx1account/0',
			type: 'subscribed',
		})).toMatchObject({
			contents: {
				address: 'dydx1account',
			},
		})
		expect(parse({
			...envelope,
			channel: 'v4_subaccounts',
			contents: {},
			id: 'dydx1futureaccount/0',
			type: 'subscribed',
		})).toMatchObject({
			contents: {},
		})

		expect(parse({
			...envelope,
			channel: 'v4_subaccounts',
			contents: {
				assetPositions: [{
					address: 'dydx1account',
					assetId: '0',
					positionId: 'asset-position-1',
					side: 'LONG',
					size: '100',
					subaccountNumber: 0,
					symbol: 'USDC',
				}],
				blockHeight: '101',
				fills: [{
					clientMetadata: '0',
					clobPairId: '0',
					createdAt: '2026-08-03T00:00:01.000Z',
					createdAtHeight: '101',
					eventId: 'event-1',
					id: 'fill-1',
					liquidity: 'TAKER',
					orderId: 'order-1',
					price: '65555',
					quoteAmount: '6.5555',
					side: 'BUY',
					size: '0.0001',
					subaccountId: 'subaccount-1',
					ticker: 'BTC-USD',
					transactionHash: 'transaction-1',
					type: 'LIMIT',
				}],
				orders: [{
					clientId: '1',
					duration: '3600',
					id: 'order-1',
					interval: '60',
					orderFlags: '0',
					priceTolerance: '0.01',
					status: 'OPEN',
					subaccountId: 'subaccount-1',
				}],
				perpetualPositions: [{
					address: 'dydx1account',
					entryPrice: '65555',
					market: 'BTC-USD',
					maxSize: '0.0001',
					netFunding: '0',
					positionId: 'position-1',
					side: 'LONG',
					size: '0.0001',
					status: 'OPEN',
					subaccountNumber: 0,
					sumClose: '0',
					sumOpen: '0.0001',
				}],
				tradingReward: {
					createdAt: '2026-08-03T00:00:01.000Z',
					createdAtHeight: '101',
					tradingReward: '0.001',
				},
				transfers: {
					createdAt: '2026-08-03T00:00:01.000Z',
					createdAtHeight: '101',
					recipient: {
						address: 'dydx1account',
						subaccountNumber: 0,
					},
					sender: {
						address: 'dydx1sender',
					},
					size: '1',
					symbol: 'USDC',
					transactionHash: 'transaction-2',
					type: 'DEPOSIT',
				},
			},
			id: 'dydx1account/0',
			type: 'channel_data',
			version: '2.1.0',
		})).toMatchObject({
			contents: {
				blockHeight: '101',
			},
		})
	})

	it('rejects truly undeclared fields and non-string heights rather than accepting unknown payloads', () => {
		expect(() => parse({
			...envelope,
			channel: 'v4_markets',
			contents: {
				markets: {
					'BTC-USD': {
						...market,
						undeclared: true,
					},
				},
			},
			type: 'subscribed',
		})).toThrow()
		expect(() => parse({
			...envelope,
			channel: 'v4_block_height',
			contents: {
				blockHeight: 101,
				time: '2026-08-03T00:00:01.000Z',
			},
			type: 'channel_data',
			version: '1.0.0',
		})).toThrow()
	})

	it('types the exact outbound subscribe, unsubscribe, and ping envelopes', () => {
		expect(DydxWebSocketRequest.assert({
			batched: true,
			channel: 'v4_orderbook',
			id: 'BTC-USD',
			type: 'subscribe',
		})).toMatchObject({
			channel: 'v4_orderbook',
		})
		expect(DydxWebSocketRequest.assert({
			channel: 'v4_block_height',
			type: 'subscribe',
		})).toMatchObject({
			channel: 'v4_block_height',
		})
		expect(DydxWebSocketRequest.assert({
			channel: 'v4_subaccounts',
			id: 'dydx1account/0',
			type: 'unsubscribe',
		})).toMatchObject({
			type: 'unsubscribe',
		})
		expect(DydxWebSocketRequest.assert({
			batched: true,
			channel: 'v4_candles',
			id: 'BTC-USD/1MIN',
			type: 'subscribe',
		})).toMatchObject({
			channel: 'v4_candles',
		})
		expect(DydxWebSocketRequest.assert({
			id: 7,
			type: 'ping',
		})).toMatchObject({
			type: 'ping',
		})
		expect(() => DydxWebSocketRequest.assert({
			channel: 'v4_block_height',
			id: 'not-valid-for-this-channel',
			type: 'subscribe',
		})).toThrow()
		expect(() => DydxWebSocketRequest.assert({
			batched: true,
			channel: 'v4_markets',
			type: 'unsubscribe',
		})).toThrow()
	})
})
