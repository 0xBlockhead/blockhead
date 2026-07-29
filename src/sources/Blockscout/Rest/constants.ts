// Types

import { CoinId } from '$/constants/Coin.ts'
import type { SourceOrigin } from '$/sources/SourceProviderDefinition.ts'

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
		])
)

export const blockscoutExplorerRestV2OriginByChainId = Object.fromEntries(
	blockscoutHostedNetworks
		.map((entry) => [
			entry.chainId,
			`https://${entry.host}`,
		])
)

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
export const blockscoutErc4337OperationSupport = [
	{ chainId: 1 },
	{ chainId: 10 },
	{ chainId: 56 },
	{ chainId: 100 },
	{ chainId: 137 },
	{ chainId: 8453 },
	{ chainId: 42161 },
	{ chainId: 11155111 },
	{ chainId: 84532 },
] as const satisfies readonly {
	chainId: (typeof blockscoutHostedNetworks)[number]['chainId']
}[]

export const blockscoutErc4337OperationSupportByChainId = Object.fromEntries(
	blockscoutErc4337OperationSupport
		.map((support) => [
			support.chainId,
			support,
		])
)

type BlockscoutErc4337RegistryListSupport = {
	chainId: (typeof blockscoutHostedNetworks)[number]['chainId']
}

export const blockscoutErc4337RegistryListSupport = [] as const satisfies readonly BlockscoutErc4337RegistryListSupport[]
const blockscoutErc4337RegistryListSupportEntries = [] as const satisfies readonly (readonly [number, BlockscoutErc4337RegistryListSupport])[]

/**
 * Registry leaderboard lists (`bundlers`, `paymasters`, `factories` under `blockscoutAccountAbstractionRegistryListPaths`).
 * Hosted explorers often return 5xx here, so support must be proven per chain instead of inherited from operations.
 */
export const blockscoutErc4337RegistryListSupportByChainId = Object.fromEntries(
	blockscoutErc4337RegistryListSupportEntries
)
