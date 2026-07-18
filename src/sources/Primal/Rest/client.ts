import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import {
	primalApiBaseUrl,
} from '$/sources/Primal/Rest/constants.ts'
import type { PrimalPostBody } from '$/sources/Primal/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const primalBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find(({ source }) => source === Source.Primal_Rest)

if (primalBinding == null)
	throw new Error('Primal_Rest: source binding is missing')

const primalUrl = (path: string) => (
	`${primalApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
)

export const primalGet = async <T>(path: string) => (
	sourceGetJson<T>(primalBinding, primalUrl(path))
)

export const primalPost = async <T>(path: string, body: PrimalPostBody) => {
	const url = primalUrl(path)
	const response = await sourceFetch(
		primalBinding,
		url,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
