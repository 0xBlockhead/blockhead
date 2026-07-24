import { throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type {
	ZeroGStorageNodeFileInfo,
	ZeroGStorageNodeFlowProof,
	ZeroGStorageNodeStatus,
} from '$/sources/ZeroG/StorageNode/JsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
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
	if (!response.ok) await throwHttpError(`ZeroGStorageNode_JsonRpc ${method}`, response)
	const json: ZeroGStorageNodeJsonRpcResponse<_Result> = await response.json()
	if (json.error != null) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: missing result`)
	return json.result
}

export const getStatus = (binding: SourceBinding) => (
	storageNodeJsonRpc<ZeroGStorageNodeStatus>({
		binding,
		method: 'zgs_getStatus',
		params: [],
	})
)

export const getFileInfo = ({
	binding,
	root,
	needAvailable,
}: {
	binding: SourceBinding
	root: string
	needAvailable: boolean
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		binding,
		method: 'zgs_getFileInfo',
		params: [
			root,
			needAvailable,
		],
	})
)

export const getFileInfoByTxSeq = ({
	binding,
	txSeq,
}: {
	binding: SourceBinding
	txSeq: number | bigint
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		binding,
		method: 'zgs_getFileInfoByTxSeq',
		params: [
			Number(txSeq),
		],
	})
)

export const getSectorProof = ({
	binding,
	sectorIndex,
	root,
}: {
	binding: SourceBinding
	sectorIndex: number | bigint
	root?: string
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFlowProof>({
		binding,
		method: 'zgs_getSectorProof',
		params: [
			Number(sectorIndex),
			root ?? null,
		],
	})
)
