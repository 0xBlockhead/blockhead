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
	BlockchairAddressInfinitableChain,
	BlockchairBitcoinLikeChain,
	BlockchairBlockInfinitableChain,
	BlockchairChain,
	BlockchairEthereumLikeChain,
	BlockchairRawBlockChain,
	BlockchairRawTransactionChain,
	BlockchairTransactionInfinitableChain,
} from '$/sources/Blockchair/Rest/constants.ts'
import type {
	BlockchairAddress,
	BlockchairAddressDashboardParams,
	BlockchairBitcoinLikeAddress,
	BlockchairBitcoinLikeAddressDashboard,
	BlockchairBitcoinLikeBlock,
	BlockchairBitcoinLikeBlockDashboard,
	BlockchairBitcoinLikeStats,
	BlockchairBitcoinLikeTransaction,
	BlockchairBitcoinLikeTransactionDashboard,
	BlockchairBlock,
	BlockchairChainStats,
	BlockchairEthereumAddressDashboardParams,
	BlockchairEthereumLikeAddress,
	BlockchairEthereumLikeAddressDashboard,
	BlockchairEthereumLikeBlock,
	BlockchairEthereumLikeBlockDashboard,
	BlockchairEthereumLikeStats,
	BlockchairEthereumLikeTransaction,
	BlockchairEthereumLikeTransactionDashboard,
	BlockchairEthereumTransactionDashboardParams,
	BlockchairInfinitableParams,
	BlockchairRequestOptions,
	BlockchairResponse,
	BlockchairStats,
	BlockchairStatsByChain,
	BlockchairTransaction,
} from '$/sources/Blockchair/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const pathIdentifier = (identifier: bigint | number | string) => encodeURIComponent(String(identifier))

const commaPathIdentifiers = (identifiers: readonly string[]) => (
	identifiers.map((identifier) => encodeURIComponent(identifier)).join(',')
)

