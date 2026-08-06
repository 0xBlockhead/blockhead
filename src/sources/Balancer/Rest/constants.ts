/**
 * Balancer API chain catalog + Vault deployments.
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/balancer-api.html
 * @see https://github.com/balancer/balancer-deployments (v2 `20210418-vault`, v3 `20241204-v3-vault`)
 */


// Types


type BalancerChain = {
	chainId: number
	name: string
	gqlChain: string
	vaultV2: `0x${string}`
	vaultV3?: `0x${string}`
}


// Constants


/** Shared Balancer V2 Vault across documented EIP-155 networks. */
const vaultV2 = '0xba12222222228d8ba445958a75a0704d566bf2c8' as const

/** Shared Balancer V3 Vault across documented EIP-155 networks. */
const vaultV3 = '0xba1333333333a1ba1108e8412f11850a5c319ba9' as const

/** Chains exposed by `GqlChain` on https://api-v3.balancer.fi with known Vault deployments. */
export const balancerChains = [
	{
		chainId: 1,
		name: 'Ethereum',
		gqlChain: 'MAINNET',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 10,
		name: 'Optimism',
		gqlChain: 'OPTIMISM',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 100,
		name: 'Gnosis',
		gqlChain: 'GNOSIS',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 137,
		name: 'Polygon',
		gqlChain: 'POLYGON',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 8453,
		name: 'Base',
		gqlChain: 'BASE',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 42161,
		name: 'Arbitrum',
		gqlChain: 'ARBITRUM',
		vaultV2,
		vaultV3,
	},
	{
		chainId: 43114,
		name: 'Avalanche',
		gqlChain: 'AVALANCHE',
		vaultV2,
		vaultV3,
	},
] as const satisfies readonly BalancerChain[]

/** V2 pool id is bytes32; V3 pool id is the pool contract address. */
export const balancerPoolIdPattern = /^0x[0-9a-fA-F]{40}([0-9a-fA-F]{24})?$/

/** Bounded page size for the Balancer `poolGetPools` list operation. */
export const balancerPoolListDefaultLimit = 16
export const balancerPoolListMaxLimit = 100

/** Bounded page size for the Balancer `poolEvents` list operation. */
export const balancerPoolEventListDefaultLimit = 16
export const balancerPoolEventListMaxLimit = 100


// Lookups


export const balancerChainByChainId = Object.fromEntries(
	balancerChains.map((chain) => [
		chain.chainId,
		chain,
	])
)
