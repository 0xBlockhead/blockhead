import { throwHttpError } from '$/lib/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type {
	RpcBlockHeader,
	RpcReceipt,
	RpcTransaction,
} from '$/sources/Evm/JsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type ZeroGJsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const quantityHex = (blockNumber: bigint | 'latest') => (
	blockNumber === 'latest' ?
		'latest'
	:
		`0x${blockNumber.toString(16)}`
)

const zeroGJsonRpc = async <_Result>({
	binding,
	method,
	params,
}: {
	binding: SourceBinding
	method: string
	params: JsonValue[]
}) => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		}
	)
	if (!response.ok) await throwHttpError(`ZeroGChain_JsonRpc ${method}`, response)
	const json: ZeroGJsonRpcResponse<_Result> = await response.json()
	if (json.error != null) throw new Error(`ZeroGChain_JsonRpc ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`ZeroGChain_JsonRpc ${method}: missing result`)
	return json.result
}

export const getBlockNumber = (binding: SourceBinding) => (
	zeroGJsonRpc<string>({
		binding,
		method: 'eth_blockNumber',
		params: [],
	})
)

export const getBlockByNumber = ({
	binding,
	blockNumber,
	txObjects,
}: {
	binding: SourceBinding
	blockNumber: bigint | 'latest'
	txObjects: boolean
}) => (
	zeroGJsonRpc<RpcBlockHeader | null>({
		binding,
		method: 'eth_getBlockByNumber',
		params: [
			quantityHex(blockNumber),
			txObjects,
		],
	})
)

export const getTransactionByHash = ({
	binding,
	txHash,
}: {
	binding: SourceBinding
	txHash: `0x${string}`
}) => (
	zeroGJsonRpc<RpcTransaction | null>({
		binding,
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	binding,
	txHash,
}: {
	binding: SourceBinding
	txHash: `0x${string}`
}) => (
	zeroGJsonRpc<RpcReceipt | null>({
		binding,
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)

export const getCode = ({
	binding,
	address,
	blockNumber = 'latest',
}: {
	binding: SourceBinding
	address: `0x${string}`
	blockNumber?: bigint | 'latest'
}) => (
	zeroGJsonRpc<`0x${string}`>({
		binding,
		method: 'eth_getCode',
		params: [
			address,
			quantityHex(blockNumber),
		],
	})
)
