import { throwHttpError } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Coinpaprika/bindings.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Coinpaprika_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

export const getCoinpaprikaJson = async <_Response>(
	publicEnv: SourcePublicEnv,
	pathAndQuery: string
) => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY')
	const binding = bindingByTargetKey[apiKey == null ? 'free-api' : 'pro-api']
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding)}${pathAndQuery}`,
		{
			headers: {
				Accept: 'application/json',
				...(apiKey != null && { Authorization: `Bearer ${apiKey}` }),
			},
		}
	)

	if (!response.ok) await throwHttpError('Coinpaprika API', response)

	return response.json<_Response>()
}
