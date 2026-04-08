import {
	coinpaprikaFreeApiBaseUrl,
	coinpaprikaProApiBaseUrl,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

const coinpaprikaApiKey = () => {
	const value = import.meta.env.PUBLIC_COINPAPRIKA_API_KEY
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

const coinpaprikaRequest = async <_Response>(
	pathAndQuery: string,
): Promise<_Response> => {
	const apiKey = coinpaprikaApiKey()
	const response = await fetch(
		`${apiKey == null ? coinpaprikaFreeApiBaseUrl : coinpaprikaProApiBaseUrl}${pathAndQuery}`,
		{
			headers: {
				Accept: 'application/json',
				...(apiKey == null ? {} : { Authorization: `Bearer ${apiKey}` }),
			},
		},
	)

	if (!response.ok) {
		throw new Error(`Coinpaprika API error: ${response.status} ${response.statusText}`)
	}

	return response.json() as Promise<_Response>
}

export type CoinpaprikaCoin = {
	id?: string
	name?: string
	symbol?: string
	logo?: string
}

export type CoinpaprikaTicker = {
	id?: string
	name?: string
	symbol?: string
	price_usd?: string
	last_updated?: string
}

export const getCoinpaprikaJson = coinpaprikaRequest
