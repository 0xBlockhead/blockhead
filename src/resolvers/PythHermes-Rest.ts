import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	PythParsedPriceUpdate,
	PythPriceUpdateResponse,
} from '$/sources/Pyth/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

/** Enrolled Hermes public channel (OpenAPI “Public endpoint”; beta is a separate binding). */
export const pythHermesStableChannel = 'Stable'

const normalizePriceFeedId = (id: string) => (
	with0xHex(id)
)

const assertStableChannel = (channel: string) => {
	if (channel !== pythHermesStableChannel)
		throw new Error(`PythHermes_Rest: unsupported channel ${channel}`)
}

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
			source: Source.PythHermes_Rest,
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

const latestParsedUpdateFor = async (
	priceFeedId: `0x${string}`
) => {
	const { getLatestPriceUpdates } = await import('$/sources/Pyth/Rest/queries.ts')
	const {
		priceUpdate,
		fetchedAtMs,
	} = await getLatestPriceUpdates({
		'ids[]': [priceFeedId.slice(2)],
		encoding: 'hex',
		parsed: true,
		ignore_invalid_price_ids: false,
	})
	const needle = priceFeedId.slice(2).toLowerCase()
	const update = priceUpdate.parsed?.find((row) => (
		row.id.replace(/^0x/i, '').toLowerCase() === needle
	))
	if (update == null)
		throw new Error(`PythHermes_Rest: no latest price update for ${priceFeedId}`)

	return {
		priceUpdate,
		update,
		fetchedAtMs,
	}
}

export default {
	source: Source.PythHermes_Rest,

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
						const {
							priceUpdate,
							update,
							fetchedAtMs,
						} = await latestParsedUpdateFor(feedId)

						return {
							priceFeedId: feedId,
							channel,
							$$timestamps: [
								observationFromParsedUpdate(
									{
										priceFeedId: feedId,
										channel,
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
						if (source !== Source.PythHermes_Rest)
							throw new Error(`PythHermes_Rest: unsupported observation source ${source}`)
						assertStableChannel($feed.channel)
						const feedId = normalizePriceFeedId($feed.priceFeedId)
						const {
							priceUpdate,
							update,
							fetchedAtMs,
						} = await latestParsedUpdateFor(feedId)
						if (update.price.publish_time * 1000 !== publishTimeMs)
							throw new Error('PythHermes_Rest: observation publishTimeMs does not match Hermes tip')

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
							source: Source.PythHermes_Rest,
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
