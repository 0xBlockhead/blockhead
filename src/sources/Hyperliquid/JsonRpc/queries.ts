import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidEvmBlock,
	HyperliquidEvmTransaction,
	HyperliquidEvmTransactionReceipt,
} from '$/sources/Hyperliquid/JsonRpc/types.ts'

type JsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const hyperliquidJsonRpc = async <_Result>({
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
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		}
	)
	if (!response.ok) await throwHttpError(`Hyperliquid ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Hyperliquid ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Hyperliquid ${method}: missing result`)
	return json.result
}

export const getBlockByNumber = ({
	binding,
	height,
	includeTransactions = false,
}: {
	binding: SourceBinding
	height: bigint
	includeTransactions?: boolean
}) => (
	hyperliquidJsonRpc<HyperliquidEvmBlock | null>({
		binding,
		method: 'eth_getBlockByNumber',
		params: [
			`0x${height.toString(16)}`,
			includeTransactions,
		],
	})
)

export const getBlockNumber = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	hyperliquidJsonRpc<string>({
		binding,
		method: 'eth_blockNumber',
		params: [],
	})
)

export const getTransactionByHash = ({
	binding,
	txHash,
}: {
	binding: SourceBinding
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransaction | null>({
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
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransactionReceipt | null>({
		binding,
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)
