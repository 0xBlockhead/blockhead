export type DecodedParam = {
	type: string
	value: unknown
}

export type DecodedCalldata = {
	name: string
	params: DecodedParam[]
}
