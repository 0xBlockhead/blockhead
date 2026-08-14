/**
 * MEV-Boost relay data API — public `bidtraces` HTTP GET.
 * @see https://github.com/flashbots/relay-specs
 */

import {
	bidTraceListWire,
	type BidTrace,
} from '$/sources/MevRelay/Rest/types.ts'
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

const assertBidTraceQuery = (
	options: MevRelayBidTraceQuery
) => {
	if (options.limit != null && (!Number.isSafeInteger(options.limit) || options.limit < 1))
		throw new Error(`MevRelay_Rest: invalid BidTrace limit ${options.limit}`)
	for (const [label, value] of [
		['slot', options.slot],
		['block number', options.block_number],
	])
		if (
			value != null
			&& (
				typeof value === 'number' && !Number.isSafeInteger(value)
				|| !/^(0|[1-9][0-9]*)$/.test(String(value))
			)
		)
			throw new Error(`MevRelay_Rest: invalid BidTrace ${label} ${String(value)}`)
	if (options.block_hash != null && !/^0x[0-9a-fA-F]{64}$/.test(options.block_hash))
		throw new Error(`MevRelay_Rest: invalid BidTrace block hash ${options.block_hash}`)
	if (options.builder_pubkey != null && !/^0x[0-9a-fA-F]{96}$/.test(options.builder_pubkey))
		throw new Error(`MevRelay_Rest: invalid BidTrace builder public key ${options.builder_pubkey}`)
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

const assertBidTracesForQuery = (
	path: string,
	options: MevRelayBidTraceQuery,
	response: unknown
): readonly BidTrace[] => {
	let bidTraces: readonly BidTrace[]
	try {
		bidTraces = bidTraceListWire.assert(response)
	} catch {
		throw new Error(`MevRelay_Rest: invalid ${path} BidTrace response envelope`)
	}

	const seenIdentities = new Set<string>()
	for (const bidTrace of bidTraces) {
		if (options.slot != null && String(options.slot) !== bidTrace.slot)
			throw new Error(`MevRelay_Rest: ${path} BidTrace slot does not match query`)
		if (
			options.block_hash != null
			&& bidTrace.block_hash.toLowerCase() !== options.block_hash.toLowerCase()
		)
			throw new Error(`MevRelay_Rest: ${path} BidTrace block_hash does not match query`)
		if (
			options.block_number != null
			&& String(options.block_number) !== bidTrace.block_number
		)
			throw new Error(`MevRelay_Rest: ${path} BidTrace block_number does not match query`)
		if (
			options.builder_pubkey != null
			&& bidTrace.builder_pubkey.toLowerCase() !== options.builder_pubkey.toLowerCase()
		)
			throw new Error(`MevRelay_Rest: ${path} BidTrace builder_pubkey does not match query`)

		const identity = (
			path === 'proposer_payload_delivered' ?
				`${bidTrace.slot}/${bidTrace.block_hash.toLowerCase()}`
			:
				`${bidTrace.slot}/${bidTrace.block_hash.toLowerCase()}/${bidTrace.builder_pubkey.toLowerCase()}`
		)
		if (seenIdentities.has(identity))
			throw new Error(`MevRelay_Rest: ${path} BidTrace list contains selector collisions`)
		seenIdentities.add(identity)
	}

	return bidTraces
}

const getBidTracesForRelayHost = async (
	path: 'proposer_payload_delivered' | 'builder_blocks_received',
	relayHost: string,
	options: MevRelayBidTraceQuery
) => {
	assertBidTraceQuery(options)
	const binding = mevRelayBindingByHost.get(relayHost)
	if (binding == null)
		throw new Error(`MevRelay_Rest: no canonical relay binding for ${relayHost}`)

	const search = bidTraceSearchParams(options)
	return assertBidTracesForQuery(
		path,
		options,
		await sourceGetJson(
			binding,
			new URL(
				`/relay/v1/data/bidtraces/${path}?${search.toString()}`,
				firstHttpUrlForBinding(binding)
			).toString()
		)
	)
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
