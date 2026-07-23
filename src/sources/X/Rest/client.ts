import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	xApiV2Base,
} from '$/sources/X/Rest/constants.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const xRestBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.X_Rest)

if (xRestBinding == null)
	throw new Error('X_Rest: missing source binding')

export const xApiV2Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`
): Promise<T> => {
	const url = `${xApiV2Base}${path}`
	const response = await sourceFetch(
		xRestBinding,
		url,
		{
			headers: {
				Authorization: `Bearer ${requiredPublicEnvString(publicEnv, 'PUBLIC_X_API_BEARER')}`,
			},
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json()
}
