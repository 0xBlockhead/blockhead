/**
 * 3xpl JSON API REST client.
 *
 * Sandbox requests are unauthenticated; production requests use `Xpl-Token`.
 *
 * @see https://3xpl.com/data/json-api/docs
 * @see https://3xpl.com/specifications/api.3xpl.com-openapi.json
 */

import { getJson } from '$/lib/http.ts'
import ThreeXpl from '$/sources/ThreeXpl/index.ts'
import {
	productionBaseUrl,
	sandboxBaseUrl,
} from '$/sources/ThreeXpl/Rest/constants.ts'
import type {
	ThreeXplClientOptions,
	ThreeXplSearchParamScalar,
	ThreeXplSearchParamValue,
	ThreeXplServer,
} from '$/sources/ThreeXpl/Rest/types.ts'

const baseUrlByServer = {
	sandbox: sandboxBaseUrl,
	production: productionBaseUrl,
} as const satisfies Record<ThreeXplServer, string>

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
}): string => {
	const url = new URL(
		pathSegments
			.map((pathSegment) => encodeURIComponent(pathSegment))
			.join('/'),
		baseUrlByServer[server],
	)
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value == null) continue
		url.searchParams.set(key, String(value))
	}
	for (const [key, values] of Object.entries(repeatedSearchParams ?? {})) {
		for (const value of values ?? []) {
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
}): Promise<T> => (
	getJson<T>(
		threeXplUrl({
			pathSegments,
			searchParams,
			repeatedSearchParams,
			server: options?.server,
		}),
		{
			origins: ThreeXpl.origins ?? [],
			...(options?.token != null && options.token !== '' && {
				init: {
					headers: {
						'Xpl-Token': options.token,
					},
				},
			}),
		},
	)
)
