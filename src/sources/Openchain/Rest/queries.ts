import bindings from '$/sources/Openchain/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	type FourbyteSignaturesList,
	type OpenchainLookupResponse,
} from '$/sources/Openchain/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Openchain_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const openchainBinding = bindingByTargetKey['openchain-signatures']
const fourbyteBinding = bindingByTargetKey['fourbyte-directory']

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

const fourbyteHex4Query = (hex: `0x${string}`) => (
	normalizeHex4(hex).slice(2).toLowerCase()
)

const fourbyteHex32Query = (hex: `0x${string}`) => (
	normalizeHex32(hex).slice(2).toLowerCase()
)

export const getFourbyteFunctionEntries = async ({
	hex,
}: {
	hex: `0x${string}`
}) => {
	const searchParams = new URLSearchParams({ hex_signature: fourbyteHex4Query(hex) })
	const json = await sourceGetJson<FourbyteSignaturesList>(
		fourbyteBinding,
		`${firstHttpUrlForBinding(fourbyteBinding)}/signatures/?${searchParams}`
	)
	return json.results ?? []
}

export const getFourbyteEventEntries = async ({
	hex,
}: {
	hex: `0x${string}`
}) => {
	const searchParams = new URLSearchParams({ hex_signature: fourbyteHex32Query(hex) })
	const json = await sourceGetJson<FourbyteSignaturesList>(
		fourbyteBinding,
		`${firstHttpUrlForBinding(fourbyteBinding)}/event-signatures/?${searchParams}`
	)
	return json.results ?? []
}

const lookupPath = (params: {
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

const assertOpenchainOk = (json: OpenchainLookupResponse) => {
	if (json.ok === false) throw new Error('Openchain: lookup rejected')
}

/**
 * Function or custom-error selector (4-byte) → signature entries from Sourcify’s OpenChain-compatible API.
 */
export const getFunctionEntries = async ({
	hex,
	filter,
}: {
	hex: `0x${string}`
	filter?: boolean
}) => {
	const key = normalizeHex4(hex)
	const json = await sourceGetJson<OpenchainLookupResponse>(
		openchainBinding,
		`${firstHttpUrlForBinding(openchainBinding)}${lookupPath({ function: key, filter })}`
	)
	assertOpenchainOk(json)
	return json.result?.function?.[key] ?? []
}

/**
 * Event topic hash (32-byte) → signature entries from Sourcify’s OpenChain-compatible API.
 */
export const getEventEntries = async ({
	hex,
	filter,
}: {
	hex: `0x${string}`
	filter?: boolean
}) => {
	const key = normalizeHex32(hex)
	const json = await sourceGetJson<OpenchainLookupResponse>(
		openchainBinding,
		`${firstHttpUrlForBinding(openchainBinding)}${lookupPath({ event: key, filter })}`
	)
	assertOpenchainOk(json)
	return json.result?.event?.[key] ?? []
}
