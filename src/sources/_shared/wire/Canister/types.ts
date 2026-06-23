import type { JsonValue } from '$/typescript/JsonValue.ts'

export type CanisterRequest = {
	canisterId?: string
	method: string
	args?: JsonValue
}
