/**
 * Chains this client treats as Etherscan V2–capable (numeric **`chainid`** must match supported chains).
 * Derived maps are the public contract; extend this array when adding chains.
 */
export const supportedChains = [
	{ chainId: 1 },
	{ chainId: 10 },
	{ chainId: 11155111 },
	{ chainId: 42161 },
	{ chainId: 421614 },
	{ chainId: 8453 },
	{ chainId: 84532 },
	{ chainId: 137 },
	{ chainId: 80002 },
	{ chainId: 43114 },
	{ chainId: 43113 },
	{ chainId: 42220 },
	{ chainId: 534352 },
	{ chainId: 59144 },
] as const satisfies readonly { chainId: number }[]

export const supportedChainIds: readonly number[] = supportedChains.map((r) => r.chainId)

export const supportedByChainId: Readonly<Record<number, true>> = supportedChainIds.reduce(
	(acc, chainId) => (
		{
			...acc,
			[chainId]: true,
		}
	),
	{} as Record<number, true>
)
