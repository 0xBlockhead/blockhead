/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://github.com/flashbots/relay-specs
 */

import type { BidTrace } from '$/sources/MevRelay/Rest/types.ts'
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

export type MevRelayBidTraceQuery = {
	limit?: number
	slot?: number | string
	block_hash?: string
	block_number?: number | string
	builder_pubkey?: string
}

const bidTraceSearchParams = (
	options: MevRelayBidTraceQuery
) => {
	const search = new URLSearchParams()
	if (options.limit != null)
		search.set('limit', String(options.limit))
	if (options.slot != null)
		search.set('slot', String(options.slot))
	if (options.block_hash != null)
		search.set('block_hash', options.block_hash)
	if (options.block_number != null)
		search.set('block_number', String(options.block_number))
	if (options.builder_pubkey != null)
		search.set('builder_pubkey', options.builder_pubkey)
	return search
}

const getBidTracesForRelayHost = async (
	path: 'proposer_payload_delivered' | 'builder_blocks_received',
	relayHost: string,
	options: MevRelayBidTraceQuery
) => {
	const binding = mevRelayBindingByHost.get(relayHost)
	if (binding == null)
		throw new Error(`MevRelay_Rest: no canonical relay binding for ${relayHost}`)

	const search = bidTraceSearchParams(options)
	const bidTraces = await sourceGetJson<readonly BidTrace[]>(
		binding,
		new URL(
			`/relay/v1/data/bidtraces/${path}?${search.toString()}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
	if (!Array.isArray(bidTraces))
		throw new Error(`MevRelay_Rest: ${path} response is not an array`)

	return bidTraces
}

export const getProposerPayloadDeliveredForRelayHost = (
	relayHost: string,
	options: MevRelayBidTraceQuery = {}
) => (
	getBidTracesForRelayHost('proposer_payload_delivered', relayHost, options)
)

export const getBuilderBlocksReceivedForRelayHost = (
	relayHost: string,
	options: MevRelayBidTraceQuery
) => {
	if (
		options.slot == null
		&& options.block_hash == null
		&& options.block_number == null
		&& options.builder_pubkey == null
	)
		throw new Error('MevRelay_Rest: builder_blocks_received requires slot, block_hash, block_number, or builder_pubkey')

	return getBidTracesForRelayHost('builder_blocks_received', relayHost, options)
}
