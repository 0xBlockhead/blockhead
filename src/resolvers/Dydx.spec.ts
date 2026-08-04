import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	sourceGetJson,
	subscribeDydxIndexer,
} = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	subscribeDydxIndexer: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

vi.mock('$/sources/Dydx/WebSocket/queries.ts', () => ({
	subscribeDydxIndexer,
}))

const {
	default: dydx,
	dydxChainMarketResolver,
	dydxChainNetworkResolver,
	dydxChainSubaccountOrdersResolver,
	dydxChainSubaccountResolver,
	dydxNetworkReferenceResolver,
} = await import('$/resolvers/Dydx.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	$network: {
		slug: 'dydx',
	},
}

const market = {
	$network: network,
	ticker: 'BTC-USD',
}

const observedAtMs = 1_784_678_400_000
const address = `dydx1${'q'.repeat(38)}`

const subaccount = {
	$network: network,
	$account: {
		$network: network.$network,
		address,
	},
	subaccountNumber: 0,
}

const subaccountResponse = {
	address,
	subaccountNumber: 0,
	equity: '1234.5',
	freeCollateral: '987.25',
	openPerpetualPositions: {
		'BTC-USD': {
			market: 'BTC-USD',
			status: 'OPEN',
			side: 'LONG',
			size: '0.25',
			maxSize: '0.25',
			entryPrice: '64000',
			realizedPnl: '-1.5',
			createdAt: '2026-07-01T00:00:00.000Z',
			createdAtHeight: '100',
			sumOpen: '0.25',
			sumClose: '0',
			netFunding: '-0.05',
			unrealizedPnl: '12.75',
			subaccountNumber: 0,
		},
		'ETH-USD': {
			market: 'ETH-USD',
			status: 'OPEN',
			side: 'SHORT',
			size: '1',
			maxSize: '1',
			entryPrice: '3000',
			realizedPnl: '0',
			createdAt: '2026-07-01T00:00:00.000Z',
			createdAtHeight: '100',
			sumOpen: '1',
			sumClose: '0',
			netFunding: '0',
			unrealizedPnl: '1',
			subaccountNumber: 0,
		},
	},
	assetPositions: {},
	marginEnabled: true,
	updatedAtHeight: '12345678901234567890',
	latestProcessedBlockHeight: '12345678901234567891',
}

const orders = [{
	id: 'order-1',
	subaccountId: `${address}/0`,
	clientId: '42',
	clobPairId: '0',
	side: 'BUY',
	size: '0.25',
	totalFilled: '0.1',
	price: '65000.125',
	type: 'LIMIT',
	reduceOnly: false,
	orderFlags: '0',
	goodTilBlock: '12345678901234567900',
	createdAtHeight: '12345678901234567880',
	createdAt: '2026-08-01T00:00:00.000Z',
	clientMetadata: '0',
	timeInForce: 'GTT',
	status: 'OPEN',
	postOnly: false,
	ticker: 'BTC-USD',
	updatedAt: '2026-08-02T00:00:00.000Z',
	updatedAtHeight: '12345678901234567895',
	subaccountNumber: 0,
}]

const markets = {
	'BTC-USD': {
		clobPairId: '0',
		ticker: 'BTC-USD',
		status: 'ACTIVE',
		oraclePrice: '65554.247690000000000001',
		priceChange24H: '-746.07211',
		volume24H: '42428295.3917',
		trades24H: 6131,
		nextFundingRate: '-0.0000000000001',
		initialMarginFraction: '0.02',
		maintenanceMarginFraction: '0.012',
		openInterest: '308.7674',
		atomicResolution: -10,
		quantumConversionExponent: -9,
		tickSize: '1',
		stepSize: '0.0001',
		stepBaseQuantums: 1_000_000,
		subticksPerTick: 100_000,
		marketType: 'CROSS',
		openInterestLowerCap: '0',
		openInterestUpperCap: '0',
		baseOpenInterest: '782.0931',
		defaultFundingRate1H: '0',
	},
	'ETH-USD': {
		clobPairId: '1',
		ticker: 'ETH-USD',
		status: 'PAUSED',
		oraclePrice: '3000.1',
		priceChange24H: '1',
		volume24H: '2',
		trades24H: 3,
		nextFundingRate: '0.001',
		initialMarginFraction: '0.05',
		maintenanceMarginFraction: '0.03',
		openInterest: '4.5',
		atomicResolution: -9,
		quantumConversionExponent: -8,
		tickSize: '0.1',
		stepSize: '0.001',
		stepBaseQuantums: 100_000,
		subticksPerTick: 10_000,
		marketType: 'ISOLATED',
		baseOpenInterest: '5.5',
	},
}

