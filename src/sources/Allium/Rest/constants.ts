export const alliumApiBaseUrl = 'https://api.allium.so'

const alliumChains = [
	{ chainId: 1, alliumChain: 'ethereum' },
	{ chainId: 10, alliumChain: 'optimism' },
	{ chainId: 56, alliumChain: 'bsc' },
	{ chainId: 137, alliumChain: 'polygon' },
	{ chainId: 8453, alliumChain: 'base' },
	{ chainId: 42161, alliumChain: 'arbitrum' },
	{ chainId: 43114, alliumChain: 'avalanche' },
] as const satisfies readonly {
	chainId: number
	alliumChain: string
}[]

export const alliumChainByChainId = Object.fromEntries(
	alliumChains
		.map((entry) => [
			entry.chainId,
			entry.alliumChain,
		]),
) as Partial<Record<number, string>>
