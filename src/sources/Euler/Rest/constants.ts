/**
 * Euler EVK deployment catalog (Euler Data v3 `/v3/chains`).
 * @see https://docs.euler.finance/developers/data-querying/euler-v3-api
 * @see https://v3.euler.finance/v3/chains
 */


// Types


type EulerEvkChain = {
	chainId: number
	name: string
}


// Constants


/** Supported EIP-155 chains with active EVK vault indexing. */
export const eulerEvkChains = [
	{
		chainId: 1,
		name: 'ethereum',
	},
	{
		chainId: 42161,
		name: 'arbitrum',
	},
	{
		chainId: 8453,
		name: 'base',
	},
	{
		chainId: 137,
		name: 'polygon',
	},
	{
		chainId: 143,
		name: 'monad',
	},
	{
		chainId: 999,
		name: 'hyperevm',
	},
	{
		chainId: 56,
		name: 'bsc',
	},
	{
		chainId: 130,
		name: 'unichain',
	},
	{
		chainId: 9745,
		name: 'plasma',
	},
	{
		chainId: 43114,
		name: 'avalanche',
	},
	{
		chainId: 59144,
		name: 'linea',
	},
] as const satisfies readonly EulerEvkChain[]

/** Default page size for `GET /v3/evk/vaults`. */
export const eulerVaultListDefaultLimit = 100

/** Maximum page size accepted by Euler Data v3 vault list. */
export const eulerVaultListMaxLimit = 1000


// Lookups


export const eulerEvkByChainId = Object.fromEntries(
	eulerEvkChains.map((chain) => [
		chain.chainId,
		chain,
	])
)
