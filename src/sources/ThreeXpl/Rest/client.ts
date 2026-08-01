/**
 * 3xpl JSON API REST client.
 *
 * Sandbox requests are unauthenticated; production requests use `Xpl-Token`.
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ThreeXpl/bindings.ts'
import type {
	ThreeXplClientOptions,
	ThreeXplSearchParamScalar,
	ThreeXplSearchParamValue,
	ThreeXplServer,
} from '$/sources/ThreeXpl/Rest/types.ts'

const bindingByServer = Object.fromEntries(
	bindings[Source.ThreeXpl_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

export const threeXplUrl = ({
	pathSegments = [],
	searchParams,
	repeatedSearchParams,
	server = 'sandbox',
}: {
	pathSegments?: readonly string[]
	searchParams?: Record<string, ThreeXplSearchParamValue>
	repeatedSearchParams?: Record<string, readonly ThreeXplSearchParamScalar[] | undefined>
	server?: ThreeXplServer
}) => {
	const url = new URL(
		pathSegments
			.map((pathSegment) => encodeURIComponent(pathSegment))
			.join('/'),
		`${firstHttpUrlForBinding(bindingByServer[server])}/`
	)
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value == null) continue
		url.searchParams.set(key, String(value))
	}
	for (const [key, values] of Object.entries(repeatedSearchParams ?? {})) {
		for (const value of values) {
			url.searchParams.append(key, String(value))
		}
	}
	return url.toString()
}

export const threeXplGetJson = async <T>({
	pathSegments,
	searchParams,
	repeatedSearchParams,
	options,
}: {
	pathSegments?: readonly string[]
	searchParams?: Record<string, ThreeXplSearchParamValue>
	repeatedSearchParams?: Record<string, readonly ThreeXplSearchParamScalar[] | undefined>
	options?: ThreeXplClientOptions
}) => {
	const server = options?.server ?? 'sandbox'
	const response = await sourceFetch(
		bindingByServer[server],
		threeXplUrl({
			pathSegments,
			searchParams,
			repeatedSearchParams,
			server,
		}),
		(options?.token != null && options.token !== '' ?
			{
				headers: {
					'Xpl-Token': options.token,
				},
			}
		:
			undefined
		)
	)
	if (!response.ok)
		await throwHttpError('3xpl API', response)

	return response.json<T>()
}
