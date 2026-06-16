/**
	* Decode function calldata using a human-readable signature (e.g. from 4byte/OpenChain).
	* Parses signature to ABI input types and uses Voltaire decodeParameters.
	*/

import { Parameter, decodeParameters } from '@tevm/voltaire/Abi'
import { keccak256String, toHex } from '@tevm/voltaire/Hash'
import { fromBytes, toBytes } from '@tevm/voltaire/Hex'

import type { DecodedAbiValue, DecodedCalldata, DecodedParam } from '$/typescript/DecodedCalldata.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import type { EvmAbiEntry } from '$/schema/EvmAbi.ts'

type AbiDecodeParameters = Parameters<typeof decodeParameters>[0]

const abiDecodeParametersFromTypes = (types: readonly string[]): AbiDecodeParameters => (
	types.map((type, i) => Parameter.from({
		type,
		name: `param${i}`,
	}))
)

/** Compute 4-byte function selector from full signature string (e.g. "transfer(address,uint256)"). */
export const functionSelectorFromSignature = (signature: string): `0x${string}` | null => {
	const parsed = parseFunctionSignature(signature.trim())
	if (!parsed) return null
	const sig = `${parsed.name}(${parsed.types.join(',')})`
	const hash = keccak256String(sig)
	return `0x${toHex(hash).slice(2, 10)}`
}

/** Compute 32-byte event topic (topic0) from event signature (e.g. "Transfer(address,address,uint256)"). */
export const eventTopicFromSignature = (signature: string): `0x${string}` | null => {
	const parsed = parseFunctionSignature(signature.trim())
	if (!parsed) return null
	const sig = `${parsed.name}(${parsed.types.map((type) => (
		type.trim().endsWith(' indexed') ?
			type.trim().slice(0, -8).trim()
		:
			type.trim().startsWith('indexed ') ?
				type.trim().slice(8).trim()
			:
				type
	)).join(',')})`
	const hash = keccak256String(sig)
	return `0x${toHex(hash).slice(2).toLowerCase()}`
}

/** Event signature parse: types with optional "indexed" (e.g. "Transfer(address indexed, address indexed, uint256)"). */
export const parseEventSignature = (
	sig: string
): {
	name: string
	indexedTypes: string[]
	nonIndexedTypes: string[]
} | null => {
	const base = parseFunctionSignature(sig.trim())
	if (!base) return null
	const indexedTypes: string[] = []
	const nonIndexedTypes: string[] = []
	for (const t of base.types) {
		const trimmed = t.trim()
		if (trimmed.endsWith(' indexed'))
			indexedTypes.push(trimmed.slice(0, -8).trim())
		else if (trimmed.startsWith('indexed '))
			indexedTypes.push(trimmed.slice(8).trim())
		else
			nonIndexedTypes.push(trimmed)
	}
	return {
		name: base.name,
		indexedTypes,
		nonIndexedTypes,
	}
}

/** Parse "name(type1,type2,...)" into [name, [type1, type2, ...]]. Handles nested tuples. */
export const parseFunctionSignature = (sig: string): {
	name: string
	types: string[]
} | null => {
	const match = /^(\w+)\s*\((.*)\)\s*$/.exec(sig.trim())
	if (!match) return null
	const [, name, paramsBody] = match
	if (paramsBody.trim() === '') return {
		name,
		types: [],
	}
	const types: string[] = []
	let depth = 0
	let start = 0
	for (let i = 0; i < paramsBody.length; i++) {
		const c = paramsBody[i]
		if (c === '(') depth++
		else if (c === ')') depth--
		else if (c === ',' && depth === 0) {
			types.push(paramsBody.slice(start, i).trim())
			start = i + 1
		}
	}
	types.push(paramsBody.slice(start).trim())
	return {
		name,
		types,
	}
}

