/**
 * Farcaster Client API GET helper.
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */

import { fetchFailedMessage } from '$/lib/http.ts'
import {
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Farcaster/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Farcaster_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

export async function farcasterGet<T>(
	targetKey: typeof bindings[Source.Farcaster_Rest][number]['target']['key'],
	path: string,
	params?: Record<string, string | number | boolean | undefined>
) {
	const binding = bindingByTargetKey[targetKey]
	const url = httpUrl(binding, path, params)
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
