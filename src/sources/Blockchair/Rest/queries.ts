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
import {
	assertBlockchairEnvelope,
	blockchairBitcoinLikeAddressDashboardResponseWire,
	blockchairBitcoinLikeBlockDashboardResponseWire,
	blockchairBitcoinLikeBlocksResponseWire,
	blockchairBitcoinLikeStatsResponseWire,
	blockchairBitcoinLikeTransactionDashboardResponseWire,
	blockchairBitcoinLikeTransactionsResponseWire,
	blockchairEthereumLikeStatsResponseWire,
} from '$/sources/Blockchair/Rest/envelopes.ts'
import type {
	BlockchairAddressDashboardParams,
	BlockchairBitcoinLikeChain,
	BlockchairEthereumLikeChain,
	BlockchairInfinitableParams,
	BlockchairRequestOptions,
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

export const getBitcoinLikeStats = async ({
	chain,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeStatsResponseWire,
		await getBlockchairJson({
			path: `/${chain}/stats`,
			publicEnv: options.publicEnv,
		}),
		`${chain} stats`
	)
)

/**
 * `GET /{eth_chain}/stats` — Ethereum-like tip / chain totals.
 */
export const getEthereumLikeStats = async ({
	chain,
	options,
}: {
	chain: BlockchairEthereumLikeChain
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairEthereumLikeStatsResponseWire,
		await getBlockchairJson({
			path: `/${chain}/stats`,
			publicEnv: options.publicEnv,
		}),
		`${chain} stats`
	)
)

/**
 * `GET /{btc_chain}/dashboards/block/{height|hash}`.
 */
export const getBitcoinLikeBlockDashboard = async ({
	chain,
	block,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	block: bigint | number | string
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeBlockDashboardResponseWire,
		await getBlockchairJson({
			path: `/${chain}/dashboards/block/${pathIdentifier(block)}`,
			publicEnv: options.publicEnv,
		}),
		`${chain} block dashboard`
	)
)

/**
 * `GET /{btc_chain}/dashboards/transaction/{hash}`.
 */
export const getBitcoinLikeTransactionDashboard = async ({
	chain,
	transactionHash,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	transactionHash: string
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeTransactionDashboardResponseWire,
		await getBlockchairJson({
			path: `/${chain}/dashboards/transaction/${pathIdentifier(transactionHash)}`,
			publicEnv: options.publicEnv,
		}),
		`${chain} transaction dashboard`
	)
)

/**
 * `GET /{btc_chain}/dashboards/address/{address}`.
 */
export const getBitcoinLikeAddressDashboard = async ({
	chain,
	address,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	address: string
	params?: BlockchairAddressDashboardParams
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeAddressDashboardResponseWire,
		await getBlockchairJson({
			path: `/${chain}/dashboards/address/${pathIdentifier(address)}`,
			searchParams: bitcoinLikeAddressSearchParams(params),
			publicEnv: options.publicEnv,
		}),
		`${chain} address dashboard`
	)
)

/**
 * `GET /{chain}/blocks` — Blockchair infinitable table; supports `q`, `s`, `a`,
 * `limit`, and `offset` through `params`.
 */
export const getBlocks = async ({
	chain,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	params?: BlockchairInfinitableParams
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeBlocksResponseWire,
		await getBlockchairJson({
			path: `/${chain}/blocks`,
			searchParams: infinitableSearchParams(params),
			publicEnv: options.publicEnv,
		}),
		`${chain} blocks`
	)
)

/**
 * `GET /{chain}/transactions` — Blockchair infinitable table; supports `q`, `s`,
 * `a`, `limit`, and `offset` through `params`.
 */
export const getTransactions = async ({
	chain,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	params?: BlockchairInfinitableParams
	options: BlockchairRequestOptions
}) => (
	assertBlockchairEnvelope(
		blockchairBitcoinLikeTransactionsResponseWire,
		await getBlockchairJson({
			path: `/${chain}/transactions`,
			searchParams: infinitableSearchParams(params),
			publicEnv: options.publicEnv,
		}),
		`${chain} transactions`
	)
)
