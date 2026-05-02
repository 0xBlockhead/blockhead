import {
	optionalPublicEnvString,
} from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	demoBaseUrl,
	proBaseUrl,
} from '$/sources/Coingecko/Rest/constants.ts'

export const coingeckoRestFetch = (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	path: string,
	init?: RequestInit,
): Promise<Response> => {
	const proApiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY')
	const demoApiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_DEMO_API_KEY')
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
		`${proApiKey != null ? proBaseUrl : demoBaseUrl}${path}`,
		{
			...init,
			headers,
		},
	)
}
