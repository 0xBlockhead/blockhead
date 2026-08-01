export type ChainlinkJsonRpcResponse = {
	jsonrpc: string
	id: string
	result?: string
	error?: {
		code: number
		message: string
	}
}
