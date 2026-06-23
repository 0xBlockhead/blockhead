import type { JsonValue } from '$/typescript/JsonValue.ts'

export type RawHttpRequest = {
	method: string
	path?: string
	headers?: Record<string, string>
	body?: JsonValue
}
