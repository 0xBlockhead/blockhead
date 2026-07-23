export type JsonRpc2Request = {
	jsonrpc: '2.0'
	id: number
	method: string
	params?: readonly unknown[] | Readonly<Record<string, unknown>>
}

export type JsonRpc2Error = {
	code: number
	message: string
	data?: unknown
}

export type JsonRpc2Response<_Result> = {
	jsonrpc: '2.0'
	id: number
	result?: _Result
	error?: JsonRpc2Error
}
