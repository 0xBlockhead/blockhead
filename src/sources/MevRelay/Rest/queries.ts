/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://flashbots.mintlify.app/flashbots-mev-boost/relay-specs/data-api
 */

import type { ProposerPayloadDelivered } from '$/sources/MevRelay/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MevRelay/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const mevRelayBindingByHost = new Map(
	bindings[Source.MevRelay_Rest].map((binding) => [
		binding.target.key,
		binding,
	])
)

export const getProposerPayloadDeliveredForRelayHost = async (
	relayHost: string,
	options: {
		limit: number
	}
): Promise<readonly ProposerPayloadDelivered[]> => {
	const binding = mevRelayBindingByHost.get(relayHost)
	if (binding == null)
		throw new Error(`MevRelay_Rest: no canonical relay binding for ${relayHost}`)

	const search = new URLSearchParams()
	search.set('limit', String(options.limit))
	const proposerPayloads = await sourceGetJson<readonly ProposerPayloadDelivered[]>(
		binding,
		new URL(
			`/relay/v1/data/bidtraces/proposer_payload_delivered?${search.toString()}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
	if (!Array.isArray(proposerPayloads)) throw new Error('MevRelay_Rest: proposer_payload_delivered response is not an array')
	return proposerPayloads
}
