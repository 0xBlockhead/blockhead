import type { JsonValue } from '$/typescript/JsonValue.ts'

export type TransmissionRequest = {
	method: string
	arguments?: Record<string, JsonValue>
	tag?: number
}

export type TransmissionResponse = {
	result: string
	arguments?: JsonValue
	tag?: number
}
