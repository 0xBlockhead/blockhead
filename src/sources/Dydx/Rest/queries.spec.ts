import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getFills,
	getHeight,
	getHistoricalFunding,
	getOrder,
	getOrders,
	getPerpetualMarkets,
	getPerpetualPositions,
	getSubaccount,
} = await import('$/sources/Dydx/Rest/queries.ts')

const {
	dydxNextFundingAtMs,
} = await import('$/sources/Dydx/Rest/types.ts')

const binding = bindings[Source.DydxIndexer].find(
	({ apiFamily }) => apiFamily === ApiFamily.OpenApiHttp
)

if (binding == null)
	throw new Error('DydxIndexer_Rest: OpenAPI binding is missing')

const address = `dydx1${'q'.repeat(38)}`
const observedAtMs = 1_784_678_400_000

const btcMarket = {
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
} as const

const orderRow = {
	id: 'order-1',
	subaccountId: `${address}/7`,
	clientId: '42',
	clobPairId: '0',
	side: 'BUY',
	size: '9007199254740993.1',
	totalFilled: '0.1',
	price: '0.000000000000000001',
	type: 'LIMIT',
	reduceOnly: false,
	orderFlags: '0',
	clientMetadata: '0',
	timeInForce: 'GTT',
	status: 'OPEN',
	postOnly: false,
	ticker: 'BTC-USD',
	subaccountNumber: 7,
} as const

const fillRow = {
	id: 'fill-1',
	side: 'BUY',
	liquidity: 'TAKER',
	type: 'LIMIT',
	market: 'BTC-USD',
	marketType: 'PERPETUAL',
	price: '1.000000000000000001',
	size: '0.1',
	fee: '-0.00001',
	affiliateRevShare: '0',
	createdAt: '2026-08-02T00:00:00.000Z',
	createdAtHeight: '9007199254740993',
	subaccountNumber: 7,
} as const

const positionRow = {
	market: 'BTC-USD',
	status: 'OPEN',
	side: 'SHORT',
	size: '-0.0001',
	maxSize: '1.5',
	entryPrice: '65554.24769',
	realizedPnl: '-0.01',
	createdAt: '2026-07-01T00:00:00.000Z',
	createdAtHeight: '100',
	sumOpen: '1',
	sumClose: '0',
	netFunding: '-0.000001',
	unrealizedPnl: '0.02',
	subaccountNumber: 7,
} as const

