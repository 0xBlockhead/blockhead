/**
 * Chains this client treats as Etherscan V2–capable (numeric **`chainid`** must match supported chains).
 * Derived maps are the public contract; extend this array when adding chains.
 */
export const supportedChainIds = [
	1,
	10,
	11155111,
	42161,
	421614,
	8453,
	84532,
	137,
	80002,
	43114,
	43113,
	42220,
	534352,
	59144,
] as const
