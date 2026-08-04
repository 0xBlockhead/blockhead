/**
 * Aave V3 supported chains from the official GraphQL `chains` query.
 * @see https://aave.com/docs/aave-v3/getting-started/graphql.md
 * @see https://aave.com/docs/aave-v3/markets/data.md
 */

// Types


type AaveChain = {
	chainId: number
	name: string
}


// Constants


export const aaveChains = [
	{ chainId: 1, name: 'Ethereum' },
	{ chainId: 10, name: 'Optimism' },
	{ chainId: 56, name: 'BSC' },
	{ chainId: 100, name: 'Gnosis' },
	{ chainId: 137, name: 'Polygon' },
	{ chainId: 143, name: 'Monad' },
	{ chainId: 146, name: 'Sonic' },
	{ chainId: 196, name: 'X Layer' },
	{ chainId: 324, name: 'zkSync' },
	{ chainId: 1088, name: 'Metis' },
	{ chainId: 1868, name: 'Soneium' },
	{ chainId: 4326, name: 'MegaETH' },
	{ chainId: 5000, name: 'Mantle' },
	{ chainId: 8453, name: 'Base' },
	{ chainId: 84532, name: 'Base Sepolia' },
	{ chainId: 42161, name: 'Arbitrum' },
	{ chainId: 42220, name: 'Celo' },
	{ chainId: 43114, name: 'Avalanche' },
	{ chainId: 57073, name: 'Ink' },
	{ chainId: 59144, name: 'Linea' },
	{ chainId: 534352, name: 'Scroll' },
	{ chainId: 9745, name: 'Plasma' },
] as const satisfies readonly AaveChain[]


// Lookups


export const aaveChainByChainId = Object.fromEntries(
	aaveChains.map((chain) => [
		chain.chainId,
		chain,
	])
)
