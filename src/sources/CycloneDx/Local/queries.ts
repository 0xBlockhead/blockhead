import type { JsonValue } from '$/typescript/JsonValue.ts'

export const parseDocument = (text: string): JsonValue => (
	JSON.parse(text)
)
