import {
	getBlock as getBitcoinCoreBlock,
	getBlockHash as getBitcoinCoreBlockHash,
	getMempoolInfo as getBitcoinCoreMempoolInfo,
} from '$/sources/BitcoinCore/JsonRpc/queries.ts'
import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { utxoJsonRpcOrigins } from '$/sources/_shared/interfaces/UtxoJsonRpc/localOrigins.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	ZcashBlock,
	ZcashTransaction,
	ZcashTreeState,
} from '$/sources/Zcashd/JsonRpc/types.ts'

type ZcashJsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const zcashJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: utxoJsonRpcOrigins,
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
	if (!response.ok) await throwHttpError(`Zcashd ${method}`, response)
	const json: ZcashJsonRpcResponse<_Result> = await response.json()
	if (json.error != null) throw new Error(`Zcashd ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Zcashd ${method}: missing result`)
	return json.result
}

export const getBlockHash = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	getBitcoinCoreBlockHash({
		rpcUrl,
		height,
	})
)

export const getBlock = async ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}): Promise<ZcashBlock> => (
	getBitcoinCoreBlock({
		rpcUrl,
		blockHash,
		verbosity: 2,
	})
)

export const getRawTransaction = async ({
	rpcUrl,
	txId,
}: {
	rpcUrl: string
	txId: string
}): Promise<ZcashTransaction> => (
	zcashJsonRpc<ZcashTransaction>({
		rpcUrl,
		method: 'getrawtransaction',
		params: [
			txId,
			1,
		],
	})
)

export const getTreeState = ({
	rpcUrl,
	block,
}: {
	rpcUrl: string
	block: string | number
}) => (
	zcashJsonRpc<ZcashTreeState>({
		rpcUrl,
		method: 'z_gettreestate',
		params: [block],
	})
)

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	getBitcoinCoreMempoolInfo({ rpcUrl })
)
