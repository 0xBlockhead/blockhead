import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	MempoolSpaceAddress,
	MempoolSpaceBlock,
	MempoolSpaceMempoolStats,
	MempoolSpaceRecommendedFees,
	MempoolSpaceTransaction,
} from '$/sources/MempoolSpace/Rest/types.ts'

const mempoolSpaceRestUrl = (
	binding: SourceBinding,
	path: string
) => new URL(
	path,
	`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/`
).toString()

export const getBlock = (
	binding: SourceBinding,
	blockHash: string
) => sourceGetJson<MempoolSpaceBlock>(
	binding,
	mempoolSpaceRestUrl(binding, `block/${encodeURIComponent(blockHash)}`)
)

export const getBlockTransactionIds = (
	binding: SourceBinding,
	blockHash: string
) => sourceGetJson<string[]>(
	binding,
	mempoolSpaceRestUrl(binding, `block/${encodeURIComponent(blockHash)}/txids`)
)

export const getTransaction = (
	binding: SourceBinding,
	txId: string
) => sourceGetJson<MempoolSpaceTransaction>(
	binding,
	mempoolSpaceRestUrl(binding, `tx/${encodeURIComponent(txId)}`)
)

export const getBlocks = (
	binding: SourceBinding,
	startHeight?: bigint
) => sourceGetJson<MempoolSpaceBlock[]>(
	binding,
	mempoolSpaceRestUrl(
		binding,
		startHeight == null ?
			'v1/blocks'
		:
			`v1/blocks/${startHeight.toString()}`
	)
)

export const getMempoolStats = (
	binding: SourceBinding
) => sourceGetJson<MempoolSpaceMempoolStats>(
	binding,
	mempoolSpaceRestUrl(binding, 'mempool')
)

export const getMempoolTxids = (
	binding: SourceBinding
) => sourceGetJson<string[]>(
	binding,
	mempoolSpaceRestUrl(binding, 'mempool/txids')
)

export const getAddress = (
	binding: SourceBinding,
	address: string
) => sourceGetJson<MempoolSpaceAddress>(
	binding,
	mempoolSpaceRestUrl(binding, `address/${encodeURIComponent(address)}`)
)

export const getAddressTransactions = (
	binding: SourceBinding,
	address: string,
	lastSeenTransactionId?: string
) => sourceGetJson<MempoolSpaceTransaction[]>(
	binding,
	mempoolSpaceRestUrl(
		binding,
		`address/${encodeURIComponent(address)}/txs/chain${
			lastSeenTransactionId == null ?
				''
			:
				`/${encodeURIComponent(lastSeenTransactionId)}`
		}`
	)
)

export const getRecommendedFees = (
	binding: SourceBinding
) => sourceGetJson<MempoolSpaceRecommendedFees>(
	binding,
	mempoolSpaceRestUrl(binding, 'v1/fees/recommended')
)
