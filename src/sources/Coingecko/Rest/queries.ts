import { throwHttpError } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { coingeckoRestFetch } from '$/sources/Coingecko/Rest/client.ts'
import type {
	CoingeckoAssetPlatform,
	CoingeckoCoin,
	CoingeckoCoinWithMarketData,
} from '$/sources/Coingecko/Rest/types.ts'

/** Includes `market_data` so entity resolvers can attach rank / market cap without a second request. */
const coingeckoCoinMetadataQuery = (
	'localization=false'
	+ '&tickers=false'
	+ '&market_data=true'
	+ '&community_data=false'
	+ '&developer_data=false'
	+ '&sparkline=false'
)

const coingeckoCoinMarketSpotQuery = (
	'localization=false'
	+ '&tickers=false'
	+ '&market_data=true'
	+ '&community_data=false'
	+ '&developer_data=false'
	+ '&sparkline=false'
)

export const getCoingeckoCoin = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	coingeckoId: string,
): Promise<CoingeckoCoin | undefined> => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoCoinMetadataQuery}`,
	)

	if (res.status === 404) return undefined
	if (!res.ok) await throwHttpError(`CoinGecko /coins/${coingeckoId}`, res)

	return res.json<CoingeckoCoin>()
}

/**
 * Spot USD + as-of from `GET /coins/{id}` with `market_data` (replaces a separate `/simple/price` call
 * when platforms / CAIP-19 for the same coin are needed).
 * @see https://docs.coingecko.com/reference/coins-id
 */
export const getCoingeckoCoinMarketSpot = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	coingeckoId: string,
): Promise<{
	coin: CoingeckoCoinWithMarketData
	usd: number
	marketCapUsd?: number
	volume24hUsd?: number
	lastUpdatedAtSec: number
} | undefined> => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoCoinMarketSpotQuery}`,
	)

	if (res.status === 404) return undefined
	if (!res.ok) await throwHttpError(`CoinGecko /coins/${coingeckoId} (market)`, res)

	const coin = await res.json<CoingeckoCoinWithMarketData>()
	const usd = coin.market_data?.current_price?.usd
	if (typeof usd !== 'number' || !Number.isFinite(usd)) {
		return undefined
	}
	const marketCapUsd = coin.market_data?.market_cap?.usd
	const volume24hUsd = coin.market_data?.total_volume?.usd
	const lastUpdatedAtSec = Date.parse(String(coin.market_data?.last_updated ?? '')) / 1000
	if (!Number.isFinite(lastUpdatedAtSec)) {
		return undefined
	}
	return {
		coin,
		usd,
		...(typeof marketCapUsd === 'number' && Number.isFinite(marketCapUsd) && { marketCapUsd }),
		...(typeof volume24hUsd === 'number' && Number.isFinite(volume24hUsd) && { volume24hUsd }),
		lastUpdatedAtSec,
	}
}

export const getCoingeckoCoinByAssetPlatformContract = async ({
	publicEnv,
	assetPlatformId,
	contractAddress,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>
	assetPlatformId: string
	contractAddress: `0x${string}`
}): Promise<CoingeckoCoin | undefined> => {
	if (assetPlatformId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/${encodeURIComponent(assetPlatformId)}/contract/${contractAddress.toLowerCase()}?${coingeckoCoinMetadataQuery}`,
	)

	if (res.status === 404) return undefined
	if (!res.ok)
		await throwHttpError(
			`CoinGecko /coins/${assetPlatformId}/contract/${contractAddress}`,
			res,
		)

	return res.json<CoingeckoCoin>()
}

const fetchCoingeckoAssetPlatformsOnce = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
): Promise<CoingeckoAssetPlatform[]> => {
	const res = await coingeckoRestFetch(publicEnv, '/asset_platforms')

	if (!res.ok) await throwHttpError('CoinGecko /asset_platforms', res)

	return res.json<CoingeckoAssetPlatform[]>()
}

export const fetchCoingeckoAssetPlatforms = singleFlight(fetchCoingeckoAssetPlatformsOnce)

export const getCoingeckoCoinWithAssetPlatforms = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	coingeckoId: string,
): Promise<{
	coin: CoingeckoCoin | undefined
	assetPlatforms: CoingeckoAssetPlatform[]
}> => {
	const [coin, assetPlatforms] = await Promise.all([
		getCoingeckoCoin(publicEnv, coingeckoId),
		fetchCoingeckoAssetPlatforms(publicEnv),
	])
	return { coin, assetPlatforms }
}

export const findCoingeckoAssetPlatformByChainId = async (
	_publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	chainId: number,
): Promise<CoingeckoAssetPlatform | undefined> => {
	const { coingeckoAssetPlatformIdByChainId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const platformId = coingeckoAssetPlatformIdByChainId[chainId]
	if (platformId == null) {
		return undefined
	}
	return {
		id: platformId,
		name: platformId,
		chain_identifier: chainId,
	}
}

export const getCoingeckoSimplePriceUsd = async ({
	publicEnv,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>
	coingeckoId: string
}) => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		publicEnv,
		`/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd&include_last_updated_at=true`,
	)

	if (res.status === 404) return undefined
	if (!res.ok) await throwHttpError('CoinGecko /simple/price', res)

	type CoingeckoSimplePriceWire = Record<string, {
		usd?: number
		last_updated_at?: number
	}>
	const payload = await res.json<CoingeckoSimplePriceWire>()

	return payload[coingeckoId]
}

export type CoingeckoCoinsMarketRowWire = {
	id: string
	symbol: string
	name: string
	market_cap?: number | null
	market_cap_rank?: number | null
}

export const getCoingeckoCoinsMarketsPage = async ({
	publicEnv,
	vsCurrency,
	order,
	perPage,
	page,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>
	vsCurrency: string
	order: 'market_cap_desc'
	perPage: number
	page: number
}): Promise<CoingeckoCoinsMarketRowWire[]> => {
	const searchParams = new URLSearchParams()
	searchParams.set('vs_currency', vsCurrency)
	searchParams.set('order', order)
	searchParams.set('per_page', String(perPage))
	searchParams.set('page', String(page))
	searchParams.set('sparkline', 'false')

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/markets?${searchParams.toString()}`,
	)

	if (!res.ok) await throwHttpError('CoinGecko /coins/markets', res)

	return res.json<CoingeckoCoinsMarketRowWire[]>()
}

export const getCoingeckoCoinOhlc = async ({
	publicEnv,
	coingeckoId,
	vs,
	days,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>
	coingeckoId: string
	vs: string
	days: number
}): Promise<number[][]> => {
	if (coingeckoId.trim() === '') return []

	const searchParams = new URLSearchParams()
	searchParams.set('vs_currency', vs)
	searchParams.set('days', String(days))

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}/ohlc?${searchParams.toString()}`,
	)

	if (res.status === 404) return []
	if (!res.ok) await throwHttpError(`CoinGecko /coins/${coingeckoId}/ohlc`, res)

	return res.json<number[][]>()
}
