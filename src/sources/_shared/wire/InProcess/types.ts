import type { JsonValue } from '$/typescript/JsonValue.ts'

export type InProcessRequest = {
	operation: string
	input?: JsonValue
}
