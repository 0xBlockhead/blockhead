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
	getOrders,
	getPerpetualMarkets,
	getPerpetualPositions,
	getSubaccount,
} = await import('$/sources/Dydx/Rest/queries.ts')

const binding = bindings[Source.DydxIndexer].find(
	({ apiFamily }) => apiFamily === ApiFamily.OpenApiHttp
)

if (binding == null)
	throw new Error('DydxIndexer_Rest: OpenAPI binding is missing')

const address = `dydx1${'q'.repeat(38)}`
const observedAtMs = 1_784_678_400_000

describe('dYdX v4 read-only public transport', () => {
	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(observedAtMs)
		sourceGetJson.mockReset()
		sourceGetJson.mockImplementation((_binding, url) => Promise.reject(new Error(`Unexpected URL ${url}`)))
	})

	it('preserves market decimals with truthful source receipt provenance', async () => {
		sourceGetJson.mockResolvedValue({
			markets: {
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
	})

	it('rejects a malformed oracle price', async () => {
		sourceGetJson.mockResolvedValue({
			markets: {
				'BTC-USD': {
					ticker: 'BTC-USD',
					oraclePrice: 'invalid',
					priceChange24H: '0',
					volume24H: '0',
					nextFundingRate: '0',
					initialMarginFraction: '0',
					maintenanceMarginFraction: '0',
					openInterest: '0',
					tickSize: '0',
					stepSize: '0',
					baseOpenInterest: '0',
				},
			},
		})

		await expect(getPerpetualMarkets({
			ticker: 'BTC-USD',
		})).rejects.toThrow('invalid non-negative decimal oraclePrice')
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

	it.each([
		{
			query: getOrders,
			path: '/v4/orders',
			response: [{
				id: 'order-1',
				subaccountNumber: 7,
				price: '0.000000000000000001',
				size: '9007199254740993.1',
				totalFilled: '0.1',
			}],
		},
		{
			query: getFills,
			path: '/v4/fills',
			response: {
				fills: [{
					id: 'fill-1',
					subaccountNumber: 7,
					price: '1.000000000000000001',
					size: '0.1',
					fee: '-0.00001',
					affiliateRevShare: '0',
					createdAtHeight: '9007199254740993',
				}],
			},
		},
		{
			query: getPerpetualPositions,
			path: '/v4/perpetualPositions',
			response: {
				positions: [{
					market: 'BTC-USD',
					subaccountNumber: 7,
					size: '-0.0001',
					maxSize: '1.5',
					entryPrice: '65554.24769',
					realizedPnl: '-0.01',
					unrealizedPnl: '0.02',
					sumOpen: '1',
					sumClose: '0',
					netFunding: '-0.000001',
				}],
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
			subaccountNumber: 1,
			price: '1',
			size: '1',
			totalFilled: '0',
		}])
		await expect(getOrders({
			address,
			subaccountNumber: 0,
		})).rejects.toThrow('foreign subaccount order')

		expect('query' in await import('$/sources/Dydx/Rest/queries.ts')).toBe(false)
	})

})
