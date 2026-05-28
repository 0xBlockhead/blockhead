import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import Zebra from '$/sources/Zebra/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	ZebraBlock,
	ZebraTransaction,
} from '$/sources/Zebra/JsonRpc/types.ts'

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

const zebraJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: Zebra.origins ?? [],
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
	if (!response.ok) await throwHttpError(`Zebra ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Zebra ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Zebra ${method}: missing result`)
	return json.result
}

export const getBlockHash = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	zebraJsonRpc<string>({
		rpcUrl,
		method: 'getblockhash',
		params: [Number(height)],
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}) => (
	zebraJsonRpc<ZebraBlock>({
		rpcUrl,
		method: 'getblock',
		params: [
			blockHash,
			2,
		],
	})
)

export const getRawTransaction = ({
	rpcUrl,
	txId,
}: {
	rpcUrl: string
	txId: string
}) => (
	zebraJsonRpc<ZebraTransaction>({
		rpcUrl,
		method: 'getrawtransaction',
		params: [
			txId,
			true,
		],
	})
)
