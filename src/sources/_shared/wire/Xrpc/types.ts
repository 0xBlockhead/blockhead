import type { JsonValue } from '$/typescript/JsonValue.ts'

export type XrpcRequest = {
	nsid: string
	params?: Record<string, string>
	body?: JsonValue
}
