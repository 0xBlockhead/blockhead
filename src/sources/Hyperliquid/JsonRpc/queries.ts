import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidEvmBlock,
	HyperliquidEvmTransaction,
	HyperliquidEvmTransactionReceipt,
} from '$/sources/Hyperliquid/JsonRpc/types.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid EVM binding is missing')

export const hyperliquidJsonRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))

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
	method,
	params,
}: {
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
	height,
	includeTransactions = false,
}: {
	height: bigint
	includeTransactions?: boolean
}) => (
	hyperliquidJsonRpc<HyperliquidEvmBlock | null>({
		method: 'eth_getBlockByNumber',
		params: [
			`0x${height.toString(16)}`,
			includeTransactions,
		],
	})
)

export const getBlockNumber = () => (
	hyperliquidJsonRpc<string>({
		method: 'eth_blockNumber',
		params: [],
	})
)

export const getTransactionByHash = ({
	txHash,
}: {
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransaction | null>({
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	txHash,
}: {
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransactionReceipt | null>({
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)
