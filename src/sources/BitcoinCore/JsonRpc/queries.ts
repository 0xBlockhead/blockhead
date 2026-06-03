import { corsFetch, throwHttpError } from '$/lib/http.ts'
import BitcoinCore from '$/sources/BitcoinCore/index.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/BitcoinCore/JsonRpc/types.ts'

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

const bitcoinCoreJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: BitcoinCore.origins,
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
	if (!response.ok) await throwHttpError(`BitcoinCore ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`BitcoinCore ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`BitcoinCore ${method}: missing result`)
	return json.result
}

export const getBlockHash = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	bitcoinCoreJsonRpc<string>({
		rpcUrl,
		method: 'getblockhash',
		params: [Number(height)],
	})
)

export const getBlock = <_Verbosity extends 0 | 1 | 2 = 2>({
	rpcUrl,
	blockHash,
	verbosity,
}: {
	rpcUrl: string
	blockHash: string
	verbosity?: _Verbosity
}) => (
	bitcoinCoreJsonRpc<_Verbosity extends 0 ? string : BitcoinCoreBlock>({
		rpcUrl,
		method: 'getblock',
		params: [
			blockHash,
			verbosity ?? 2,
		],
	})
)

export const getRawTransaction = <_Verbose extends boolean = true>({
	rpcUrl,
	txId,
	verbose,
}: {
	rpcUrl: string
	txId: string
	verbose?: _Verbose
}) => (
	bitcoinCoreJsonRpc<_Verbose extends true ? BitcoinCoreTransaction : string>({
		rpcUrl,
		method: 'getrawtransaction',
		params: [
			txId,
			verbose ?? true,
		],
	})
)

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	bitcoinCoreJsonRpc<BitcoinCoreMempoolInfo>({
		rpcUrl,
		method: 'getmempoolinfo',
		params: [],
	})
)
