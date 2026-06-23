import {
	optionalPublicEnvString,
} from '$/sources/$sources.ts'
import { corsFetch } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { coingeckoOrigins } from '$/sources/Coingecko/index.ts'
import {
	demoBaseUrl,
	proBaseUrl,
} from '$/sources/Coingecko/Rest/constants.ts'

export const coingeckoOpenApiFetch = (
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
): Promise<Response> => {
	const proApiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY')
	const demoApiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_DEMO_API_KEY')
	const headers = new Headers({
		Accept: 'application/json',
	})

	if (proApiKey != null) headers.set('x-cg-pro-api-key', proApiKey)
		else if (demoApiKey != null) headers.set('x-cg-demo-api-key', demoApiKey)

	if (init?.headers != null)
		new Headers(init.headers)
			.forEach((value, key) => headers.set(key, value))

	return corsFetch(
		`${proApiKey != null ? proBaseUrl : demoBaseUrl}${path}`,
		{
			origins: coingeckoOrigins,
			init: {
				...init,
				headers,
			},
		}
	)
}
