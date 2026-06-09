// Types

import { CoinId } from '$/constants/Coin.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'

/**
 * Blockscout REST API v2 base path.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

/**
 * Blockscout-operated explorer hosts that expose REST v2 at `origin` + `restPath` + `…`. Labels follow
 * Blockscout featured-networks; `host` is the explorer hostname only (no scheme).
 *
 * @see https://github.com/blockscout/frontend-configs/tree/main/configs/featured-networks
 */


// Constants

export const restPath = '/api/v2'

/**
 * Inclusive maximum list size for Blockscout REST v2 pagination (clamp client limits here).
 * Standard list endpoints use query param **`items_count`** (422 above this).
 * **`/proxy/account-abstraction/*`** list routes expect **`page_size`** instead (same numeric ceiling).
 */
export const blockscoutV2ItemsCountMax = 50

/**
 * `GET {explorerOrigin}` + `restPath` + `…` is Blockscout’s own HTTP API. Other block-explorer UIs
 * (custom domains, different products) do not serve this path — use chain RPC and/or that product’s client instead.
 */
export const blockscoutRestV2AtExplorerOrigin = (explorerOrigin: string): boolean => {
	const h = new URL(explorerOrigin).hostname.toLowerCase()
	return h.endsWith('.blockscout.com') || h.endsWith('.blockscout.org')
}

export const blockscoutHostedNetworks = [
	{
		chainId: 1,
		label: 'Ethereum',
		host: 'eth.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 5,
		label: 'Goerli',
		host: 'eth-goerli.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 10,
		label: 'Optimism',
		host: 'optimism.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 56,
		label: 'BNB Smart Chain',
		host: 'bnb.blockscout.com',
		nativeCoinId: CoinId.BNB,
	},
	{
		chainId: 100,
		label: 'Gnosis Chain',
		host: 'gnosis.blockscout.com',
		nativeCoinId: CoinId.XDAI,
	},
	{
		chainId: 137,
		label: 'Polygon',
		host: 'polygon.blockscout.com',
		nativeCoinId: CoinId.POL,
	},
	{
		chainId: 8453,
		label: 'Base Chain',
		host: 'base.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 42161,
		label: 'Arbitrum One',
		host: 'arbitrum.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 11155111,
		label: 'Sepolia',
		host: 'eth-sepolia.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 17000,
		label: 'Holesky',
		host: 'eth-holesky.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
	{
		chainId: 84532,
		label: 'Base Sepolia',
		host: 'base-sepolia.blockscout.com',
		nativeCoinId: CoinId.ETH,
	},
] as const satisfies readonly {
	chainId: number
	label: string
	host: string
	nativeCoinId: CoinId
}[]

/** `/api-proxy` allow-list + `corsFetch` routing for hosted Blockscout explorers (no browser CORS). */
export const blockscoutExplorerOrigins = (
	blockscoutHostedNetworks
		.map((entry) => (
			{
				origin: `https://${entry.host}`,
				corsEnabled: false,
			}
		))
	) satisfies readonly SourceOrigin[]


// Lookups

export const blockscoutExplorerOriginByChainId: Partial<Record<number, string>> = Object.fromEntries(
	blockscoutHostedNetworks
		.map((entry) => [
			entry.chainId,
			`https://${entry.host}`,
		]),
)

export const blockscoutExplorerOriginForChain = (
	chainId: number,
): string | undefined => blockscoutExplorerOriginByChainId[chainId]

/** Same predicate Blockscout resolvers use before calling REST v2 list endpoints. */
export const blockscoutExplorerRestV2SupportedForChain = (chainId: number): boolean => {
	const origin = blockscoutExplorerOriginForChain(chainId)
	return origin != null && blockscoutRestV2AtExplorerOrigin(origin)
}

/**
 * Blockscout `/proxy/account-abstraction/*` routes on hosted explorers (`blockscoutHostedNetworks`).
 * Operations and indexed smart accounts are the reliable surfaces; registry leaderboard lists often 504.
 */
export const blockscoutAccountAbstractionOperationsPath = '/proxy/account-abstraction/operations' as const

export const blockscoutAccountAbstractionAccountsPath = '/proxy/account-abstraction/accounts' as const

export const blockscoutAccountAbstractionRegistryListPaths = [
	'/proxy/account-abstraction/bundlers',
	'/proxy/account-abstraction/paymasters',
	'/proxy/account-abstraction/factories',
] as const

/**
 * Hosted Blockscout chains where AA operations + smart-account registry routes are expected to respond.
 * Aligned with `blockscoutHostedNetworks` entries that expose account-abstraction indexing.
 */
export const blockscoutErc4337OperationsSupportedChainIds = [
	1,
	10,
	56,
	100,
	137,
	8453,
	42161,
	11155111,
	84532,
] as const satisfies readonly (typeof blockscoutHostedNetworks)[number]['chainId'][]

const blockscoutErc4337OperationsSupportedChainIdSet = new Set<number>(
	blockscoutErc4337OperationsSupportedChainIds,
)

/** `GET …/proxy/account-abstraction/operations` (+ smart-account registry) for this chain. */
export const blockscoutErc4337OperationsSupported = (chainId: number): boolean => (
	blockscoutErc4337OperationsSupportedChainIdSet.has(chainId)
)

/**
 * Registry leaderboard lists (`bundlers`, `paymasters`, `factories` under `blockscoutAccountAbstractionRegistryListPaths`).
 * Same hosted chains as operations; UI treats resolver failures as section-local (no fallback sources).
 */
export const blockscoutErc4337RegistryListsSupported = (chainId: number): boolean => (
	blockscoutErc4337OperationsSupported(chainId)
)
