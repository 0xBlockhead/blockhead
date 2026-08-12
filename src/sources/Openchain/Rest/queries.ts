import bindings from '$/sources/Openchain/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	openchainLookupResponseWire,
	openchainSignatureEntriesWire,
	type OpenchainSignatureEntry,
} from '$/sources/Openchain/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Openchain_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const openchainBinding = bindingByTargetKey['openchain-signatures']

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`Openchain_Rest: invalid ${label} response envelope`)
	}
}

const normalizeHex4 = (hex: `0x${string}`): `0x${string}` => {
	const digits = (
		hex.toLowerCase().startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	return `0x${digits.padStart(8, '0').slice(-8)}`
}

const normalizeHex32 = (hex: `0x${string}`): `0x${string}` => {
	const digits = (
		hex.toLowerCase().startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	return `0x${digits.padStart(64, '0').slice(-64)}`
}

export const lookupPath = (params: {
	function?: string
	event?: string
	filter?: boolean
}) => {
	const searchParams = new URLSearchParams()
	if (params.function != null) searchParams.set('function', params.function)
	if (params.event != null) searchParams.set('event', params.event)
	if (params.filter !== undefined) searchParams.set('filter', String(params.filter))
	return `/lookup?${searchParams}`
}

const openchainEntriesForKey = (
	entries: unknown
): OpenchainSignatureEntry[] => {
	if (entries == null)
		return []

	return assertEnvelope(
		'signature entries',
		openchainSignatureEntriesWire,
		entries
	)
}

export const summarizeOpenchainEntries = (
	entries: OpenchainSignatureEntry[]
) => {
	const unfiltered = entries.filter((entry) => entry.filtered !== true)
	return {
		signatures: (
			unfiltered.length > 0 ?
				unfiltered
			:
				entries
		)
			.map((entry) => entry.name),
		filteredSignatureCount: entries.filter((entry) => entry.filtered === true).length,
		verifiedCandidateCount: entries.filter((entry) => entry.hasVerifiedContract === true).length,
	}
}

/**
 * Function or custom-error selector (4-byte) → signature entries (filter=false for full spam/verified metadata).
 */
export const getFunctionEntries = async ({
	hex,
	filter = false,
}: {
	hex: `0x${string}`
	filter?: boolean
}) => {
	const key = normalizeHex4(hex)
	const json = assertEnvelope(
		'lookup',
		openchainLookupResponseWire,
		await sourceGetJson(
			openchainBinding,
			`${firstHttpUrlForBinding(openchainBinding)}${lookupPath({ function: key, filter })}`
		)
	)
	if (json.ok !== true)
		throw new Error('Openchain_Rest: lookup rejected')

	return openchainEntriesForKey(json.result?.function?.[key])
}

/**
 * Event topic hash (32-byte) → signature entries (filter=false for full spam/verified metadata).
 */
export const getEventEntries = async ({
	hex,
	filter = false,
}: {
	hex: `0x${string}`
	filter?: boolean
}) => {
	const key = normalizeHex32(hex)
	const json = assertEnvelope(
		'lookup',
		openchainLookupResponseWire,
		await sourceGetJson(
			openchainBinding,
			`${firstHttpUrlForBinding(openchainBinding)}${lookupPath({ event: key, filter })}`
		)
	)
	if (json.ok !== true)
		throw new Error('Openchain_Rest: lookup rejected')

	return openchainEntriesForKey(json.result?.event?.[key])
}
