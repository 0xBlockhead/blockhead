import { query } from '$app/server'
import { type } from 'arktype'

import {
	endpoint,
	getFileInfo as getFileInfoFromNode,
	getFileInfoByTxSeq as getFileInfoByTxSeqFromNode,
	getSectorProof as getSectorProofFromNode,
	getStatus as getStatusFromNode,
} from '$/sources/ZeroG/StorageNode/JsonRpc/queries.ts'


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
		txSeq: 'number.integer >= 0 | bigint >= 0',
	}),
	(input) => getFileInfoByTxSeqFromNode(input)
)
export const getSectorProof = query(
	type({
		sectorIndex: 'number.integer >= 0 | bigint >= 0',
		'root?': 'string > 0',
	}),
	(input) => getSectorProofFromNode(input)
)
