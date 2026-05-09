/**
 * Chainlist HTTP: `GET /rpcs.json`.
 * @see https://chainlist.org/rpcs.json
 */

import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import { origin } from '$/sources/Chainlist/Rest/constants.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'

const fetchRpcsJsonOnce = async (): Promise<ChainlistRpcsJsonChain[]> => {
	const url = `${origin}/rpcs.json`
	return getJson<ChainlistRpcsJsonChain[]>(url, { origins: Chainlist.origins })
}

export const fetchRpcsJson = singleFlight(fetchRpcsJsonOnce)
