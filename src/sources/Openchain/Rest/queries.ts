import { getJson } from '$/lib/fetch.ts'
import { openchainGetJson } from '$/sources/Openchain/Rest/client.ts'
import { fourbyteDirectoryApiV1BaseUrl } from '$/sources/Openchain/Rest/constants.ts'
import {
	type OpenchainLookupResponseWire,
	type OpenchainSignatureEntryWire,
	looksLikeSolidityErrorName,
} from '$/sources/Openchain/Rest/types.ts'

const normalizeHex4 = (hex: `0x${string}`) => {
	const h = hex.toLowerCase().startsWith('0x') ? hex.slice(2).toLowerCase() : hex.toLowerCase()
	return `0x${h.padStart(8, '0').slice(-8)}` as `0x${string}`
}

const normalizeHex32 = (hex: `0x${string}`) => {
	const h = hex.toLowerCase().startsWith('0x') ? hex.slice(2).toLowerCase() : hex.toLowerCase()
	return `0x${h.padStart(64, '0').slice(-64)}` as `0x${string}`
}

const fourbyteHex4Query = (hex: `0x${string}`) => (
	normalizeHex4(hex).slice(2).toLowerCase()
)

const fourbyteHex32Query = (hex: `0x${string}`) => (
	normalizeHex32(hex).slice(2).toLowerCase()
)

type FourbyteSignaturesListWire = {
	results?: { text_signature: string }[]
}

const fourbyteFunctionEntries = async (hex: `0x${string}`): Promise<OpenchainSignatureEntryWire[]> => {
	const qs = new URLSearchParams({ hex_signature: fourbyteHex4Query(hex) })
	const json = await getJson<FourbyteSignaturesListWire>(
		`${fourbyteDirectoryApiV1BaseUrl}/signatures/?${qs}`,
	)
	return (json.results ?? []).map((r) => ({ name: r.text_signature }))
}

const fourbyteEventEntries = async (hex: `0x${string}`): Promise<OpenchainSignatureEntryWire[]> => {
	const qs = new URLSearchParams({ hex_signature: fourbyteHex32Query(hex) })
	const json = await getJson<FourbyteSignaturesListWire>(
		`${fourbyteDirectoryApiV1BaseUrl}/event-signatures/?${qs}`,
	)
	return (json.results ?? []).map((r) => ({ name: r.text_signature }))
}

const lookupPath = (params: {
	function?: string
	event?: string
	filter?: boolean
}) => {
	const q = new URLSearchParams()
	if (params.function != null) q.set('function', params.function)
	if (params.event != null) q.set('event', params.event)
	if (params.filter !== undefined) q.set('filter', String(params.filter))
	return `/lookup?${q}`
}

const assertOpenchainOk = (json: OpenchainLookupResponseWire) => {
	if (json.ok === false) throw new Error('Openchain: lookup rejected')
}

/**
 * Function or custom-error selector (4-byte) → signature entries from Sourcify’s OpenChain-compatible API,
 * then 4byte.directory when Sourcify has no rows (first page only).
 */
export const getOpenchainFunctionEntries = async ({
	hex,
	filter,
}: {
	hex: `0x${string}`
	filter?: boolean
}): Promise<OpenchainSignatureEntryWire[]> => {
	const key = normalizeHex4(hex)
	const json = (await openchainGetJson({
		path: lookupPath({ function: key, filter }),
	})) as OpenchainLookupResponseWire
	assertOpenchainOk(json)
	const arr = json.result?.function?.[key] ?? []
	return arr.length > 0 ? arr : fourbyteFunctionEntries(hex)
}

/**
 * Event topic hash (32-byte) → signature entries, with 4byte.directory fallback (first page only).
 */
export const getOpenchainEventEntries = async ({
	hex,
	filter,
}: {
	hex: `0x${string}`
	filter?: boolean
}): Promise<OpenchainSignatureEntryWire[]> => {
	const key = normalizeHex32(hex)
	const json = (await openchainGetJson({
		path: lookupPath({ event: key, filter }),
	})) as OpenchainLookupResponseWire
	assertOpenchainOk(json)
	const arr = json.result?.event?.[key] ?? []
	return arr.length > 0 ? arr : fourbyteEventEntries(hex)
}

/**
 * Same lookup as {@link getOpenchainFunctionEntries}; keeps names that look like Solidity custom errors.
 */
export const getOpenchainErrorEntries = async ({
	hex,
	filter,
}: {
	hex: `0x${string}`
	filter?: boolean
}): Promise<OpenchainSignatureEntryWire[]> => {
	const all = await getOpenchainFunctionEntries({ hex, filter })
	return all.filter((e) => looksLikeSolidityErrorName(e.name))
}
