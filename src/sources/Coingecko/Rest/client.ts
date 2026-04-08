import {
	coingeckoDemoBaseUrl,
	coingeckoProBaseUrl,
} from '$/sources/Coingecko/Rest/constants.ts'

const coingeckoDemoApiKey = () => {
	const value = import.meta.env.PUBLIC_COINGECKO_DEMO_API_KEY
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

const coingeckoProApiKey = () => {
	const value = import.meta.env.PUBLIC_COINGECKO_PRO_API_KEY
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

export const coingeckoRestFetch = (
	path: string,
	init?: RequestInit,
): Promise<Response> => {
	const proApiKey = coingeckoProApiKey()
	const demoApiKey = coingeckoDemoApiKey()
	const headers = new Headers({
		Accept: 'application/json',
	})

	if (proApiKey != null) headers.set('x-cg-pro-api-key', proApiKey)
	else if (demoApiKey != null) headers.set('x-cg-demo-api-key', demoApiKey)

	if (init?.headers != null) {
		new Headers(init.headers)
			.forEach((value, key) => headers.set(key, value))
	}

	return fetch(
		`${proApiKey != null ? coingeckoProBaseUrl : coingeckoDemoBaseUrl}${path}`,
		{
			...init,
			headers,
		},
	)
}
