import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import type { EvmAbiEntry } from '$/schema/EvmAbi.ts'

export const evmAbiFromJsonValue = (value: JsonValue): EvmAbiEntry[] => (
	Array.isArray(value) ?
		value.flatMap((entry) => {
			if (!isJsonObject(entry)) return []
			const entryType = typeof entry.type === 'string' ? entry.type : undefined
			const entryName = typeof entry.name === 'string' ? entry.name : undefined
			return entryType == null ?
				[]
			:
				[{
					type: entryType,
					...(entryName != null && { name: entryName }),
					...(Array.isArray(entry.inputs) && {
						inputs: entry.inputs.flatMap((input) => (
							isJsonObject(input) && typeof input.type === 'string' ?
								[{
									type: input.type,
									...(typeof input.name === 'string' && { name: input.name }),
									...(typeof input.indexed === 'boolean' && { indexed: input.indexed }),
								}]
							:
								[]
						)),
					}),
					...(Array.isArray(entry.outputs) && {
						outputs: entry.outputs.flatMap((output) => (
							isJsonObject(output) && typeof output.type === 'string' ?
								[{
									type: output.type,
									...(typeof output.name === 'string' && { name: output.name }),
								}]
							:
								[]
						)),
					}),
					...(typeof entry.stateMutability === 'string' && { stateMutability: entry.stateMutability }),
					...(typeof entry.anonymous === 'boolean' && { anonymous: entry.anonymous }),
				}]
		})
	:
		[]
)

export const evmAbiFromJsonString = (abiJson: string): EvmAbiEntry[] => {
	let parsed: JsonValue
	try {
		parsed = JSON.parse(abiJson)
	}
	catch {
		return []
	}
	return evmAbiFromJsonValue(parsed)
}

export const evmAbiEntrySignature = (entry: EvmAbiEntry) => (
	entry.name != null && entry.name !== '' ?
		`${entry.name}(${(entry.inputs ?? []).map((input) => (
			`${input.type}${input.indexed ? ' indexed' : ''}`
		)).join(', ')})`
	: (entry.inputs ?? []).length ?
		`(${(entry.inputs ?? []).map((input) => input.type).join(', ')})`
	:
		entry.type
)
