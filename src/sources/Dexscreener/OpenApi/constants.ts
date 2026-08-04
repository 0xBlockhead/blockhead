const chains = [
	{ chainId: 1, apiChainId: 'ethereum' },
	{ chainId: 10, apiChainId: 'optimism' },
	{ chainId: 25, apiChainId: 'cronos' },
	{ chainId: 56, apiChainId: 'bsc' },
	{ chainId: 100, apiChainId: 'gnosis' },
	{ chainId: 137, apiChainId: 'polygon' },
	{ chainId: 250, apiChainId: 'fantom' },
	{ chainId: 324, apiChainId: 'zksync' },
	{ chainId: 1088, apiChainId: 'metis' },
	{ chainId: 1101, apiChainId: 'polygonzkevm' },
	{ chainId: 1284, apiChainId: 'moonbeam' },
	{ chainId: 1285, apiChainId: 'moonriver' },
	{ chainId: 2222, apiChainId: 'kava' },
	{ chainId: 5000, apiChainId: 'mantle' },
	{ chainId: 8453, apiChainId: 'base' },
	{ chainId: 42161, apiChainId: 'arbitrum' },
	{ chainId: 42220, apiChainId: 'celo' },
	{ chainId: 43114, apiChainId: 'avalanche' },
	{ chainId: 59144, apiChainId: 'linea' },
	{ chainId: 81457, apiChainId: 'blast' },
	{ chainId: 534352, apiChainId: 'scroll' },
] as const satisfies readonly {
	chainId: number
	apiChainId: string
}[]

/** Dexscreener `{chainId}` path segment → EVM **`chainId`**. */
export const apiChainIdByChainId = Object.fromEntries(
	chains
		.map((entry) => [
			entry.chainId,
			entry.apiChainId,
		])
)

/** **`pair.chainId`** string from search → numeric `chainId` when supported by this transport. */
export const numericChainIdByDexscreenerApiChainLabel = new Map(
	chains.map((entry) => [
		entry.apiChainId,
		entry.chainId,
	])
)
