import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type {
	ZeroGStorageNodeFileInfo,
	ZeroGStorageNodeFlowProof,
	ZeroGStorageNodeStatus,
} from '$/sources/ZeroG/StorageNode/JsonRpc/types.ts'
import ZeroG from '$/sources/ZeroG/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type ZeroGStorageNodeJsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const storageNodeJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: ZeroG.origins ?? [],
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
	if (!response.ok) await throwHttpError(`ZeroGStorageNode_JsonRpc ${method}`, response)
	const json: ZeroGStorageNodeJsonRpcResponse<_Result> = await response.json()
	if (json.error != null) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: missing result`)
	return json.result
}

export const zgsGetStatus = ({ rpcUrl }: { rpcUrl: string }) => (
	storageNodeJsonRpc<ZeroGStorageNodeStatus>({
		rpcUrl,
		method: 'zgs_getStatus',
		params: [],
	})
)

export const zgsGetFileInfo = ({
	rpcUrl,
	root,
	needAvailable,
}: {
	rpcUrl: string
	root: string
	needAvailable: boolean
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		rpcUrl,
		method: 'zgs_getFileInfo',
		params: [
			root,
			needAvailable,
		],
	})
)

export const zgsGetFileInfoByTxSeq = ({
	rpcUrl,
	txSeq,
}: {
	rpcUrl: string
	txSeq: number | bigint
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		rpcUrl,
		method: 'zgs_getFileInfoByTxSeq',
		params: [
			Number(txSeq),
		],
	})
)

export const zgsGetSectorProof = ({
	rpcUrl,
	sectorIndex,
	root,
}: {
	rpcUrl: string
	sectorIndex: number | bigint
	root?: string
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFlowProof>({
		rpcUrl,
		method: 'zgs_getSectorProof',
		params: [
			Number(sectorIndex),
			root ?? null,
		],
	})
)
