import { createResolverContext } from '../../tests/resolverContext.ts'
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

const getLatestPriceUpdates = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Pyth/Rest/queries.ts', () => ({
	getLatestPriceUpdates,
}))

const { default: pythHermes, pythHermesStableChannel } = await import('$/resolvers/PythHermes-Rest.ts')

const context = createResolverContext()

const priceFeedId = '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43' as const
const publishTimeSec = 1_785_470_400
const providerClockMs = publishTimeSec * 1000

const priceUpdate = {
	binary: {
		encoding: 'hex' as const,
		data: ['504e4155abcd'],
	},
	parsed: [{
		id: priceFeedId.slice(2),
		price: {
			price: '900719925474099312345',
			conf: '12345678901234567890',
			expo: -8,
			publish_time: publishTimeSec,
		},
		ema_price: {
			price: '900719925474099300000',
			conf: '12345678901234567000',
			expo: -8,
			publish_time: publishTimeSec,
		},
		metadata: {
			slot: 400_000_000,
		},
	}],
}

const feedResolver = pythHermes.resolvers.find((candidate) => (
	candidate.entityType === EntityType.PythPriceFeed
))
const timestampResolver = pythHermes.resolvers.find((candidate) => (
	candidate.entityType === EntityType.PythPriceFeed_Timestamp
))
if (feedResolver == null || timestampResolver == null)
	throw new Error('PythHermes_Rest: expected PythPriceFeed resolvers')

describe('PythHermes_Rest PythPriceFeed projections', () => {
	beforeEach(() => {
		getLatestPriceUpdates.mockReset()
	})

	it('projects enrolled tip feed + observation fields from Hermes latest updates', async () => {
		getLatestPriceUpdates.mockResolvedValue({
			priceUpdate,
			providerClockMs,
		})

		await expect(feedResolver.resolve.PriceFeedIdChannel.resolve({
			priceFeedId,
			channel: pythHermesStableChannel,
		}, context)).resolves.toEqual({
			priceFeedId,
			channel: pythHermesStableChannel,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$feed: {
						priceFeedId,
						channel: pythHermesStableChannel,
					},
					publishTimeMs: publishTimeSec * 1000,
					source: Source.PythHermes_Rest,
				},
				observedAtMs: providerClockMs,
				price: 900719925474099312345n,
				conf: 12345678901234567890n,
				expo: -8,
				emaPrice: 900719925474099300000n,
				emaConf: 12345678901234567000n,
				slot: 400000000n,
				vaa: '0x504e4155abcd',
			}],
		})
		expect(getLatestPriceUpdates).toHaveBeenCalledWith({
			'ids[]': [priceFeedId.slice(2)],
			encoding: 'hex',
			parsed: true,
			ignore_invalid_price_ids: false,
		})
	})

	it('rejects non-Stable channels and mismatched tip clocks', async () => {
		await expect(feedResolver.resolve.PriceFeedIdChannel.resolve({
			priceFeedId,
			channel: 'Beta',
		}, context)).rejects.toThrow('unsupported channel')

		getLatestPriceUpdates.mockResolvedValue({
			priceUpdate,
			providerClockMs,
		})
		await expect(timestampResolver.resolve.FeedPublishTimeMsSource.resolve({
			$feed: {
				priceFeedId,
				channel: pythHermesStableChannel,
			},
			publishTimeMs: publishTimeSec * 1000 + 1000,
			source: Source.PythHermes_Rest,
		}, context)).rejects.toThrow('publishTimeMs does not match Hermes tip')
	})
})
