import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { hyperliquidBindings } from '$/sources/Hyperliquid/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidEvmBlock,
	HyperliquidEvmTransaction,
	HyperliquidEvmTransactionReceipt,
} from '$/sources/Hyperliquid/JsonRpc/types.ts'

export const hyperliquidOrigins = [
	...new Map(
		hyperliquidBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export const hyperliquidMainnetRpcEndpoints = hyperliquidBindings
	.slice(1, 2)
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid HyperEVM JSON-RPC',
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
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: hyperliquidOrigins,
		init: {
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`Hyperliquid ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Hyperliquid ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Hyperliquid ${method}: missing result`)
	return json.result
}

export const getBlockByNumber = ({
	rpcUrl,
	height,
	includeTransactions = false,
}: {
	rpcUrl: string
	height: bigint
	includeTransactions?: boolean
}) => (
	hyperliquidJsonRpc<HyperliquidEvmBlock | null>({
		rpcUrl,
		method: 'eth_getBlockByNumber',
		params: [
			`0x${height.toString(16)}`,
			includeTransactions,
		],
	})
)

export const getBlockNumber = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	hyperliquidJsonRpc<string>({
		rpcUrl,
		method: 'eth_blockNumber',
		params: [],
	})
)

export const getTransactionByHash = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransaction | null>({
		rpcUrl,
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: string
}) => (
	hyperliquidJsonRpc<HyperliquidEvmTransactionReceipt | null>({
		rpcUrl,
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)
