/**
 * Snapchain node client over public `/v1/*` endpoints.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 */

import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Snapchain/bindings.ts'

const snapchainBinding = bindings[Source.Snapchain_Rest][0]

export function snapchainGet<T>(
	path: string,
	params?: Record<string, string | number | boolean | undefined>
) {
	return sourceGetJson<T>(
		snapchainBinding,
		httpUrl(snapchainBinding, path, params)
	)
}
