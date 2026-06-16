import type { decodeParameters } from '@tevm/voltaire/Abi'

export type DecodedAbiValue = ReturnType<typeof decodeParameters>[number]

export type DecodedParam = {
	type: string
	value: DecodedAbiValue
}

export type DecodedCalldata = {
	name: string
	params: DecodedParam[]
}