/**
	* Decode event log (topic0 [+ topic1...] + data) using an event signature.
	* topicAndDataHex must be at least 64 chars (32-byte topic0). Data starts after topic0 plus
	* 32 bytes per indexed param (topic1, topic2, ...). Topic0 must match eventTopicFromSignature(signature).
	* Returns params in signature order: indexed first (from topics), then non-indexed (from data).
	*/
export const decodeEventDataWithSignature = (
	signature: string,
	topicAndDataHex: string
): DecodedCalldata | null => {
	const parsed = parseEventSignature(signature)
	if (!parsed) return null
	const raw = (
		topicAndDataHex.startsWith('0x') ?
			topicAndDataHex.slice(2)
		:
			topicAndDataHex
	)
	const dataStart = 64 + parsed.indexedTypes.length * 64
	const minDataLen = parsed.nonIndexedTypes.length * 64
	if (raw.length < dataStart + minDataLen) return null
	const topic0 = `0x${raw.slice(0, 64).toLowerCase()}`
	const expectedTopic = eventTopicFromSignature(signature)
	if (expectedTopic && topic0 !== expectedTopic) return null
	const params: DecodedParam[] = []
	try {
		for (let i = 0; i < parsed.indexedTypes.length; i++) {
			const type = parsed.indexedTypes[i]
			const topicHex = `0x${raw.slice(64 + i * 64, 64 + (i + 1) * 64).toLowerCase()}`
			const decoded = decodeParameters(
				abiDecodeParametersFromTypes([type]),
				toBytes(topicHex)
			)
			params.push({
				type,
				value: decoded[0],
			})
		}
		if (parsed.nonIndexedTypes.length > 0) {
			const dataHex = `0x${raw.slice(dataStart)}`.toLowerCase()
			const decoded = decodeParameters(
				abiDecodeParametersFromTypes(parsed.nonIndexedTypes),
				toBytes(dataHex)
			)
			for (let i = 0; i < parsed.nonIndexedTypes.length; i++)
				params.push({
					type: parsed.nonIndexedTypes[i],
					value: decoded[i],
				})
		}
		return {
			name: parsed.name,
			params,
		}
	} catch {
		return null
	}
}

