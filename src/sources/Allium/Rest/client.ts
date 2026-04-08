import { alliumApiBaseUrl } from '$/sources/Allium/Rest/constants.ts'

const alliumApiKey = () => {
	const value = import.meta.env.PUBLIC_ALLIUM_API_KEY

	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error('Missing or empty required env: PUBLIC_ALLIUM_API_KEY. Set it in .env.')
	}

	return value.trim()
}

export const alliumFetch = async <_Response>(
	pathAndQuery: string,
	init?: RequestInit,
): Promise<_Response> => {
	const response = await fetch(`${alliumApiBaseUrl}${pathAndQuery}`, {
		...init,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': alliumApiKey(),
			...init?.headers,
		},
	})

	if (!response.ok) {
		throw new Error(`Allium API error: ${response.status} ${response.statusText}`)
	}

	return response.json() as Promise<_Response>
}
