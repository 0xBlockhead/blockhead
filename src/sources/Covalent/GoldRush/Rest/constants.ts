/**
 * GoldRush Foundational API chain path segments (`{chainName}`).
 * @see https://goldrush.dev/docs/networks
 */

// Constants

const goldRushChains = [
	{ chainId: 1, chainName: 'eth-mainnet' },
	{ chainId: 10, chainName: 'optimism-mainnet' },
	{ chainId: 56, chainName: 'bsc-mainnet' },
	{ chainId: 100, chainName: 'gnosis-mainnet' },
	{ chainId: 137, chainName: 'matic-mainnet' },
	{ chainId: 250, chainName: 'fantom-mainnet' },
	{ chainId: 324, chainName: 'zksync-mainnet' },
	{ chainId: 1101, chainName: 'polygon-zkevm-mainnet' },
	{ chainId: 5000, chainName: 'mantle-mainnet' },
	{ chainId: 8453, chainName: 'base-mainnet' },
	{ chainId: 42161, chainName: 'arbitrum-mainnet' },
	{ chainId: 42220, chainName: 'celo-mainnet' },
	{ chainId: 43114, chainName: 'avalanche-mainnet' },
	{ chainId: 59144, chainName: 'linea-mainnet' },
	{ chainId: 81457, chainName: 'blast-mainnet' },
	{ chainId: 534352, chainName: 'scroll-mainnet' },
] as const satisfies readonly {
	chainId: number
	chainName: string
}[]


// Lookups

/** EIP-155 `chainId` → GoldRush `{chainName}` path segment. */
export const goldRushChainNameByChainId = Object.fromEntries(
	goldRushChains.map((row) => [
		row.chainId,
		row.chainName,
	])
)
