/**
 * Chainlist HTTP: `GET /rpcs.json`.
 * @see https://chainlist.org/rpcs.json
 */

import { getJson } from '$/lib/http.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import { origin } from '$/sources/Chainlist/Rest/constants.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'

export const fetchRpcsJson = async (): Promise<ChainlistRpcsJsonChain[]> => {
	const url = `${origin}/rpcs.json`
	return getJson<ChainlistRpcsJsonChain[]>(url, { origins: Chainlist.origins })
}