/** Decode a receipt log (topics + data) using a catalog event/log signature string. */
export const decodeLogWithSignature = (
	signature: string,
	topics: readonly string[],
	data: string
): DecodedCalldata | null => {
	const stripHex = (hex: string) => (
		hex.startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	if (topics.length === 0 || topics[0] === '') return null
	const parsed = parseEventSignature(signature)
	if (!parsed) return null
	const indexedCount = parsed.indexedTypes.length
	if (topics.length < 1 + indexedCount) return null
	return decodeEventDataWithSignature(
		signature,
		`${stripHex(topics[0])}${topics.slice(1, 1 + indexedCount).map(stripHex).join('')}${stripHex(data)}`
	)
}

const abiEventSignatureFromAbiEntry = (entry: {
	name: string
	inputs?: {
		type: string
		indexed?: boolean
	}[]
}) => (
	`${entry.name}(${(
		entry.inputs
		?? []
	).map((input) => (
		`${input.type}${input.indexed ? ' indexed' : ''}`
	)).join(',')})`
)

/** Try each ABI `event` entry on verified contract JSON until one decodes the log. */
export const decodeLogWithContractAbi = (
	abi: readonly EvmAbiEntry[],
	topics: readonly string[],
	data: string
): {
	signature: string
	decoded: DecodedCalldata
} | null => {
	if (topics.length === 0 || topics[0] === '' || data === '') return null

	for (const entry of abi) {
		if (entry.type !== 'event' || entry.name == null) continue

		const signature = abiEventSignatureFromAbiEntry({
			name: entry.name,
			inputs: entry.inputs,
		})
		const decoded = decodeLogWithSignature(signature, topics, data)
		if (decoded) return {
			signature,
			decoded,
		}
	}

	return null
}

/** Try each ABI `event` entry on verified contract JSON until one decodes the log. */
export const decodeLogWithContractAbiJson = (
	abiJson: string,
	topics: readonly string[],
	data: string
): {
	signature: string
	decoded: DecodedCalldata
} | null => {
	if (topics.length === 0 || topics[0] === '' || data === '') return null

	for (const entry of evmAbiFromJsonString(abiJson)) {
		if (entry.type !== 'event' || entry.name == null) continue

		const signature = abiEventSignatureFromAbiEntry({
			name: entry.name,
			inputs: entry.inputs,
		})
		const decoded = decodeLogWithSignature(signature, topics, data)
		if (decoded) return {
			signature,
			decoded,
		}
	}
	return null
}

/**
	* Decode calldata (selector + args) using a text signature.
	* calldataHex must start with selector (4 bytes); the rest is decoded as ABI-encoded params.
	*/
export const decodeCalldataWithSignature = (
	signature: string,
	calldataHex: string
): DecodedCalldata | null => {
	const parsed = parseFunctionSignature(signature)
	if (!parsed) return null
	const raw = (
		calldataHex.startsWith('0x') ?
			calldataHex.slice(2)
		:
			calldataHex
	)
	if (raw.length < 8) return null
	const expectedSelector = functionSelectorFromSignature(signature)
	if (
		expectedSelector
		&& raw.slice(0, 8).toLowerCase() !== expectedSelector.slice(2).toLowerCase()
	)
		return null
	const tailHex = `0x${raw.slice(8).toLowerCase()}`
	if (parsed.types.length === 0) return {
		name: parsed.name,
		params: [],
	}
	try {
		const decoded = decodeParameters(
			abiDecodeParametersFromTypes(parsed.types),
			toBytes(tailHex)
		)
		const params: DecodedParam[] = parsed.types.map((type, i) => ({
			type,
			value: decoded[i],
		}))
		return {
			name: parsed.name,
			params,
		}
	} catch {
		return null
	}
}

/** Parse "(type1,type2,...)" into [type1, type2, ...]. Returns null if not a tuple type. */
const parseTupleTypes = (tupleType: string): string[] | null => {
	const t = tupleType.trim()
	if (!t.startsWith('(') || !t.endsWith(')')) return null
	const inner = t.slice(1, -1).trim()
	if (inner === '') return []
	const types: string[] = []
	let depth = 0
	let start = 0
	for (let i = 0; i < inner.length; i++) {
		const c = inner[i]
		if (c === '(') depth++
		else if (c === ')') depth--
		else if (c === ',' && depth === 0) {
			types.push(inner.slice(start, i).trim())
			start = i + 1
		}
	}
	types.push(inner.slice(start).trim())
	return types
}

/** Format a decoded param value for display (bigint string, bytes as hex, tuple, etc.). */
export const formatDecodedParamValue = (type: string, value: DecodedAbiValue): string => {
	if (typeof value === 'bigint') return value.toString()
	if (typeof value === 'boolean') return value ? 'true' : 'false'
	if (value instanceof Uint8Array)
		return value.length === 0 ? '0x' : fromBytes(value)
	const tupleTypes = parseTupleTypes(type)
	if (tupleTypes && Array.isArray(value))
		return `(${value.map((v, i) => formatDecodedParamValue(tupleTypes[i] ?? 'unknown', v)).join(', ')})`
	return String(value)
}

/** Split hex calldata into display lines: selector (8 hex chars) then 32-byte (64 hex) chunks. */
export const formatHexCalldataLines = (hex: string): string[] => {
	const raw = (
		hex.startsWith('0x') ?
			hex.slice(2)
		:
			hex
	)
	if (raw.length === 0) return ['0x']
	const lines: string[] = []
	if (raw.length <= 8)
		lines.push('0x' + raw)
	else {
		lines.push('0x' + raw.slice(0, 8))
		for (let i = 8; i < raw.length; i += 64)
			lines.push(raw.slice(i, i + 64))
	}
	return lines
}
