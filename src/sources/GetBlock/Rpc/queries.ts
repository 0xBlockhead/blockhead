import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	GetBlockEvmTransaction,
	GetBlockEvmTransactionReceipt,
	GetBlockJsonRpcResponse,
} from '$/sources/GetBlock/Rpc/types.ts'

const request = async <_Result>(
	binding: SourceBinding,
	method: string,
	parameters: string[],
	id: number
): Promise<_Result> => {
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
				id,
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
	binding: SourceBinding,
	txHash: string
) => request<GetBlockEvmTransaction | null>(binding, 'eth_getTransactionByHash', [txHash], 1)

export const getEvmTransactionReceipt = (
	binding: SourceBinding,
	txHash: string
) => request<GetBlockEvmTransactionReceipt | null>(binding, 'eth_getTransactionReceipt', [txHash], 2)
