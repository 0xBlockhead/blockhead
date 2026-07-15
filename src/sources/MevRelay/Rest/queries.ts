/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://flashbots.mintlify.app/flashbots-mev-boost/relay-specs/data-api
 */

import { getJson } from '$/lib/http.ts'
import { mevRelayHosts } from '$/constants/MevRelayHosts.ts'

import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'

const mevRelayOrigins = mevRelayHosts.map((relay) => ({
	origin: `https://${relay.host}`,
	corsEnabled: false,
}))

export const getProposerPayloadDeliveredForRelayHost = async (
	relayHost: string,
	options: {
		limit: number
	}
): Promise<readonly ProposerPayloadDelivered[]> => {
	const base = `https://${relayHost.replace(/\/$/, '')}`
	const search = new URLSearchParams()
	search.set('limit', String(options.limit))
	const url = `${base}/relay/v1/data/bidtraces/proposer_payload_delivered?${search.toString()}`
	const proposerPayloads = await getJson<readonly ProposerPayloadDelivered[]>(url, { origins: mevRelayOrigins })
	if (!Array.isArray(proposerPayloads)) throw new Error('MevRelay_Rest: proposer_payload_delivered response is not an array')
	return proposerPayloads
}
