import { singleFlight } from '$/lib/singleFlight.ts'
import { coingeckoRestFetch } from '$/sources/Coingecko/Rest/client.ts'
import type {
	CoingeckoAssetPlatform,
	CoingeckoCoin,
} from '$/sources/Coingecko/Rest/types.ts'

const coingeckoCoinMetadataQuery = (
	'localization=false'
	+ '&tickers=false'
	+ '&market_data=false'
	+ '&community_data=false'
	+ '&developer_data=false'
	+ '&sparkline=false'
)

export const getCoingeckoCoin = async (coingeckoId: string): Promise<CoingeckoCoin | undefined> => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoCoinMetadataQuery}`,
	)

	if (res.status === 404) return undefined
	if (!res.ok) throw new Error(`CoinGecko /coins/${coingeckoId} failed: ${res.status}`)

	return res.json() as Promise<CoingeckoCoin>
}

export const getCoingeckoCoinByAssetPlatformContract = async ({
	assetPlatformId,
	contractAddress,
}: {
	assetPlatformId: string
	contractAddress: `0x${string}`
}): Promise<CoingeckoCoin | undefined> => {
	if (assetPlatformId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
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

const fetchCoingeckoAssetPlatformsOnce = async (): Promise<CoingeckoAssetPlatform[]> => {
	const res = await coingeckoRestFetch('/asset_platforms')

	if (!res.ok) throw new Error(`CoinGecko /asset_platforms failed: ${res.status}`)

	return res.json() as Promise<CoingeckoAssetPlatform[]>
}

export const fetchCoingeckoAssetPlatforms = singleFlight(fetchCoingeckoAssetPlatformsOnce)

export const findCoingeckoAssetPlatformByChainId = async (
	chainId: number,
): Promise<CoingeckoAssetPlatform | undefined> => (
	(await fetchCoingeckoAssetPlatforms())
		.find((assetPlatform) => assetPlatform.chain_identifier === chainId)
)

export const getCoingeckoSimplePriceUsd = async ({
	coingeckoId,
}: {
	coingeckoId: string
}) => {
	if (coingeckoId.trim() === '') return undefined

	const res = await coingeckoRestFetch(
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
