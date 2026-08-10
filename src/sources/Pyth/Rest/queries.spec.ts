import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Pyth/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/Pyth/Rest/queries.ts')

const hermesBinding = bindings[Source.PythHermes_Rest][0]
const benchmarksBinding = bindings[Source.PythBenchmarks_Rest][0]

const priceFeedId = 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'

const hermesFeed = {
	id: priceFeedId,
	attributes: {
		asset_type: 'Crypto',
		base: 'BTC',
		country: 'US',
		quote_currency: 'USD',
		symbol: 'Crypto.BTC/USD',
	},
}

const priceUpdate = {
	binary: {
		encoding: 'hex' as const,
		data: ['504e4155'],
	},
	parsed: [{
		id: priceFeedId,
		price: {
			price: '900719925474099312345',
			conf: '12345678901234567890',
			expo: -8,
			publish_time: 1_785_470_400,
		},
		ema_price: {
			price: '900719925474099300000',
			conf: '12345678901234567000',
			expo: -8,
			publish_time: 1_785_470_399,
		},
		metadata: {
			prev_publish_time: 1_785_470_399,
			proof_available_time: 1_785_470_401,
			slot: 400_000_000,
		},
	}],
}

afterEach(() => {
	vi.useRealTimers()
})

describe('Pyth Hermes OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses Hermes metadata as the price-feed catalog', async () => {
		getJson.mockResolvedValue([hermesFeed])

		await expect(queries.getPriceFeeds()).resolves.toEqual([hermesFeed])
		expect(getJson).toHaveBeenCalledWith(hermesBinding, '/v2/price_feeds')
	})

	it('encodes the official metadata filters without a parallel catalog contract', async () => {
		getJson.mockResolvedValue([])

		await queries.getPriceFeeds({
			query: 'BTC / USD',
			asset_type: 'crypto',
		})

		expect(getJson).toHaveBeenCalledWith(
			hermesBinding,
			'/v2/price_feeds?query=BTC+%2F+USD&asset_type=crypto'
		)
	})

	it('preserves lossless price units from the latest-update response', async () => {
		getJson.mockResolvedValue(priceUpdate)

		await expect(queries.getLatestPriceUpdates({
			'ids[]': [priceFeedId],
			encoding: 'base64',
			parsed: true,
			ignore_invalid_price_ids: false,
		})).resolves.toMatchObject({
			priceUpdate: {
				parsed: [{
					price: {
						price: '900719925474099312345',
						conf: '12345678901234567890',
					},
				}],
			},
			fetchedAtMs: expect.any(Number),
		})
		expect(getJson).toHaveBeenCalledWith(
			hermesBinding,
			`/v2/updates/price/latest?ids%5B%5D=${priceFeedId}&encoding=base64&parsed=true&ignore_invalid_price_ids=false`
		)
	})

	it('records Hermes fetch time after the validated response resolves', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(1_700_000_000_000)
		const pendingResponse = Promise.withResolvers<unknown>()
		getJson.mockReturnValue(pendingResponse.promise)

		const result = queries.getLatestPriceUpdates({
			'ids[]': [priceFeedId],
			parsed: true,
		})
		vi.setSystemTime(1_700_000_000_123)
		pendingResponse.resolve(priceUpdate)

		await expect(result).resolves.toEqual({
			priceUpdate,
			fetchedAtMs: 1_700_000_000_123,
		})
	})

	it('fail-closes malformed Hermes price-feed catalogs', async () => {
		getJson.mockResolvedValue([{
			id: 'not-a-price-feed-id',
			attributes: {},
		}])

		await expect(queries.getPriceFeeds()).rejects.toThrow('invalid Hermes price feeds response envelope')
	})

	it('fail-closes malformed Hermes latest price updates', async () => {
		getJson.mockResolvedValue({
			binary: {
				encoding: 'hex',
				data: ['504e4155'],
			},
			parsed: [{
				id: priceFeedId,
				price: {
					price: 'not-an-integer',
					conf: '1',
					expo: -8,
					publish_time: 1,
				},
				ema_price: {
					price: '1',
					conf: '1',
					expo: -8,
					publish_time: 1,
				},
				metadata: {},
			}],
		})

		await expect(queries.getLatestPriceUpdates({
			'ids[]': [priceFeedId],
			parsed: true,
		})).rejects.toThrow('invalid Hermes latest price updates response envelope')
	})
})

