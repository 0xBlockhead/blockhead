import { fetchFailedMessage } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/X/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.X_Rest][0]

export const xApiV2Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`
) => {
	const url = `${firstHttpUrlForBinding(binding)}/2${path}`
	const response = await sourceFetch(
		binding,
		url,
		{
			headers: {
				Authorization: `Bearer ${requiredPublicEnvString(publicEnv, 'PUBLIC_X_API_BEARER')}`,
			},
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
