import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	MempoolSpaceAddress,
	MempoolSpaceMempoolStats,
	MempoolSpaceRecommendedFees,
} from '$/sources/MempoolSpace/Rest/types.ts'
import type {
	EsploraBlock,
	EsploraTransaction,
} from '$/sources/Esplora/Rest/types.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.MempoolSpace_Rest]

const mempoolSpaceRestUrl = (
	path: string
) => new URL(
	path,
	`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/`
).toString()

export const getBlock = (
	blockHash: string
) => sourceGetJson<EsploraBlock>(
	binding,
	mempoolSpaceRestUrl(`block/${encodeURIComponent(blockHash)}`)
)

export const getBlockTransactionIds = (
	blockHash: string
) => sourceGetJson<string[]>(
	binding,
	mempoolSpaceRestUrl(`block/${encodeURIComponent(blockHash)}/txids`)
)

export const getTransaction = (
	txId: string
) => sourceGetJson<EsploraTransaction>(
	binding,
	mempoolSpaceRestUrl(`tx/${encodeURIComponent(txId)}`)
)

export const getBlocks = (
	startHeight?: bigint
) => sourceGetJson<EsploraBlock[]>(
	binding,
	mempoolSpaceRestUrl(
		startHeight == null ?
			'v1/blocks'
		:
			`v1/blocks/${startHeight.toString()}`
	)
)

export const getMempoolStats = () => sourceGetJson<MempoolSpaceMempoolStats>(
	binding,
	mempoolSpaceRestUrl('mempool')
)

export const getMempoolTxids = () => sourceGetJson<string[]>(
	binding,
	mempoolSpaceRestUrl('mempool/txids')
)

export const getAddress = (
	address: string
) => sourceGetJson<MempoolSpaceAddress>(
	binding,
	mempoolSpaceRestUrl(`address/${encodeURIComponent(address)}`)
)

export const getAddressTransactions = (
	address: string,
	lastSeenTransactionId?: string
) => sourceGetJson<EsploraTransaction[]>(
	binding,
	mempoolSpaceRestUrl(
		`address/${encodeURIComponent(address)}/txs/chain${
			lastSeenTransactionId == null ?
				''
			:
				`/${encodeURIComponent(lastSeenTransactionId)}`
		}`
	)
)

export const getRecommendedFees = () => sourceGetJson<MempoolSpaceRecommendedFees>(
	binding,
	mempoolSpaceRestUrl('v1/fees/recommended')
)
