import bindings from '$/sources/FourByteDirectory/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { fourbyteSignaturesListWire } from '$/sources/FourByteDirectory/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.FourByteDirectory_Rest][0]

const normalizeHex = (
	hex: `0x${string}`,
	length: number
) => {
	const digits = (
		hex.toLowerCase().startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	return digits.padStart(length, '0').slice(-length)
}

const results = (json: unknown) => {
	try {
		return fourbyteSignaturesListWire.assert(json).results
	} catch {
		throw new Error('FourByteDirectory_Rest: invalid signatures list response envelope')
	}
}

export const getFunctionEntries = ({
	hex,
}: {
	hex: `0x${string}`
}) => {
	const searchParams = new URLSearchParams({ hex_signature: normalizeHex(hex, 8) })
	return sourceGetJson(binding, `${firstHttpUrlForBinding(binding)}/signatures/?${searchParams}`).then(results)
}

export const getEventEntries = ({
	hex,
}: {
	hex: `0x${string}`
}) => {
	const searchParams = new URLSearchParams({ hex_signature: normalizeHex(hex, 64) })
	return sourceGetJson(binding, `${firstHttpUrlForBinding(binding)}/event-signatures/?${searchParams}`).then(results)
}
