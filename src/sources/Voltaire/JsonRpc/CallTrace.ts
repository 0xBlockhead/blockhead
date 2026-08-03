import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

export type VoltaireCallTraceRpc = {
	type?: string
	from?: string
	to?: string
	value?: string
	gas?: string
	gasUsed?: string
	input?: string
	output?: string
	error?: string
	calls?: VoltaireCallTraceRpc[]
}

export const parseVoltaireCallTraceRpc = (
	raw: JsonValue
): VoltaireCallTraceRpc | null => (
	!isJsonObject(raw) ?
		null
	:
		(() => {
			const callsRaw = raw['calls']
			const calls = (
				Array.isArray(callsRaw) ?
					callsRaw
						.map((entry) => parseVoltaireCallTraceRpc(entry))
						.filter((entry): entry is VoltaireCallTraceRpc => entry != null)
				:
					undefined
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
