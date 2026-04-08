import { coinMarketCapApiBaseUrl } from '$/sources/CoinMarketCap/Rest/constants.ts'

const coinMarketCapApiKey = () => {
	const value = import.meta.env.PUBLIC_COINMARKETCAP_API_KEY

	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error('Missing or empty required env: PUBLIC_COINMARKETCAP_API_KEY. Set it in .env.')
	}

	return value.trim()
}

export const coinMarketCapFetch = async <_Response>(
	pathAndQuery: string,
): Promise<_Response> => {
	const response = await fetch(`${coinMarketCapApiBaseUrl}${pathAndQuery}`, {
		headers: {
			Accept: 'application/json',
			'X-CMC_PRO_API_KEY': coinMarketCapApiKey(),
		},
	})

	if (!response.ok) {
		throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`)
	}

	return response.json() as Promise<_Response>
}
