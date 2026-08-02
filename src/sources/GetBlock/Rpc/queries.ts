import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	GetBlockEvmTransaction,
	GetBlockEvmTransactionReceipt,
	GetBlockJsonRpcResponse,
} from '$/sources/GetBlock/Rpc/types.ts'

const binding = bindings[Source.GetBlockRpc_JsonRpc][0]

const request = async <_Result>(
	method: string,
	parameters: string[]
) => {
	const httpResponse = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method,
				params: parameters,
			}),
		}
	)
	if (!httpResponse.ok)
		throw new Error(await fetchFailedMessage(`GetBlock ${method}`, httpResponse))

	const response = await httpResponse.json<GetBlockJsonRpcResponse<_Result>>()
	if ('error' in response)
		throw new Error(`GetBlockRpc_JsonRpc: ${response.error.message} (${response.error.code})`)

	return response.result
}

export const getEvmTransactionByHash = (
	txHash: string
) => request<GetBlockEvmTransaction | null>('eth_getTransactionByHash', [txHash])

export const getEvmTransactionReceipt = (
	txHash: string
) => request<GetBlockEvmTransactionReceipt | null>('eth_getTransactionReceipt', [txHash])
