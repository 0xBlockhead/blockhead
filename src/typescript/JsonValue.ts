/** JSON-serializable wire value (no `unknown`). */

export type JsonObject = { readonly [key: string]: JsonValue }

export type JsonValue =
	| null
	| boolean
	| number
	| bigint
	| string
	| readonly JsonValue[]
	| JsonObject

export const isJsonObject = (value: JsonValue): value is JsonObject => (
	typeof value === 'object' && value !== null && !Array.isArray(value)
)
