import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	ZeroGStorageNodeFileInfo,
	ZeroGStorageNodeFlowProof,
	ZeroGStorageNodeStatus,
} from '$/sources/ZeroG/StorageNode/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'

const binding = bindings[Source.ZeroGStorageNode_JsonRpc][0]

export const endpoint = firstHttpUrlForBinding(binding)

export const getStatus = () => (
	jsonRpc2<ZeroGStorageNodeStatus>(binding, 'zgs_getStatus', [])
)

export const getFileInfo = ({
	root,
	needAvailable,
}: {
	root: string
	needAvailable: boolean
}) => (
	jsonRpc2<ZeroGStorageNodeFileInfo | null>(
		binding,
		'zgs_getFileInfo',
		[
			root,
			needAvailable,
		]
	)
)

export const getFileInfoByTxSeq = ({
	txSeq,
}: {
	txSeq: number | bigint
}) => (
	jsonRpc2<ZeroGStorageNodeFileInfo | null>(
		binding,
		'zgs_getFileInfoByTxSeq',
		[
			Number(txSeq),
		]
	)
)

export const getSectorProof = ({
	sectorIndex,
	root,
}: {
	sectorIndex: number | bigint
	root?: string
}) => (
	jsonRpc2<ZeroGStorageNodeFlowProof>(
		binding,
		'zgs_getSectorProof',
		[
			Number(sectorIndex),
			root ?? null,
		]
	)
)