describe('Pyth Benchmarks REST operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('reads Benchmarks price-feed catalog and singular feed rows', async () => {
		const feed = {
			id: priceFeedId,
			market_hours: {
				is_open: true,
				next_open: null,
				next_close: null,
			},
			attributes: {
				symbol: 'Crypto.BTC/USD',
				asset_type: 'Crypto',
				base: 'BTC',
				quote_currency: 'USD',
			},
		}
		getJson.mockResolvedValueOnce([feed])
		getJson.mockResolvedValueOnce(feed)

		await expect(queries.getBenchmarkPriceFeeds({
			query: 'BTC',
			asset_type: 'crypto',
		})).resolves.toEqual([feed])
		expect(getJson).toHaveBeenCalledWith(
			benchmarksBinding,
			'/v1/price_feeds/?query=BTC&asset_type=crypto'
		)

		await expect(queries.getBenchmarkPriceFeed(priceFeedId)).resolves.toEqual(feed)
		expect(getJson).toHaveBeenCalledWith(
			benchmarksBinding,
			`/v1/price_feeds/${priceFeedId}`
		)
	})

	it('reads Benchmarks historical price updates with lossless units', async () => {
		getJson.mockResolvedValue(priceUpdate)

		await expect(queries.getBenchmarkPriceUpdateAt({
			timestampSec: 1_785_470_400,
			ids: [priceFeedId],
			encoding: 'hex',
			parsed: true,
		})).resolves.toMatchObject({
			priceUpdate: {
				parsed: [{
					price: {
						price: '900719925474099312345',
					},
				}],
			},
			fetchedAtMs: expect.any(Number),
		})
		expect(getJson).toHaveBeenCalledWith(
			benchmarksBinding,
			`/v1/updates/price/1785470400?ids=${priceFeedId}&encoding=hex&parsed=true`
		)
	})

	it('records Benchmarks fetch time after the validated response resolves', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(1_700_000_000_000)
		const pendingResponse = Promise.withResolvers<unknown>()
		getJson.mockReturnValue(pendingResponse.promise)

		const result = queries.getBenchmarkPriceUpdateAt({
			timestampSec: 1_785_470_400,
			ids: [priceFeedId],
		})
		vi.setSystemTime(1_700_000_000_456)
		pendingResponse.resolve(priceUpdate)

		await expect(result).resolves.toEqual({
			priceUpdate,
			fetchedAtMs: 1_700_000_000_456,
		})
	})

	it('fail-closes malformed Benchmarks price feeds and updates', async () => {
		getJson.mockResolvedValueOnce({
			id: priceFeedId,
			attributes: {},
		})
		await expect(queries.getBenchmarkPriceFeed(priceFeedId)).rejects.toThrow(
			'invalid Benchmarks price feed response envelope'
		)

		getJson.mockResolvedValueOnce({
			binary: {
				encoding: 'hex',
				data: 'not-an-array',
			},
		})
		await expect(queries.getBenchmarkPriceUpdateAt({
			timestampSec: 1,
			ids: [priceFeedId],
		})).rejects.toThrow('invalid Benchmarks price update response envelope')
	})
})

describe('Pyth Rest export surface', () => {
	it('exports Hermes and Benchmarks operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getBenchmarkPriceFeed',
			'getBenchmarkPriceFeeds',
			'getBenchmarkPriceUpdateAt',
			'getLatestPriceUpdates',
			'getPriceFeeds',
		])
	})
})
