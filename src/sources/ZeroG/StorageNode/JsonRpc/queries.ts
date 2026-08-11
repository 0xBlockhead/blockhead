import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	zeroGStorageNodeFileInfoOrNullWire,
	zeroGStorageNodeFlowProofWire,
	zeroGStorageNodeStatusWire,
	type ZeroGStorageNodeFileInfo,
	type ZeroGStorageNodeFlowProof,
	type ZeroGStorageNodeStatus,
} from '$/sources/ZeroG/StorageNode/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'

const binding = bindings[Source.ZeroGStorageNode_JsonRpc][0]

export const endpoint = firstHttpUrlForBinding(binding)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`ZeroGStorageNode_JsonRpc: invalid ${label} response envelope`)
	}
}

const assertSafeNonnegativeInteger = (
	value: number | bigint,
	label: string
) => {
	const numberValue = Number(value)
	if (!Number.isSafeInteger(numberValue) || numberValue < 0)
		throw new Error(`ZeroGStorageNode_JsonRpc: invalid ${label}`)
	return numberValue
}

export const getStatus = async (): Promise<ZeroGStorageNodeStatus> => (
	assertEnvelope(
		'zgs_getStatus',
		zeroGStorageNodeStatusWire,
		await jsonRpc2<unknown>(binding, 'zgs_getStatus', [])
	)
)

export const getFileInfo = async ({
	root,
	needAvailable,
}: {
	root: string
	needAvailable: boolean
}): Promise<ZeroGStorageNodeFileInfo | null> => {
	const fileInfo = assertEnvelope(
		'zgs_getFileInfo',
		zeroGStorageNodeFileInfoOrNullWire,
		await jsonRpc2<unknown>(
			binding,
			'zgs_getFileInfo',
			[
				root,
				needAvailable,
			]
		)
	)
	if (fileInfo != null && fileInfo.tx.dataMerkleRoot.toLowerCase() !== root.toLowerCase())
		throw new Error('ZeroGStorageNode_JsonRpc: zgs_getFileInfo response root does not match request')
	return fileInfo
}

export const getFileInfoByTxSeq = async ({
	txSeq,
}: {
	txSeq: number | bigint
}): Promise<ZeroGStorageNodeFileInfo | null> => {
	const sequenceNumber = assertSafeNonnegativeInteger(txSeq, 'transaction sequence')
	const fileInfo = assertEnvelope(
		'zgs_getFileInfoByTxSeq',
		zeroGStorageNodeFileInfoOrNullWire,
		await jsonRpc2<unknown>(
			binding,
			'zgs_getFileInfoByTxSeq',
			[
				sequenceNumber,
			]
		)
	)
	if (fileInfo != null && fileInfo.tx.seq !== sequenceNumber)
		throw new Error('ZeroGStorageNode_JsonRpc: zgs_getFileInfoByTxSeq response sequence does not match request')
	return fileInfo
}

export const getSectorProof = async ({
	sectorIndex,
	root,
}: {
	sectorIndex: number | bigint
	root?: string
}): Promise<ZeroGStorageNodeFlowProof> => (
	assertEnvelope(
		'zgs_getSectorProof',
		zeroGStorageNodeFlowProofWire,
		await jsonRpc2<unknown>(
			binding,
			'zgs_getSectorProof',
			[
				assertSafeNonnegativeInteger(sectorIndex, 'sector index'),
				root ?? null,
			]
		)
	)
)
