import { throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type {
	ZeroGStorageNodeFileInfo,
	ZeroGStorageNodeFlowProof,
	ZeroGStorageNodeStatus,
} from '$/sources/ZeroG/StorageNode/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.ZeroGStorageNode_JsonRpc]

export const endpoint = firstHttpUrlForBinding(binding)

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
	method,
	params,
}: {
	method: string
	params: JsonValue[]
}) => {
	const response = await sourceFetch(
		binding,
		endpoint,
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
	const json = await response.json<ZeroGStorageNodeJsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`ZeroGStorageNode_JsonRpc ${method}: missing result`)
	return json.result
}

export const getStatus = () => (
	storageNodeJsonRpc<ZeroGStorageNodeStatus>({
		method: 'zgs_getStatus',
		params: [],
	})
)

export const getFileInfo = ({
	root,
	needAvailable,
}: {
	root: string
	needAvailable: boolean
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		method: 'zgs_getFileInfo',
		params: [
			root,
			needAvailable,
		],
	})
)

export const getFileInfoByTxSeq = ({
	txSeq,
}: {
	txSeq: number | bigint
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFileInfo | null>({
		method: 'zgs_getFileInfoByTxSeq',
		params: [
			Number(txSeq),
		],
	})
)

export const getSectorProof = ({
	sectorIndex,
	root,
}: {
	sectorIndex: number | bigint
	root?: string
}) => (
	storageNodeJsonRpc<ZeroGStorageNodeFlowProof>({
		method: 'zgs_getSectorProof',
		params: [
			Number(sectorIndex),
			root ?? null,
		],
	})
)
