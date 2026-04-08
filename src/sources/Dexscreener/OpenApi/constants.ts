export const dexscreenerApiBaseUrl = 'https://api.dexscreener.com'

const dexscreenerChains = [
	{ chainId: 1, dexscreenerChainId: 'ethereum' },
	{ chainId: 10, dexscreenerChainId: 'optimism' },
	{ chainId: 56, dexscreenerChainId: 'bsc' },
	{ chainId: 137, dexscreenerChainId: 'polygon' },
	{ chainId: 8453, dexscreenerChainId: 'base' },
	{ chainId: 42161, dexscreenerChainId: 'arbitrum' },
	{ chainId: 43114, dexscreenerChainId: 'avalanche' },
] as const satisfies readonly {
	chainId: number
	dexscreenerChainId: string
}[]

export const dexscreenerChainIdByChainId = Object.fromEntries(
	dexscreenerChains
		.map((entry) => [
			entry.chainId,
			entry.dexscreenerChainId,
		]),
) as Partial<Record<number, string>>
