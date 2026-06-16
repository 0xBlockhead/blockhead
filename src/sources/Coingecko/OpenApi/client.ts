import {
	optionalPublicEnvString,
} from '$/sources/$sources.ts'
import { corsFetch } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import Coingecko from '$/sources/Coingecko/index.ts'
import {
	demoBaseUrl,
	proBaseUrl,
} from '$/sources/Coingecko/Rest/constants.ts'

export const coingeckoOpenApiFetch = (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>,
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
			origins: Coingecko.origins,
			init: {
				...init,
				headers,
			},
		}
	)
}
