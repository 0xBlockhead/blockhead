import type { JsonValue } from '$/typescript/JsonValue.ts'

export type LocalFileRequest = {
	path?: string
	operation: string
	input?: JsonValue
}
