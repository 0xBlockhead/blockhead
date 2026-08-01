/**
 * Farcaster Client API GET helper.
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */

import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Farcaster/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Farcaster_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

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
) {
	const binding = (
		path.startsWith('/~api/') ?
			bindingByTargetKey['web-api']
		:
			bindingByTargetKey['client-api']
	)
	const url = `${firstHttpUrlForBinding(binding)}${path}${toQueryString(params)}`
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
