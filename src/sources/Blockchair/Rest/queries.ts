/**
 * Blockchair REST API v2 reads. These helpers keep the endpoint surface typed while
 * preserving Blockchair's native response envelopes and dynamic dashboard keys.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import { getBlockchairJson } from '$/sources/Blockchair/Rest/client.ts'
import {
	blockchairDefaultLimit,
	blockchairMaxLimit,
} from '$/sources/Blockchair/Rest/constants.ts'
import type {
	BlockchairAddressDashboardParams,
	BlockchairBitcoinLikeAddressDashboard,
	BlockchairBitcoinLikeBlock,
	BlockchairBitcoinLikeBlockDashboard,
	BlockchairBitcoinLikeChain,
	BlockchairBitcoinLikeStats,
	BlockchairBitcoinLikeTransaction,
	BlockchairBitcoinLikeTransactionDashboard,
	BlockchairInfinitableParams,
	BlockchairRequestOptions,
	BlockchairResponse,
} from '$/sources/Blockchair/Rest/types.ts'

const pathIdentifier = (identifier: bigint | number | string) => encodeURIComponent(String(identifier))

const blockchairLimit = (limit: number | undefined) => (
	Math.min(
		Math.max(limit ?? blockchairDefaultLimit, 0),
		blockchairMaxLimit
	)
)

const infinitableSearchParams = (params?: BlockchairInfinitableParams) => ({
	q: params?.query,
	s: params?.sort,
	a: params?.aggregate,
	limit: blockchairLimit(params?.limit),
	offset: params?.offset,
})

const bitcoinLikeAddressSearchParams = (params?: BlockchairAddressDashboardParams) => ({
	limit: blockchairLimit(params?.limit),
	offset: params?.offset,
	state: params?.state,
	transaction_details: params?.transactionDetails,
})

export const getBitcoinLikeStats = ({
	chain,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<BlockchairBitcoinLikeStats>>({
		path: `/${chain}/stats`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/block/{height|hash}`.
 */
export const getBitcoinLikeBlockDashboard = ({
	chain,
	block,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	block: bigint | number | string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairBitcoinLikeBlockDashboard>>>({
		path: `/${chain}/dashboards/block/${pathIdentifier(block)}`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/transaction/{hash}`.
 */
export const getBitcoinLikeTransactionDashboard = ({
	chain,
	transactionHash,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	transactionHash: string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairBitcoinLikeTransactionDashboard>>>({
		path: `/${chain}/dashboards/transaction/${pathIdentifier(transactionHash)}`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/address/{address}`.
 */
export const getBitcoinLikeAddressDashboard = ({
	chain,
	address,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	address: string
	params?: BlockchairAddressDashboardParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairBitcoinLikeAddressDashboard>>>({
		path: `/${chain}/dashboards/address/${pathIdentifier(address)}`,
		searchParams: bitcoinLikeAddressSearchParams(params),
		options,
	})
)

/**
 * `GET /{chain}/blocks` — Blockchair infinitable table; supports `q`, `s`, `a`,
 * `limit`, and `offset` through `params`.
 */
export const getBlocks = <_Block = BlockchairBitcoinLikeBlock>({
	chain,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	params?: BlockchairInfinitableParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<_Block[]>>({
		path: `/${chain}/blocks`,
		searchParams: infinitableSearchParams(params),
		options,
	})
)

/**
 * `GET /{chain}/transactions` — Blockchair infinitable table; supports `q`, `s`,
 * `a`, `limit`, and `offset` through `params`.
 */
export const getTransactions = <
	_Transaction = BlockchairBitcoinLikeTransaction,
>({
	chain,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	params?: BlockchairInfinitableParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<_Transaction[]>>({
		path: `/${chain}/transactions`,
		searchParams: infinitableSearchParams(params),
		options,
	})
)
