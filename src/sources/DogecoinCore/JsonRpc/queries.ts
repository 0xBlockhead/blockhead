import {
	getBlock as getBitcoinCoreBlock,
	getBlockHash as getBitcoinCoreBlockHash,
	getMempoolInfo as getBitcoinCoreMempoolInfo,
	getRawTransaction as getBitcoinCoreRawTransaction,
} from '$/sources/BitcoinCore/JsonRpc/queries.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { utxoJsonRpcOrigins } from '$/sources/_shared/interfaces/UtxoJsonRpc/localOrigins.ts'
import type { DogecoinCoreBlock } from '$/sources/DogecoinCore/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type DogecoinCoreJsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const dogecoinCoreJsonRpc = async <_Result>({
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
	if (!response.ok)
		await throwHttpError(`DogecoinCore ${method}`, response)

	const json = await response.json<DogecoinCoreJsonRpcResponse<_Result>>()
	if (json.error != null)
		throw new Error(`DogecoinCore ${method}: ${json.error.message}`)
	if (json.result === undefined)
		throw new Error(`DogecoinCore ${method}: missing result`)

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

export const getBlock = ({
	rpcUrl,
	blockHash,
	verbosity = 2,
}: {
	rpcUrl: string
	blockHash: string
	verbosity?: 0 | 1 | 2
}) => (
	verbosity === 0 ?
		getBitcoinCoreBlock({
			rpcUrl,
			blockHash,
			verbosity,
		})
	:
		dogecoinCoreJsonRpc<DogecoinCoreBlock>({
			rpcUrl,
			method: 'getblock',
			params: [
				blockHash,
				verbosity,
			],
		})
)

export const getRawTransaction = ({
	rpcUrl,
	txId,
	verbose = true,
}: {
	rpcUrl: string
	txId: string
	verbose?: boolean
}) => (
	getBitcoinCoreRawTransaction({
		rpcUrl,
		txId,
		verbose,
	})
)

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	getBitcoinCoreMempoolInfo({ rpcUrl })
)
