/**
 * GoldRush Foundational API chain path segments (`{chainName}`).
 * @see https://goldrush.dev/docs/networks
 */

// Constants

const goldRushChains = [
	{
		chainId: 1,
		chainName: 'eth-mainnet',
	},
	{
		chainId: 10,
		chainName: 'optimism-mainnet',
	},
	{
		chainId: 137,
		chainName: 'matic-mainnet',
	},
	{
		chainId: 8453,
		chainName: 'base-mainnet',
	},
	{
		chainId: 42161,
		chainName: 'arbitrum-mainnet',
	},
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