const liveField = () => ({
	replaceRows: vi.fn(),
	invalidate: vi.fn(),
	count: {
		replaceRows: vi.fn(),
		invalidate: vi.fn(),
	},
})

const liveFields = () => ({
	'$$markets': liveField(),
	'$$timestamps': liveField(),
})

const startDydxNetworkLive = (
	fields: ReturnType<typeof liveFields>,
	signal = new AbortController().signal
) => dydxChainNetworkResolver.resolveLive.network.start({
	parentEntitySelector: network,
	queryClient: new QueryClient(),
	signal,
	trigger: context,
	fields,
})

const heightResponse = {
	height: '12345678901234567890',
	time: '2026-08-03T12:34:56.789Z',
}

describe('dYdX Indexer resolvers', () => {
	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(observedAtMs)
		sourceGetJson.mockReset()
		subscribeDydxIndexer.mockReset()
		sourceGetJson.mockImplementation((_binding, url) => Promise.resolve(
			url.includes('/v4/height') ?
				heightResponse
			:
			url.includes('/v4/addresses/') ?
				subaccountResponse
			:
			url.includes('/v4/orders?') ?
				orders
			:
				{
					markets: (
						url.includes('?ticker=BTC-USD') ?
							{
								'BTC-USD': markets['BTC-USD'],
							}
						:
							markets
					),
				}
		))
	})

	it('registers only the dYdX Indexer source', () => {
		expect(dydx.source).toBe(Source.DydxIndexer)
		expect(dydx.resolvers).toEqual([
			dydxChainMarketResolver,
			dydxChainNetworkResolver,
			dydxChainSubaccountOrdersResolver,
			dydxChainSubaccountResolver,
			dydxNetworkReferenceResolver,
		])
	})

	it('derives the native chain selector from the canonical Network without transport', async () => {
		const snapshot = await dydxNetworkReferenceResolver.resolve.Slug.resolve(
			network.$network,
			context
		)

		expect(dydxNetworkReferenceResolver.projections.Dydx.$dydxChainNetwork(
			snapshot,
			network.$network
		)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network.$network,
			},
		})
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('materializes a bounded market directory and source-owned network observation', async () => {
		const snapshot = await dydxChainNetworkResolver.resolve.Network.resolve(network, context)

		expect(snapshot.markets).toHaveLength(1)
		expect(snapshot.marketCount).toBe(2)
		expect(snapshot.blockHeight).toBe(12345678901234567890n)
		expect(snapshot.observedAtMs).toBe(Date.parse(heightResponse.time))
		expect(dydxChainNetworkResolver.projections.$$markets(snapshot, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				ticker: 'BTC-USD',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: 'BTC',
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: 'USD',
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: 'CROSS',
			},
		}])
		expect(dydxChainNetworkResolver.projections.$$timestamps(snapshot, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.parse(heightResponse.time),
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: 12345678901234567890n,
				[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'marketCount')]: 2,
			},
		}])
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			'https://indexer.dydx.trade/v4/height'
		)
	})

	it('publishes the bounded market snapshot, actual count, and exact upstream block height observation', async () => {
		const fields = liveFields()
		const blockTime = '2026-08-03T12:34:56.789Z'
		let markMarketsProcessed = () => {}
		const marketsProcessed = new Promise<void>((resolve) => {
			markMarketsProcessed = resolve
		})
		subscribeDydxIndexer.mockImplementation(async function* (subscription) {
			if (subscription.channel === 'v4_markets') {
				yield {
					channel: 'v4_markets',
					contents: {
						markets,
					},
					type: 'subscribed',
				}
				markMarketsProcessed()
				return
			}

			await marketsProcessed
			yield {
				channel: 'v4_block_height',
				contents: {
					height: '12345678901234567890',
					time: blockTime,
				},
				type: 'subscribed',
			}
		})

		await startDydxNetworkLive(fields)

		expect(subscribeDydxIndexer.mock.calls.map(([subscription]) => subscription)).toEqual([
			{
				channel: 'v4_markets',
				type: 'subscribe',
			},
			{
				channel: 'v4_block_height',
				type: 'subscribe',
			},
		])
		expect(fields.$$markets.replaceRows).toHaveBeenCalledWith([{
			source: Source.DydxIndexer,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					ticker: 'BTC-USD',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: 'BTC',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: 'USD',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: 'CROSS',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$market: {
								$network: network,
								ticker: 'BTC-USD',
							},
							timestampMs: observedAtMs,
							source: Source.DydxIndexer,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: '-0.0000000000001',
							[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: '308.7674',
							[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: '65554.247690000000000001',
							[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: 'ACTIVE',
						},
					}],
				},
			}],
		}])
		expect(fields.$$markets.count.replaceRows).toHaveBeenCalledWith([{
			source: Source.DydxIndexer,
			value: 2,
		}])
		expect(fields.$$timestamps.replaceRows).toHaveBeenNthCalledWith(1, [{
			source: Source.DydxIndexer,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: observedAtMs,
					source: Source.DydxIndexer,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'marketCount')]: 2,
				},
			}],
		}])
		expect(fields.$$timestamps.replaceRows).toHaveBeenNthCalledWith(2, [{
			source: Source.DydxIndexer,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: Date.parse(blockTime),
					source: Source.DydxIndexer,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: 12345678901234567890n,
					[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'marketCount')]: 2,
				},
			}],
		}])
	})

	it('applies market deltas by canonical ticker independently of market and CLOB IDs', async () => {
		const fields = liveFields()
		const oracleTime = '2026-08-03T12:35:00.123Z'
		const batchOracleTime = '2026-08-03T12:36:00.456Z'
		subscribeDydxIndexer.mockImplementation(async function* (subscription) {
			if (subscription.channel !== 'v4_markets')
				return

			yield {
				channel: 'v4_markets',
				contents: {
					markets,
				},
				type: 'subscribed',
			}
			yield {
				channel: 'v4_markets',
				contents: {
					oraclePrices: {
						'BTC-USD': {
							effectiveAt: oracleTime,
							effectiveAtHeight: '2',
							marketId: 904,
							oraclePrice: '65555.000000000000000009',
						},
						'DOGE-USD': {
							effectiveAt: oracleTime,
							effectiveAtHeight: '2',
							marketId: 0,
							oraclePrice: '3001.000000000000000001',
						},
					},
					trading: {
						'BTC-USD': {
							marketType: 'ISOLATED',
							nextFundingRate: '-0.000000000000000007',
						},
						'ETH-USD': {
							openInterest: '999.999999999999999999',
						},
					},
				},
				type: 'channel_data',
			}
			yield {
				channel: 'v4_markets',
				contents: [
					{
						trading: {
							'BTC-USD': {
								marketType: 'CROSS',
								openInterest: '309.000000000000000003',
								status: 'PAUSED',
							},
						},
					},
					{
						oraclePrices: {
							'BTC-USD': {
								effectiveAt: batchOracleTime,
								effectiveAtHeight: '3',
								marketId: 905,
								oraclePrice: '65556.000000000000000011',
							},
						},
					},
				],
				type: 'channel_batch_data',
			}
		})

		await startDydxNetworkLive(fields)

		expect(fields.$$markets.replaceRows).toHaveBeenCalledTimes(3)
		expect(fields.$$markets.replaceRows.mock.calls[1][0]).toEqual([{
			source: Source.DydxIndexer,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					ticker: 'BTC-USD',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: 'BTC',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: 'USD',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: 'ISOLATED',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], '$$timestamps')]: [
						{
							[EntityMetaKey.Selector]: {
								$market: {
									$network: network,
									ticker: 'BTC-USD',
								},
								timestampMs: observedAtMs,
								source: Source.DydxIndexer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: '-0.000000000000000007',
							},
						},
						{
							[EntityMetaKey.Selector]: {
								$market: {
									$network: network,
									ticker: 'BTC-USD',
								},
								timestampMs: Date.parse(oracleTime),
								source: Source.DydxIndexer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: '65555.000000000000000009',
							},
						},
					],
				},
			}],
		}])
		expect(fields.$$markets.replaceRows.mock.calls[2][0]).toEqual([{
			source: Source.DydxIndexer,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					ticker: 'BTC-USD',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: 'BTC',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: 'USD',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: 'CROSS',
					[entityFieldAddressKey(EntityType.DydxChainMarket, [], '$$timestamps')]: [
						{
							[EntityMetaKey.Selector]: {
								$market: {
									$network: network,
									ticker: 'BTC-USD',
								},
								timestampMs: observedAtMs,
								source: Source.DydxIndexer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: '309.000000000000000003',
								[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: 'PAUSED',
							},
						},
						{
							[EntityMetaKey.Selector]: {
								$market: {
									$network: network,
									ticker: 'BTC-USD',
								},
								timestampMs: Date.parse(batchOracleTime),
								source: Source.DydxIndexer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: '65556.000000000000000011',
							},
						},
					],
				},
			}],
		}])
	})

	it.each([
		[
			'provider error',
			{
				message: 'provider failed',
				type: 'error',
			},
			'provider failed',
		],
		[
			'unexpected unsubscribe',
			{
				channel: 'v4_markets',
				type: 'unsubscribed',
			},
			'unexpected v4_markets unsubscribe',
		],
		[
			'foreign channel',
			{
				channel: 'v4_block_height',
				contents: {
					height: '1',
					time: '2026-08-03T00:00:00.000Z',
				},
				type: 'subscribed',
			},
			'unexpected v4_block_height message',
		],
	] as const)('rejects a %s from a market subscription', async (_, message, expectedError) => {
		const fields = liveFields()
		subscribeDydxIndexer.mockImplementation(async function* (subscription, signal) {
			if (subscription.channel === 'v4_markets') {
				yield message
				return
			}

			await new Promise<void>((resolve) => {
				signal.addEventListener('abort', () => resolve(), { once: true })
			})
		})

		await expect(startDydxNetworkLive(fields)).rejects.toThrow(expectedError)
	})

	it('propagates malformed provider payload failures from the typed subscription boundary', async () => {
		const fields = liveFields()
		subscribeDydxIndexer.mockImplementation(async function* (subscription, signal) {
			if (subscription.channel === 'v4_markets')
				throw new Error('undeclared must be removed')

			await new Promise<void>((resolve) => {
				signal.addEventListener('abort', () => resolve(), { once: true })
			})
		})

		await expect(startDydxNetworkLive(fields)).rejects.toThrow('undeclared must be removed')
	})

	it('closes both provider streams cleanly when live resolution is aborted', async () => {
		const fields = liveFields()
		const abortController = new AbortController()
		let closedStreamCount = 0
		subscribeDydxIndexer.mockImplementation(async function* (_, signal) {
			try {
				await new Promise<void>((resolve) => {
					signal.addEventListener('abort', () => resolve(), { once: true })
				})
			} finally {
				closedStreamCount++
			}
		})

		const liveResolution = startDydxNetworkLive(fields, abortController.signal)
		await vi.waitFor(() => {
			expect(subscribeDydxIndexer).toHaveBeenCalledTimes(2)
		})
		abortController.abort()
		await liveResolution

		expect(closedStreamCount).toBe(2)
		expect(fields.$$markets.replaceRows).not.toHaveBeenCalled()
		expect(fields.$$timestamps.replaceRows).not.toHaveBeenCalled()
	})

	it('keeps market decimals exact while exposing only schema-compatible fields', async () => {
		const snapshot = await dydxChainMarketResolver.resolve.NetworkTicker.resolve(market, context)

		expect(snapshot.market).toMatchObject({
			oraclePrice: '65554.247690000000000001',
			nextFundingRate: '-0.0000000000001',
			openInterest: '308.7674',
		})
		expect(dydxChainMarketResolver.projections.baseAsset(snapshot)).toBe('BTC')
		expect(dydxChainMarketResolver.projections.quoteAsset(snapshot)).toBe('USD')
		expect(dydxChainMarketResolver.projections.marketKind(snapshot)).toBe('CROSS')
		expect(dydxChainMarketResolver.projections.$$timestamps(snapshot, market)).toEqual([{
			[EntityMetaKey.Selector]: {
				$market: market,
				timestampMs: observedAtMs,
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: '-0.0000000000001',
				[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: '308.7674',
				[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: '65554.247690000000000001',
				[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: 'ACTIVE',
			},
		}])
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(dydxChainNetworkResolver.resolve.Network.resolve({
			$network: {
				slug: 'cosmos',
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('does not correlate market state with the independent height endpoint', async () => {
		await dydxChainMarketResolver.resolve.NetworkTicker.resolve(
			market,
			context
		)

		expect(sourceGetJson).toHaveBeenCalledTimes(1)
		expect(sourceGetJson.mock.calls[0][1]).not.toContain('/v4/height')
	})

	it('materializes subaccount state and positions from one bounded account snapshot', async () => {
		const observation = await dydxChainSubaccountResolver.resolve.NetworkAccountSubaccountNumber.resolve(
			subaccount,
			context
		)

		expect(sourceGetJson).toHaveBeenCalledTimes(1)
		expect(sourceGetJson.mock.calls[0][1]).toContain(`/v4/addresses/${address}/subaccountNumber/0`)
		expect(dydxChainSubaccountResolver.projections.$$timestamps(
			observation,
			subaccount
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$subaccount: subaccount,
				timestampMs: observedAtMs,
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'blockHeight')]: 12345678901234567890n,
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'equity')]: '1234.5',
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'freeCollateral')]: '987.25',
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'openPositionCount')]: 2,
			},
		}])
		expect(dydxChainSubaccountResolver.projections.$$positions.select(
			observation,
			subaccount
		)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$subaccount: subaccount,
				$market: {
					$network: network,
					ticker: 'BTC-USD',
				},
				timestampMs: observedAtMs,
				source: Source.DydxIndexer,
			},
		})
		expect(dydxChainSubaccountResolver.projections.$$positions.resolveCount(
			observation,
			subaccount,
			context
		)).toBe(2)
	})

	it('loads orders independently and preserves their native update coordinate', async () => {
		const observation = await dydxChainSubaccountOrdersResolver.resolve.NetworkAccountSubaccountNumber.resolve(
			subaccount,
			context
		)
		const projectedOrder = dydxChainSubaccountOrdersResolver.projections.$$orders(
			observation,
			subaccount
		)[0]

		expect(sourceGetJson).toHaveBeenCalledTimes(1)
		expect(sourceGetJson.mock.calls[0][1]).toContain('/v4/orders?')
		expect(sourceGetJson.mock.calls[0][1]).not.toContain('/v4/addresses/')
		expect(projectedOrder[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.DydxChainOrder, [], '$$timestamps')
		]).toEqual([{
			[EntityMetaKey.Selector]: {
				$order: {
					$subaccount: subaccount,
					orderId: 'order-1',
				},
				timestampMs: Date.parse('2026-08-02T00:00:00.000Z'),
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'blockHeight')]: 12345678901234567895n,
				[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'status')]: 'OPEN',
				[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'price')]: '65000.125',
				[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'size')]: '0.25',
				[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'totalFilled')]: '0.1',
			},
		}])
	})
})
