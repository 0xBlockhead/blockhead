/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://flashbots.mintlify.app/flashbots-mev-boost/relay-specs/data-api
 */

import { getJson } from '$/lib/http.ts'
import MevRelay from '$/sources/MevRelay/index.ts'

import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'

export const getProposerPayloadDeliveredForRelayHost = async (
	relayHost: string,
	options: {
		limit: number
	},
): Promise<readonly ProposerPayloadDelivered[]> => {
	const base = `https://${relayHost.replace(/\/$/, '')}`
	const search = new URLSearchParams()
	search.set('limit', String(options.limit))
	const url = `${base}/relay/v1/data/bidtraces/proposer_payload_delivered?${search.toString()}`
	const wire = await getJson<readonly ProposerPayloadDelivered[]>(url, { origins: MevRelay.origins ?? [] })
	if (!Array.isArray(wire)) throw new Error('MevRelay_Rest: proposer_payload_delivered response is not an array')
	return wire
}
