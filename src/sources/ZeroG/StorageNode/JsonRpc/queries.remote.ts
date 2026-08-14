import { query } from '$app/server'
import { type } from 'arktype'

import {
	endpoint,
	getFileInfo as getFileInfoFromNode,
	getFileInfoByTxSeq as getFileInfoByTxSeqFromNode,
	getSectorProof as getSectorProofFromNode,
	getStatus as getStatusFromNode,
} from '$/sources/ZeroG/StorageNode/JsonRpc/queries.ts'


const nonnegativeIntegerWire = type('number.integer >= 0').or(type('bigint').narrow((value) => value >= 0n))


export const getEndpoint = query(() => endpoint)
export const getStatus = query(() => getStatusFromNode())
export const getFileInfo = query(
	type({
		root: 'string > 0',
		needAvailable: 'boolean',
	}),
	(input) => getFileInfoFromNode(input)
)
export const getFileInfoByTxSeq = query(
	type({
		txSeq: nonnegativeIntegerWire,
	}),
	(input) => getFileInfoByTxSeqFromNode(input)
)
export const getSectorProof = query(
	type({
		sectorIndex: nonnegativeIntegerWire,
		'root?': 'string > 0',
	}),
	(input) => getSectorProofFromNode(input)
)
