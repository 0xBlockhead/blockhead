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

export const isJsonObject = (value: JsonValue | undefined): value is JsonObject => (
	typeof value === 'object' && value !== null && !Array.isArray(value)
)

export const isJsonString = (value: JsonValue): value is string => (
	typeof value === 'string'
)

export const isJsonNumber = (value: JsonValue): value is number => (
	typeof value === 'number'
)

export const isJsonBoolean = (value: JsonValue): value is boolean => (
	typeof value === 'boolean'
)

export const isJsonArray = (value: JsonValue): value is readonly JsonValue[] => (
	Array.isArray(value)
)

export const jsonMessage = (value: JsonValue | undefined): string | undefined => {
	if (!isJsonObject(value) || !isJsonString(value.message))
		return undefined

	return value.message === '' ? undefined : value.message
}
