/**
 * Farcaster Client API GET helper.
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */

import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	clientBaseUrl,
	webBaseUrl,
} from '$/sources/Farcaster/Rest/constants.ts'

const farcasterRestBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Farcaster_Rest)

if (farcasterRestBinding == null)
	throw new Error('Farcaster_Rest: missing source binding')

const toQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}

export async function farcasterGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
	const baseUrl = path.startsWith('/~api/') ? webBaseUrl : clientBaseUrl
	const url = `${baseUrl}${path}${toQueryString(params)}`
	const response = await sourceFetch(farcasterRestBinding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
