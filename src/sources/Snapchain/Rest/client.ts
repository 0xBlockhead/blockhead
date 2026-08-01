/**
 * Snapchain node client over public `/v1/*` endpoints.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 */

import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Snapchain/bindings.ts'

const snapchainBinding = bindings[Source.Snapchain_Rest]

const toQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}

	const queryString = searchParams.toString()
	return queryString ? `?${queryString}` : ''
}

export function snapchainGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>
) {
	return sourceGetJson<T>(
		snapchainBinding,
		`${firstHttpUrlForBinding(snapchainBinding)}${path}${toQueryString(params)}`
	)
}
