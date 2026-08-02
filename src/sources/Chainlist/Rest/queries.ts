/**
 * Chainlist HTTP: `GET /rpcs.json`.
 * @see https://chainlist.org/rpcs.json
 */

import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/Chainlist/bindings.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Chainlist_Rest][0]

export const fetchRpcsJson = async () => {
	const url = new URL('/rpcs.json', firstHttpUrlForBinding(binding)).toString()
	const response = await sourceFetch(binding, url, {
		cache: 'no-store',
	})
	if (!response.ok) await throwHttpError('Chainlist rpcs.json', response)
	return response.json<ChainlistRpcsJsonChain[]>()
}
