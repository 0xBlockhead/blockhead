import { singleFlight } from '$/lib/singleFlight.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { coingeckoRestFetch } from '$/sources/Coingecko/Rest/client.ts'
import type {
	CoingeckoAssetPlatform,
	CoingeckoCoin,
	CoingeckoCoinWithMarketData,
} from '$/sources/Coingecko/Rest/types.ts'

const coingeckoCoinMetadataQuery = (
	'localization=false'
	+ '&tickers=false'
	+ '&market_data=false'
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
	if (!res.ok) throw new Error(`CoinGecko /coins/${coingeckoId} failed: ${res.status}`)

	return res.json() as Promise<CoingeckoCoin>
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
	lastUpdatedAtSec: number
} | undefined> => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoCoinMarketSpotQuery}`,
	)

	if (res.status === 404) return undefined
	if (!res.ok) throw new Error(`CoinGecko /coins/${coingeckoId} (market) failed: ${res.status}`)

	const coin = (await res.json()) as CoingeckoCoinWithMarketData
	const usd = coin.market_data?.current_price?.usd
	if (typeof usd !== 'number' || !Number.isFinite(usd)) {
		return undefined
	}
	const lastUpdatedAtSec = Date.parse(String(coin.market_data?.last_updated ?? '')) / 1000
	if (!Number.isFinite(lastUpdatedAtSec)) {
		return undefined
	}
	return { coin, usd, lastUpdatedAtSec }
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
	if (!res.ok) {
		throw new Error(
			`CoinGecko /coins/${assetPlatformId}/contract/${contractAddress} failed: ${res.status}`,
		)
	}

	return res.json() as Promise<CoingeckoCoin>
}

const fetchCoingeckoAssetPlatformsOnce = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
): Promise<CoingeckoAssetPlatform[]> => {
	const res = await coingeckoRestFetch(publicEnv, '/asset_platforms')

	if (!res.ok) throw new Error(`CoinGecko /asset_platforms failed: ${res.status}`)

	return res.json() as Promise<CoingeckoAssetPlatform[]>
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
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	chainId: number,
): Promise<CoingeckoAssetPlatform | undefined> => (
	(await fetchCoingeckoAssetPlatforms(publicEnv))
		.find((assetPlatform) => assetPlatform.chain_identifier === chainId)
)

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
	if (!res.ok) throw new Error(`CoinGecko /simple/price failed: ${res.status}`)

	const payload = await res.json() as Record<string, {
		usd?: number
		last_updated_at?: number
	}>

	return payload[coingeckoId]
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
	if (!res.ok) {
		throw new Error(
			`CoinGecko /coins/${coingeckoId}/ohlc failed: ${res.status}`,
		)
	}

	return res.json() as Promise<number[][]>
}
