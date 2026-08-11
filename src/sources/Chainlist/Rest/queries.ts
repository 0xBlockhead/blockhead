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
import { type } from 'arktype'

const binding = bindings[Source.Chainlist_Rest][0]

const chainlistRpcsJsonWire = type({
	name: 'string > 0',
	'chain?': 'string',
	'chainId': 'number.integer >= 0',
	'nativeCurrency': {
		name: 'string > 0',
		symbol: 'string > 0',
		decimals: 'number.integer >= 0',
	},
}).array()

export const fetchRpcsJson = async () => {
	const url = new URL('/rpcs.json', firstHttpUrlForBinding(binding)).toString()
	const response = await sourceFetch(binding, url, {
		cache: 'no-store',
	})
	if (!response.ok) await throwHttpError('Chainlist rpcs.json', response)
	const payload = await response.json<unknown>()
	try {
		chainlistRpcsJsonWire.assert(payload)
		return payload as ChainlistRpcsJsonChain[]
	} catch {
		throw new Error('Chainlist_Rest: invalid rpcs.json response envelope')
	}
}