const blockchairLimit = (limit: number | undefined) => (
	Math.min(
		Math.max(limit ?? blockchairDefaultLimit, 0),
		blockchairMaxLimit,
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

const ethereumAddressSearchParams = (params?: BlockchairEthereumAddressDashboardParams) => ({
	limit: blockchairLimit(params?.limit),
	offset: params?.offset,
	erc_20: params?.erc20,
	erc_721: params?.erc721,
	assets_in_usd: params?.assetsInUsd,
	contract_details: params?.contractDetails,
	nonce: params?.nonce,
})

const ethereumTransactionSearchParams = (params?: BlockchairEthereumTransactionDashboardParams) => ({
	erc_20: params?.erc20,
	erc_721: params?.erc721,
	assets_in_usd: params?.assetsInUsd,
	effects: params?.effects,
	trace_mempool: params?.traceMempool,
})

/**
 * `GET /stats` — aggregate stats for all Blockchair chains and second-layer summaries.
 */
export const getBlockchairStats = ({
	chain,
	options,
}: {
	chain?: BlockchairChain
	options?: BlockchairRequestOptions
} = {}) => (
	chain == null ?
		getBlockchairJson<BlockchairResponse<BlockchairStatsByChain>>({
			path: '/stats',
			options,
		})
	:
		getBlockchairJson<BlockchairResponse<BlockchairStats>>({
			path: `/${chain}/stats`,
			options,
		})
)

/**
 * `GET /{chain}/stats` — chain stats. Bitcoin-like and Ethereum-like callers can
 * use the narrower exported wrappers below.
 */
export const getBlockchairChainStats = <_Stats extends BlockchairChainStats = BlockchairChainStats>({
	chain,
	options,
}: {
	chain: BlockchairChain
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<_Stats>>({
		path: `/${chain}/stats`,
		options,
	})
)

export const getBlockchairBitcoinLikeStats = ({
	chain,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	options?: BlockchairRequestOptions
}) => (
	getBlockchairChainStats<BlockchairBitcoinLikeStats>({
		chain,
		options,
	})
)

export const getBlockchairEthereumLikeStats = ({
	chain,
	options,
}: {
	chain: BlockchairEthereumLikeChain
	options?: BlockchairRequestOptions
}) => (
	getBlockchairChainStats<BlockchairEthereumLikeStats>({
		chain,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/block/{height|hash}`.
 */
export const getBlockchairBitcoinLikeBlockDashboard = ({
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
 * Compatibility wrapper for dashboard block reads on Bitcoin-like or Ethereum-like chains.
 */
export const getBlockchairBlock = ({
	chain,
	blockId,
	options,
}: {
	chain: BlockchairBlockInfinitableChain
	blockId: bigint | number | string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, {
		block: BlockchairBlock
		transactions?: BlockchairTransaction[]
	}>>>({
		path: `/${chain}/dashboards/block/${pathIdentifier(blockId)}`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/transaction/{hash}`.
 */
export const getBlockchairBitcoinLikeTransactionDashboard = ({
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
 * Compatibility wrapper for dashboard transaction reads on Bitcoin-like or Ethereum-like chains.
 */
export const getBlockchairTransaction = ({
	chain,
	transactionId,
	options,
}: {
	chain: BlockchairTransactionInfinitableChain
	transactionId: string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, {
		transaction: BlockchairTransaction
		inputs?: BlockchairBitcoinLikeTransactionDashboard['inputs']
		outputs?: BlockchairBitcoinLikeTransactionDashboard['outputs']
		calls?: BlockchairEthereumLikeTransactionDashboard['calls']
	}>>>({
		path: `/${chain}/dashboards/transaction/${pathIdentifier(transactionId)}`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/address/{address}`.
 */
export const getBlockchairBitcoinLikeAddressDashboard = ({
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
 * Compatibility wrapper for dashboard address reads on Bitcoin-like or Ethereum-like chains.
 */
export const getBlockchairAddress = ({
	chain,
	address,
	options,
}: {
	chain: BlockchairAddressInfinitableChain
	address: string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, {
		address: BlockchairAddress
		transactions?: string[] | BlockchairTransaction[]
	}>>>({
		path: `/${chain}/dashboards/address/${pathIdentifier(address)}`,
		options,
	})
)

/**
 * `GET /{btc_chain}/dashboards/addresses/{address0},{address1}`.
 */
export const getBlockchairBitcoinLikeAddressesDashboard = ({
	chain,
	addresses,
	params,
	options,
}: {
	chain: BlockchairBitcoinLikeChain
	addresses: readonly string[]
	params?: BlockchairAddressDashboardParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairBitcoinLikeAddressDashboard>>>({
		path: `/${chain}/dashboards/addresses/${commaPathIdentifiers(addresses)}`,
		searchParams: bitcoinLikeAddressSearchParams(params),
		options,
	})
)

/**
 * `GET /{eth_chain}/dashboards/block/{height|hash}`.
 */
export const getBlockchairEthereumLikeBlockDashboard = ({
	chain,
	block,
	options,
}: {
	chain: BlockchairEthereumLikeChain
	block: bigint | number | string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairEthereumLikeBlockDashboard>>>({
		path: `/${chain}/dashboards/block/${pathIdentifier(block)}`,
		options,
	})
)

/**
 * `GET /{eth_chain}/dashboards/transaction/{hash}`.
 */
export const getBlockchairEthereumLikeTransactionDashboard = ({
	chain,
	transactionHash,
	params,
	options,
}: {
	chain: BlockchairEthereumLikeChain
	transactionHash: string
	params?: BlockchairEthereumTransactionDashboardParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairEthereumLikeTransactionDashboard>>>({
		path: `/${chain}/dashboards/transaction/${pathIdentifier(transactionHash)}`,
		searchParams: ethereumTransactionSearchParams(params),
		options,
	})
)

/**
 * `GET /{eth_chain}/dashboards/address/{address}`.
 */
export const getBlockchairEthereumLikeAddressDashboard = ({
	chain,
	address,
	params,
	options,
}: {
	chain: BlockchairEthereumLikeChain
	address: string
	params?: BlockchairEthereumAddressDashboardParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, BlockchairEthereumLikeAddressDashboard>>>({
		path: `/${chain}/dashboards/address/${pathIdentifier(address)}`,
		searchParams: ethereumAddressSearchParams(params),
		options,
	})
)

/**
 * `GET /{chain}/raw/block/{height|hash}` — native node payload where Blockchair exposes block raw data.
 */
export const getBlockchairRawBlock = <_RawBlock extends JsonValue = JsonValue>({
	chain,
	block,
	options,
}: {
	chain: BlockchairRawBlockChain
	block: bigint | number | string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, _RawBlock>>>({
		path: `/${chain}/raw/block/${pathIdentifier(block)}`,
		options,
	})
)

/**
 * `GET /{chain}/raw/transaction/{hash}` — native node payload where Blockchair exposes transaction raw data.
 */
export const getBlockchairRawTransaction = <
	_RawTransaction extends JsonValue = JsonValue,
>({
	chain,
	transactionHash,
	options,
}: {
	chain: BlockchairRawTransactionChain
	transactionHash: string
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<Record<string, _RawTransaction>>>({
		path: `/${chain}/raw/transaction/${pathIdentifier(transactionHash)}`,
		options,
	})
)

/**
 * `GET /{chain}/blocks` — Blockchair infinitable table; supports `q`, `s`, `a`,
 * `limit`, and `offset` through `params`.
 */
export const getBlockchairBlocks = <_Block = BlockchairBitcoinLikeBlock | BlockchairEthereumLikeBlock>({
	chain,
	params,
	options,
}: {
	chain: BlockchairBlockInfinitableChain
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
export const getBlockchairTransactions = <
	_Transaction = BlockchairBitcoinLikeTransaction | BlockchairEthereumLikeTransaction,
>({
	chain,
	params,
	options,
}: {
	chain: BlockchairTransactionInfinitableChain
	params?: BlockchairInfinitableParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<_Transaction[]>>({
		path: `/${chain}/transactions`,
		searchParams: infinitableSearchParams(params),
		options,
	})
)

/**
 * `GET /{chain}/addresses` — Blockchair infinitable address view; supports `q`,
 * `s`, `a`, `limit`, and `offset` through `params`.
 */
export const getBlockchairAddresses = <
	_Address = BlockchairBitcoinLikeAddress | BlockchairEthereumLikeAddress,
>({
	chain,
	params,
	options,
}: {
	chain: BlockchairAddressInfinitableChain
	params?: BlockchairInfinitableParams
	options?: BlockchairRequestOptions
}) => (
	getBlockchairJson<BlockchairResponse<_Address[]>>({
		path: `/${chain}/addresses`,
		searchParams: infinitableSearchParams(params),
		options,
	})
)
