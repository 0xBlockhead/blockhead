const chains = [
	{ chainId: 1, apiChain: 'ethereum' },
	{ chainId: 10, apiChain: 'optimism' },
	{ chainId: 56, apiChain: 'bsc' },
	{ chainId: 137, apiChain: 'polygon' },
	{ chainId: 8453, apiChain: 'base' },
	{ chainId: 42161, apiChain: 'arbitrum' },
	{ chainId: 43114, apiChain: 'avalanche' },
] as const satisfies readonly {
	chainId: number
	apiChain: string
}[]

/** Allium path segment `{chain}` → EVM **`chainId`**. */
export const apiChainByChainId = Object.fromEntries(
	chains
		.map((entry) => [
			entry.chainId,
			entry.apiChain,
		])
)
