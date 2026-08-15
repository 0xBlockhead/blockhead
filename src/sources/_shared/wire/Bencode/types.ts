import type { JsonValue } from '$/typescript/JsonValue.ts'

export type BencodeValue =
	| string
	| Uint8Array
	| number
	| BencodeValue[]
	| { readonly [key: string]: BencodeValue }

export type BencodeRequest = {
	operation: string
	bytes?: Uint8Array
	params?: JsonValue
}
