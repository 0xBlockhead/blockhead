import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBenchmarkPriceFeed = vi.hoisted(() => vi.fn())
const getBenchmarkPriceUpdateAt = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Pyth/Rest/queries.ts', () => ({
	getBenchmarkPriceFeed,
	getBenchmarkPriceUpdateAt,
}))

const { default: pythBenchmarks, pythBenchmarksStableChannel } = await import('$/resolvers/PythBenchmarks-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const priceFeedId = '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43' as const
const publishTimeSec = 1_785_470_400
const providerClockMs = publishTimeSec * 1000

const feedWire = {
	id: priceFeedId.slice(2),
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

const priceUpdate = {
	binary: {
		encoding: 'hex' as const,
		data: ['504e4155abcd'],
	},
	parsed: [{
		id: priceFeedId.slice(2),
		price: {
			price: '6425840822437',
			conf: '1613066739',
			expo: -8,
			publish_time: publishTimeSec,
		},
		ema_price: {
			price: '6430436100000',
			conf: '1924332840',
			expo: -8,
			publish_time: publishTimeSec,
		},
		metadata: {
			slot: 306977882,
		},
	}],
}

const feedResolver = pythBenchmarks.resolvers.find((candidate) => (
	candidate.entityType === EntityType.PythPriceFeed
))
const timestampResolver = pythBenchmarks.resolvers.find((candidate) => (
	candidate.entityType === EntityType.PythPriceFeed_Timestamp
))
if (feedResolver == null || timestampResolver == null)
	throw new Error('PythBenchmarks_Rest: expected PythPriceFeed resolvers')

describe('PythBenchmarks_Rest PythPriceFeed projections', () => {
	beforeEach(() => {
		getBenchmarkPriceFeed.mockReset()
		getBenchmarkPriceUpdateAt.mockReset()
	})

	it('projects enrolled catalog leftovers + tip observation', async () => {
		getBenchmarkPriceFeed.mockResolvedValue(feedWire)
		getBenchmarkPriceUpdateAt.mockResolvedValue({
			priceUpdate,
			providerClockMs,
		})

		await expect(feedResolver.resolve.PriceFeedIdChannel.resolve({
			priceFeedId,
			channel: pythBenchmarksStableChannel,
		}, context)).resolves.toEqual({
			priceFeedId,
			channel: pythBenchmarksStableChannel,
			symbol: 'Crypto.BTC/USD',
			assetClass: 'Crypto',
			baseAsset: 'BTC',
			quoteAsset: 'USD',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$feed: {
						priceFeedId,
						channel: pythBenchmarksStableChannel,
					},
					publishTimeMs: publishTimeSec * 1000,
					source: Source.PythBenchmarks_Rest,
				},
				observedAtMs: providerClockMs,
				price: 6425840822437n,
				conf: 1613066739n,
				expo: -8,
				emaPrice: 6430436100000n,
				emaConf: 1924332840n,
				slot: 306977882n,
				vaa: '0x504e4155abcd',
			}],
		})
		expect(getBenchmarkPriceFeed).toHaveBeenCalledWith(priceFeedId.slice(2))
	})


	it('re-resolves historical observations by publishTimeMs', async () => {
		getBenchmarkPriceUpdateAt.mockResolvedValue({
			priceUpdate,
			providerClockMs,
		})

		await expect(timestampResolver.resolve.FeedPublishTimeMsSource.resolve({
			$feed: {
				priceFeedId,
				channel: pythBenchmarksStableChannel,
			},
			publishTimeMs: publishTimeSec * 1000,
			source: Source.PythBenchmarks_Rest,
		}, context)).resolves.toMatchObject({
			observedAtMs: providerClockMs,
			price: 6425840822437n,
			publishTimeMs: publishTimeSec * 1000,
			source: Source.PythBenchmarks_Rest,
			vaa: '0x504e4155abcd',
		})
		expect(getBenchmarkPriceUpdateAt).toHaveBeenCalledWith({
			timestampSec: publishTimeSec,
			ids: [priceFeedId.slice(2)],
			encoding: 'hex',
			parsed: true,
		})
	})

	it('rejects non-Stable channels', async () => {
		await expect(feedResolver.resolve.PriceFeedIdChannel.resolve({
			priceFeedId,
			channel: 'Beta',
		}, context)).rejects.toThrow('unsupported channel')
	})
})
