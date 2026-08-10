import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	PythBenchmarksPriceFeed,
	PythParsedPriceUpdate,
	PythPriceUpdateResponse,
} from '$/sources/Pyth/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

/** Benchmarks serves the Stable / mainnet feed catalog (no beta channel binding enrolled). */
export const pythBenchmarksStableChannel = 'Stable'

const normalizePriceFeedId = (id: string) => (
	with0xHex(id)
)

const assertStableChannel = (channel: string) => {
	if (channel !== pythBenchmarksStableChannel)
		throw new Error(`PythBenchmarks_Rest: unsupported channel ${channel}`)
}

const priceFeedAttributes = (
	attributes: Record<string, string>
) => ({
	...(attributes.symbol != null && attributes.symbol !== '' && {
		symbol: attributes.symbol,
	}),
	...(attributes.asset_type != null && attributes.asset_type !== '' && {
		assetClass: attributes.asset_type,
	}),
	...(attributes.base != null && attributes.base !== '' && {
		baseAsset: attributes.base,
	}),
	...((
		attributes.quote_currency != null && attributes.quote_currency !== '' ?
			attributes.quote_currency
		: attributes.quote != null && attributes.quote !== '' ?
			attributes.quote
		:
			undefined
	) != null && {
		quoteAsset: attributes.quote_currency ?? attributes.quote,
	}),
})

const feedFromBenchmarks = (
	row: PythBenchmarksPriceFeed,
	channel: string
) => ({
	priceFeedId: normalizePriceFeedId(row.id),
	channel,
	...priceFeedAttributes(row.attributes),
})

const observationFromParsedUpdate = (
	feed: {
		priceFeedId: `0x${string}`
		channel: string
	},
	update: PythParsedPriceUpdate,
	priceUpdate: PythPriceUpdateResponse,
	observedAtMs: number
) => {
	const publishTimeMs = update.price.publish_time * 1000
	const hexUpdate = (
		priceUpdate.binary.encoding === 'hex'
		&& priceUpdate.binary.data[0] != null
		&& priceUpdate.binary.data[0] !== '' ?
			with0xHex(priceUpdate.binary.data[0])
		:
			undefined
	)

	return {
		[EntityMetaKey.Selector]: {
			$feed: feed,
			publishTimeMs,
			source: Source.PythBenchmarks_Rest,
		},
		observedAtMs,
		price: BigInt(update.price.price),
		conf: BigInt(update.price.conf),
		expo: update.price.expo,
		emaPrice: BigInt(update.ema_price.price),
		emaConf: BigInt(update.ema_price.conf),
		...(update.metadata.slot != null && {
			slot: BigInt(update.metadata.slot),
		}),
		...(hexUpdate != null && {
			vaa: hexUpdate,
		}),
	}
}

const tipParsedUpdateFor = async (
	priceFeedId: `0x${string}`
) => {
	const { getBenchmarkPriceUpdateAt } = await import('$/sources/Pyth/Rest/queries.ts')
	const {
		priceUpdate,
		fetchedAtMs,
	} = await getBenchmarkPriceUpdateAt({
		timestampSec: Math.floor(Date.now() / 1000),
		ids: [priceFeedId.slice(2)],
		encoding: 'hex',
		parsed: true,
	})
	const needle = priceFeedId.slice(2).toLowerCase()
	const update = priceUpdate.parsed?.find((row) => (
		row.id.replace(/^0x/i, '').toLowerCase() === needle
	))
	if (update == null)
		throw new Error(`PythBenchmarks_Rest: no tip price update for ${priceFeedId}`)

	return {
		priceUpdate,
		update,
		fetchedAtMs,
	}
}

