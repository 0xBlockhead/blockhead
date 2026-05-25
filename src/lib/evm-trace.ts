import type { EvmTraceTree } from '$/schema/EvmTrace.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


export type RawCallTraceWire = {
	type?: string
	from?: string
	to?: string
	value?: string
	gas?: string
	gasUsed?: string
	input?: string
	output?: string
	error?: string
	calls?: RawCallTraceWire[]
}

const narrowRawCallTraceWire = (raw: JsonValue): RawCallTraceWire | null => (
	raw == null || typeof raw !== 'object' || Array.isArray(raw) ?
		null
	:	(() => {
			const callsRaw = raw['calls']
			const calls = (
				Array.isArray(callsRaw) ?
					callsRaw
						.map((entry) => narrowRawCallTraceWire(entry))
						.filter((entry): entry is RawCallTraceWire => entry != null)
				:	undefined
			)
			return {
				...(typeof raw['type'] === 'string' && { type: raw['type'] }),
				...(typeof raw['from'] === 'string' && { from: raw['from'] }),
				...(typeof raw['to'] === 'string' && { to: raw['to'] }),
				...(typeof raw['value'] === 'string' && { value: raw['value'] }),
				...(typeof raw['gas'] === 'string' && { gas: raw['gas'] }),
				...(typeof raw['gasUsed'] === 'string' && { gasUsed: raw['gasUsed'] }),
				...(typeof raw['input'] === 'string' && { input: raw['input'] }),
				...(typeof raw['output'] === 'string' && { output: raw['output'] }),
				...(typeof raw['error'] === 'string' && { error: raw['error'] }),
				...(calls != null && calls.length > 0 && { calls }),
			}
		})()
)

export const parseRawCallTrace = (raw: JsonValue): RawCallTraceWire | null => (
	narrowRawCallTraceWire(raw)
)

const hexToBigInt = (value: string) => (
	value.startsWith('0x') ?
		BigInt(value)
	:	BigInt(value)
)

const rawCallToTrace = (call: RawCallTraceWire, index: number): EvmTraceTree => ({
	index,
	...(call.type != null && { type: call.type }),
	...(call.from != null && { from: call.from as `0x${string}` }),
	...(call.to != null && { to: call.to as `0x${string}` }),
	...(call.value != null && { value: call.value }),
	...(call.gas != null && { gas: hexToBigInt(call.gas) }),
	...(call.gasUsed != null && { gasUsed: hexToBigInt(call.gasUsed) }),
	...(call.input != null && { input: call.input as `0x${string}` }),
	...(call.output != null && { output: call.output as `0x${string}` }),
	...(call.error != null && { error: call.error }),
	...(call.calls != null && {
		children: call.calls.map((child, childIndex) => (
			rawCallToTrace(child, childIndex)
		)),
	}),
})

export const rawCallTraceToTraceRoot = (raw: RawCallTraceWire): EvmTraceTree => (
	rawCallToTrace(raw, 0)
)
