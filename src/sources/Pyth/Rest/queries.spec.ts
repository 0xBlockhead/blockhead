import {
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

const binding = bindings[Source.PythHermes_Rest]

const priceFeedId = 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'

describe('Pyth Hermes OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses Hermes metadata as the price-feed catalog', async () => {
		getJson.mockResolvedValue([{
			id: priceFeedId,
			attributes: {
				asset_type: 'Crypto',
				base: 'BTC',
				country: 'US',
				quote_currency: 'USD',
				symbol: 'Crypto.BTC/USD',
			},
		}])

		await expect(queries.getPriceFeeds()).resolves.toEqual([{
			id: priceFeedId,
			attributes: {
				asset_type: 'Crypto',
				base: 'BTC',
				country: 'US',
				quote_currency: 'USD',
				symbol: 'Crypto.BTC/USD',
			},
		}])
		expect(getJson).toHaveBeenCalledWith(binding, '/v2/price_feeds')
	})

	it('encodes the official metadata filters without a parallel catalog contract', async () => {
		getJson.mockResolvedValue([])

		await queries.getPriceFeeds({
			query: 'BTC / USD',
			asset_type: 'crypto',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v2/price_feeds?query=BTC+%2F+USD&asset_type=crypto'
		)
	})

	it('preserves lossless price units from the latest-update response', async () => {
		getJson.mockResolvedValue({
			binary: {
				encoding: 'base64',
				data: ['price-update'],
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
		})

		await expect(queries.getLatestPriceUpdates({
			'ids[]': [priceFeedId],
			encoding: 'base64',
			parsed: true,
			ignore_invalid_price_ids: false,
		})).resolves.toMatchObject({
			parsed: [{
				price: {
					price: '900719925474099312345',
					conf: '12345678901234567890',
				},
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/v2/updates/price/latest?ids%5B%5D=${priceFeedId}&encoding=base64&parsed=true&ignore_invalid_price_ids=false`
		)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getLatestPriceUpdates',
			'getPriceFeeds',
		])
	})
})