const historicalParsedUpdateFor = async (
	priceFeedId: `0x${string}`,
	publishTimeMs: number
) => {
	if (!Number.isSafeInteger(publishTimeMs) || publishTimeMs < 0 || publishTimeMs % 1000 !== 0)
		throw new Error(`PythBenchmarks_Rest: invalid publishTimeMs ${publishTimeMs}`)

	const { getBenchmarkPriceUpdateAt } = await import('$/sources/Pyth/Rest/queries.ts')
	const {
		priceUpdate,
		fetchedAtMs,
	} = await getBenchmarkPriceUpdateAt({
		timestampSec: publishTimeMs / 1000,
		ids: [priceFeedId.slice(2)],
		encoding: 'hex',
		parsed: true,
	})
	const needle = priceFeedId.slice(2).toLowerCase()
	const update = priceUpdate.parsed?.find((row) => (
		row.id.replace(/^0x/i, '').toLowerCase() === needle
	))
	if (update == null)
		throw new Error(`PythBenchmarks_Rest: no price update for ${priceFeedId} at ${publishTimeMs}`)
	if (update.price.publish_time * 1000 !== publishTimeMs)
		throw new Error('PythBenchmarks_Rest: observation publishTimeMs does not match Benchmarks clock')

	return {
		priceUpdate,
		update,
		fetchedAtMs,
	}
}

export default {
	source: Source.PythBenchmarks_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PythPriceFeed,
			resolve: {
				PriceFeedIdChannel: {
					resolve: async ({
						priceFeedId,
						channel,
					}) => {
						assertStableChannel(channel)
						const feedId = normalizePriceFeedId(priceFeedId)
						const { getBenchmarkPriceFeed } = await import('$/sources/Pyth/Rest/queries.ts')
						const feed = feedFromBenchmarks(
							await getBenchmarkPriceFeed(feedId.slice(2)),
							channel
						)
						if (feed.priceFeedId !== feedId)
							throw new Error('PythBenchmarks_Rest: price feed id mismatch')

						const {
							priceUpdate,
							update,
							fetchedAtMs,
						} = await tipParsedUpdateFor(feedId)

						return {
							...feed,
							$$timestamps: [
								observationFromParsedUpdate(
									{
										priceFeedId: feed.priceFeedId,
										channel: feed.channel,
									},
									update,
									priceUpdate,
									fetchedAtMs
								),
							],
						}
					},
				},
			},
		})({
			priceFeedId: (feed) => feed.priceFeedId,
			channel: (feed) => feed.channel,
			symbol: (feed) => feed.symbol,
			assetClass: (feed) => feed.assetClass,
			baseAsset: (feed) => feed.baseAsset,
			quoteAsset: (feed) => feed.quoteAsset,
			$$timestamps: (feed) => feed.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.PythPriceFeed_Timestamp,
			resolve: {
				FeedPublishTimeMsSource: {
					resolve: async ({
						$feed,
						publishTimeMs,
						source,
					}) => {
						if (source !== Source.PythBenchmarks_Rest)
							throw new Error(`PythBenchmarks_Rest: unsupported observation source ${source}`)
						assertStableChannel($feed.channel)
						const feedId = normalizePriceFeedId($feed.priceFeedId)
						const {
							priceUpdate,
							update,
							fetchedAtMs,
						} = await historicalParsedUpdateFor(feedId, publishTimeMs)

						const observation = observationFromParsedUpdate(
							{
								priceFeedId: feedId,
								channel: $feed.channel,
							},
							update,
							priceUpdate,
							fetchedAtMs
						)

						return {
							$feed: {
								priceFeedId: feedId,
								channel: $feed.channel,
							},
							publishTimeMs,
							source: Source.PythBenchmarks_Rest,
							observedAtMs: observation.observedAtMs,
							price: observation.price,
							conf: observation.conf,
							expo: observation.expo,
							emaPrice: observation.emaPrice,
							emaConf: observation.emaConf,
							...(observation.slot != null && { slot: observation.slot }),
							...(observation.vaa != null && { vaa: observation.vaa }),
						}
					},
				},
			},
		})({
			$feed: (observation) => ({
				[EntityMetaKey.Selector]: observation.$feed,
			}),
			publishTimeMs: (observation) => observation.publishTimeMs,
			source: (observation) => observation.source,
			observedAtMs: (observation) => observation.observedAtMs,
			price: (observation) => observation.price,
			conf: (observation) => observation.conf,
			expo: (observation) => observation.expo,
			emaPrice: (observation) => observation.emaPrice,
			emaConf: (observation) => observation.emaConf,
			slot: (observation) => observation.slot,
			vaa: (observation) => observation.vaa,
		}),
	],
} satisfies RegisteredSourceResolverModule
