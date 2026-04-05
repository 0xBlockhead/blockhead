import { openchainGetJson } from '$/sources/Openchain/Rest/client.ts'
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

const lookupPath = (params: { function?: string; event?: string }) => {
	const q = new URLSearchParams()
	if (params.function != null) q.set('function', params.function)
	if (params.event != null) q.set('event', params.event)
	return `/lookup?${q}`
}

const assertOpenchainOk = (json: OpenchainLookupResponseWire) => {
	if (json.ok === false) throw new Error('Openchain: lookup rejected')
}

/**
 * Function or custom-error selector (4-byte) → signature entries from Sourcify’s OpenChain-compatible API.
 */
export const getOpenchainFunctionEntries = async ({
	hex,
}: {
	hex: `0x${string}`
}): Promise<OpenchainSignatureEntryWire[]> => {
	const key = normalizeHex4(hex)
	const json = (await openchainGetJson({
		path: lookupPath({ function: key }),
	})) as OpenchainLookupResponseWire
	assertOpenchainOk(json)
	const arr = json.result?.function?.[key]
	return arr ?? []
}

/**
 * Event topic hash (32-byte) → signature entries.
 */
export const getOpenchainEventEntries = async ({
	hex,
}: {
	hex: `0x${string}`
}): Promise<OpenchainSignatureEntryWire[]> => {
	const key = normalizeHex32(hex)
	const json = (await openchainGetJson({
		path: lookupPath({ event: key }),
	})) as OpenchainLookupResponseWire
	assertOpenchainOk(json)
	const arr = json.result?.event?.[key]
	return arr ?? []
}

/**
 * Same lookup as {@link getOpenchainFunctionEntries}; keeps names that look like Solidity custom errors.
 */
export const getOpenchainErrorEntries = async ({
	hex,
}: {
	hex: `0x${string}`
}): Promise<OpenchainSignatureEntryWire[]> => {
	const all = await getOpenchainFunctionEntries({ hex })
	return all.filter((e) => looksLikeSolidityErrorName(e.name))
}
