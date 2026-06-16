/**
 * Etherscan REST API V2 — single base URL; every request must include query **`chainid`**.
 *
 * @see https://docs.etherscan.io/introduction
 * @see https://docs.etherscan.io/v2-migration
 * @see https://docs.etherscan.io/supported-chains
 */

/** API host only — CORS / hooks and {@link restBaseUrl}. */
export const origin = 'https://api.etherscan.io' as const

/** Path prefix for V2 REST (after {@link origin}). */
export const restPath = '/v2/api' as const

/** Single Etherscan API V2 base; pass target network via **`chainid`** on each request. */
export const restBaseUrl = `${origin}${restPath}` as const

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
