export const origin = 'https://api.dexscreener.com' as const

export const baseUrl = origin

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
export const apiChainIdByChainId = Object.fromEntries(
	chains
		.map((entry) => [
			entry.chainId,
			entry.apiChainId,
		]),
) as Partial<Record<number, string>>
