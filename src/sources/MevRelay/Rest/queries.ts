/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://flashbots.mintlify.app/flashbots-mev-boost/relay-specs/data-api
 */

import { getJson } from '$/lib/http.ts'
import { mevRelayHttpsOrigins } from '$/constants/MevRelayHosts.ts'

export type ProposerPayloadDeliveredRowWire = {
	slot?: string | number
	block_hash?: string
	blockHash?: string
	builder_pubkey?: string
	builderPubkey?: string
	proposer_fee_recipient?: string
	value?: string | number
	block_number?: string | number
	blockNumber?: string | number
}

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
