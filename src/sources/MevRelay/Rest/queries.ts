/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://flashbots.mintlify.app/flashbots-mev-boost/relay-specs/data-api
 */

import { mevRelayHttpsOrigins } from '$/constants/MevRelayHosts.ts'
import { getJson } from '$/lib/http.ts'

import type { ProposerPayloadDeliveredRowWire } from '$/sources/MevRelay/Rest/types.ts'

export const getProposerPayloadDeliveredForRelayHost = async (
	relayHost: string,
	options: {
		limit: number
	},
): Promise<readonly ProposerPayloadDeliveredRowWire[]> => {
	const base = `https://${relayHost.replace(/\/$/, '')}`
	const search = new URLSearchParams()
	search.set('limit', String(options.limit))
	const url = `${base}/relay/v1/data/bidtraces/proposer_payload_delivered?${search.toString()}`
	const wire = await getJson<readonly ProposerPayloadDeliveredRowWire[]>(url, { origins: mevRelayHttpsOrigins })
	if (!Array.isArray(wire)) throw new Error('MevRelay_Rest: proposer_payload_delivered response is not an array')
	return wire
}