describe('dYdX v4 read-only public transport', () => {
	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(observedAtMs)
		sourceGetJson.mockReset()
		sourceGetJson.mockImplementation((_binding, url) => Promise.reject(new Error(`Unexpected URL ${url}`)))
	})

	it('preserves market decimals with truthful source receipt provenance', async () => {
		sourceGetJson.mockResolvedValue({
			markets: {
				'BTC-USD': btcMarket,
			},
		})

		const marketObservation = await getPerpetualMarkets({
			ticker: 'BTC-USD',
		})
		expect(marketObservation).toMatchObject({
			value: {
				markets: {
					'BTC-USD': {
						oraclePrice: '65554.247690000000000001',
						nextFundingRate: '-0.0000000000001',
					},
				},
			},
			observedAtMs,
		})
		expect(marketObservation).not.toHaveProperty('resolvedAtMs')
		expect(marketObservation).not.toHaveProperty('indexedAtHeight')
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://indexer.dydx.trade/v4/perpetualMarkets?ticker=BTC-USD'
		)
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
		expect(dydxNextFundingAtMs(observedAtMs)).toBe(observedAtMs + 3_600_000)
	})

	it('rejects a malformed oracle price after envelope shape', async () => {
		sourceGetJson.mockResolvedValue({
			markets: {
				'BTC-USD': {
					...btcMarket,
					oraclePrice: 'invalid',
				},
			},
		})

		await expect(getPerpetualMarkets({
			ticker: 'BTC-USD',
		})).rejects.toThrow('invalid non-negative decimal oraclePrice')
	})

	it('rejects incomplete market envelopes fail-closed', async () => {
		sourceGetJson.mockResolvedValue({
			markets: {
				'BTC-USD': {
					ticker: 'BTC-USD',
					oraclePrice: '1',
				},
			},
		})

		await expect(getPerpetualMarkets({
			ticker: 'BTC-USD',
		})).rejects.toThrow('invalid perpetual markets envelope')
	})

	it('preserves indexer height with fail-closed decimal-free height identity', async () => {
		sourceGetJson.mockResolvedValue({
			height: '12345678901234567890',
			time: '2026-08-03T12:34:56.789Z',
		})

		await expect(getHeight()).resolves.toMatchObject({
			value: {
				height: '12345678901234567890',
				time: '2026-08-03T12:34:56.789Z',
			},
			observedAtMs,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://indexer.dydx.trade/v4/height'
		)
	})

	it('rejects malformed height payloads', async () => {
		sourceGetJson.mockResolvedValue({
			height: '12.5',
			time: '2026-08-03T12:34:56.789Z',
		})
		await expect(getHeight()).rejects.toThrow('invalid height envelope')

		sourceGetJson.mockResolvedValue({
			height: '1',
			time: 'not-a-time',
		})
		await expect(getHeight()).rejects.toThrow('invalid height time')
	})

	it('keeps public subaccount identity independent of signing state', async () => {
		sourceGetJson.mockResolvedValue({
			address,
			subaccountNumber: 128_000,
			equity: '-0.000000000000000001',
			freeCollateral: '9007199254740993.000000000000000001',
			openPerpetualPositions: {},
			assetPositions: {},
			marginEnabled: true,
			updatedAtHeight: '9007199254740992',
			latestProcessedBlockHeight: '9007199254740993',
		})

		await expect(getSubaccount({
			address,
			subaccountNumber: 128_000,
		})).resolves.toMatchObject({
			value: {
				address,
				subaccountNumber: 128_000,
				freeCollateral: '9007199254740993.000000000000000001',
			},
		})
	})

	it('fail-closes mismatched subaccount position market identity', async () => {
		sourceGetJson.mockResolvedValue({
			address,
			subaccountNumber: 7,
			equity: '1',
			freeCollateral: '1',
			openPerpetualPositions: {
				'ETH-USD': positionRow,
			},
			assetPositions: {},
			marginEnabled: true,
			updatedAtHeight: '100',
			latestProcessedBlockHeight: '100',
		})

		await expect(getSubaccount({
			address,
			subaccountNumber: 7,
		})).rejects.toThrow('mismatched subaccount position market identity')
	})

	it.each([
		{
			query: getOrders,
			path: '/v4/orders',
			response: [orderRow],
		},
		{
			query: getFills,
			path: '/v4/fills',
			response: {
				fills: [fillRow],
			},
		},
		{
			query: getPerpetualPositions,
			path: '/v4/perpetualPositions',
			response: {
				positions: [positionRow],
			},
		},
	])('bounds and preserves $path rows', async ({ query, path, response }) => {
		sourceGetJson.mockResolvedValue(response)

		await expect(query({
			address,
			subaccountNumber: 7,
			limit: 1,
		})).resolves.toMatchObject({
			value: [expect.objectContaining({
				subaccountNumber: 7,
			})],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			expect.stringContaining(
				`https://indexer.dydx.trade${path}?address=${address}&subaccountNumber=7&limit=1`
			)
		)
	})

	it('loads a singular order by id with identity fail-closed', async () => {
		sourceGetJson.mockResolvedValue(orderRow)

		await expect(getOrder({
			address,
			subaccountNumber: 7,
			orderId: 'order-1',
		})).resolves.toMatchObject({
			value: {
				id: 'order-1',
				ticker: 'BTC-USD',
			},
			observedAtMs,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://indexer.dydx.trade/v4/orders/order-1'
		)

		sourceGetJson.mockResolvedValue({
			...orderRow,
			id: 'other',
		})
		await expect(getOrder({
			address,
			subaccountNumber: 7,
			orderId: 'order-1',
		})).rejects.toThrow('mismatched order identity')

		sourceGetJson.mockResolvedValue({
			...orderRow,
			subaccountId: `dydx1${'p'.repeat(38)}/7`,
		})
		await expect(getOrder({
			address,
			subaccountNumber: 7,
			orderId: 'order-1',
		})).rejects.toThrow('foreign subaccount order')
	})

	it('loads historical funding with ticker identity fail-closed', async () => {
		sourceGetJson.mockResolvedValue({
			historicalFunding: [{
				ticker: 'BTC-USD',
				rate: '-0.000001125',
				price: '64246.90921',
				effectiveAtHeight: '100582681',
				effectiveAt: '2026-08-07T01:00:00.357Z',
			}],
		})

		await expect(getHistoricalFunding({
			ticker: 'BTC-USD',
			limit: 1,
		})).resolves.toMatchObject({
			value: [{
				ticker: 'BTC-USD',
				rate: '-0.000001125',
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://indexer.dydx.trade/v4/historicalFunding/BTC-USD?limit=1'
		)

		sourceGetJson.mockResolvedValue({
			historicalFunding: [{
				ticker: 'ETH-USD',
				rate: '0',
				price: '1',
				effectiveAtHeight: '1',
				effectiveAt: '2026-08-07T01:00:00.000Z',
			}],
		})
		await expect(getHistoricalFunding({
			ticker: 'BTC-USD',
		})).rejects.toThrow('mismatched historical funding ticker')

		sourceGetJson.mockResolvedValue({
			historicalFunding: [
				{
					ticker: 'BTC-USD',
					rate: '0',
					price: '1',
					effectiveAtHeight: '1',
					effectiveAt: '2026-08-07T01:00:00.000Z',
				},
				{
					ticker: 'BTC-USD',
					rate: '0',
					price: '1',
					effectiveAtHeight: '1',
					effectiveAt: '2026-08-07T01:00:00.000Z',
				},
			],
		})
		await expect(getHistoricalFunding({
			ticker: 'BTC-USD',
		})).rejects.toThrow('historical funding response contains duplicate heights')
	})

	it('rejects malformed inputs, foreign subjects, and write-shaped arbitrary paths', async () => {
		await expect(getOrders({
			address: 'cosmos1foreign',
			subaccountNumber: 0,
		})).rejects.toThrow('invalid dYdX address')
		await expect(getFills({
			address,
			subaccountNumber: 128_001,
		})).rejects.toThrow('invalid subaccount number')
		await expect(getPerpetualPositions({
			address,
			subaccountNumber: 0,
			limit: 101,
		})).rejects.toThrow('invalid page limit')

		sourceGetJson.mockResolvedValue([{
			...orderRow,
			subaccountNumber: 1,
		}])
		await expect(getOrders({
			address,
			subaccountNumber: 0,
		})).rejects.toThrow('foreign subaccount order')

		sourceGetJson.mockResolvedValue([{
			...orderRow,
			subaccountId: `dydx1${'p'.repeat(38)}/7`,
		}])
		await expect(getOrders({
			address,
			subaccountNumber: 7,
		})).rejects.toThrow('foreign subaccount order')

		sourceGetJson.mockResolvedValue([
			orderRow,
			orderRow,
		])
		await expect(getOrders({
			address,
			subaccountNumber: 7,
		})).rejects.toThrow('order response contains duplicate ids')

		sourceGetJson.mockResolvedValue({
			fills: [{
				id: 'fill-1',
			}],
		})
		await expect(getFills({
			address,
			subaccountNumber: 0,
		})).rejects.toThrow('invalid fills envelope')

		sourceGetJson.mockResolvedValue({
			fills: [
				fillRow,
				fillRow,
			],
		})
		await expect(getFills({
			address,
			subaccountNumber: 7,
		})).rejects.toThrow('fill response contains duplicate ids')

		expect('query' in await import('$/sources/Dydx/Rest/queries.ts')).toBe(false)
	})

})
