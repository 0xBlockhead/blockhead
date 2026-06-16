import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type {
	RpcBlockHeader,
	RpcReceipt,
	RpcTransaction,
} from '$/sources/Evm/JsonRpc/types.ts'
import { zeroGMainnetRpcEndpoints } from '$/sources/ZeroG/Chain/JsonRpc/index.ts'
import ZeroG from '$/sources/ZeroG/index.ts'
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
	method,
	params,
}: {
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(zeroGMainnetRpcEndpoints[0].url, {
		origins: ZeroG.origins,
		init: {
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
		},
	})
	if (!response.ok) await throwHttpError(`ZeroGChain_JsonRpc ${method}`, response)
	const json: ZeroGJsonRpcResponse<_Result> = await response.json()
	if (json.error != null) throw new Error(`ZeroGChain_JsonRpc ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`ZeroGChain_JsonRpc ${method}: missing result`)
	return json.result
}

export const getBlockNumber = () => (
	zeroGJsonRpc<string>({
		method: 'eth_blockNumber',
		params: [],
	})
)

export const getBlockByNumber = ({
	blockNumber,
	txObjects,
}: {
	blockNumber: bigint | 'latest'
	txObjects: boolean
}) => (
	zeroGJsonRpc<RpcBlockHeader | null>({
		method: 'eth_getBlockByNumber',
		params: [
			quantityHex(blockNumber),
			txObjects,
		],
	})
)

export const getTransactionByHash = ({
	txHash,
}: {
	txHash: `0x${string}`
}) => (
	zeroGJsonRpc<RpcTransaction | null>({
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	txHash,
}: {
	txHash: `0x${string}`
}) => (
	zeroGJsonRpc<RpcReceipt | null>({
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)
