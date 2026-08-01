const chains = [
	{ chainId: 1, apiChainId: 'ethereum' },
	{ chainId: 10, apiChainId: 'optimism' },
	{ chainId: 56, apiChainId: 'bsc' },
	{ chainId: 137, apiChainId: 'polygon' },
	{ chainId: 8453, apiChainId: 'base' },
	{ chainId: 42161, apiChainId: 'arbitrum' },
	{ chainId: 43114, apiChainId: 'avalanche' },
] as const satisfies readonly {
	chainId: number
	apiChainId: string
}[]

/** Dexscreener `{chainId}` path segment → EVM **`chainId`**. */
export const apiChainIdByChainId: Partial<Record<number, string>> = Object.fromEntries(
	chains
		.map((entry) => [
			entry.chainId,
			entry.apiChainId,
		])
)

/** **`pair.chainId`** string from search → numeric `chainId` when supported by this transport. */
export const numericChainIdByDexscreenerApiChainLabel: Partial<Record<string, number>> = Object.fromEntries(
	chains.map((entry) => [
		entry.apiChainId,
		entry.chainId,
	])
)
