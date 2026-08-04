/**
 * Pendle V2 deployment catalog (official API chain coverage).
 * @see https://docs.pendle.finance/pendle-v2-dev/Backend/ApiOverview
 * @see https://docs.pendle.finance/pendle-v2-dev/Quickstart
 */


// Types


type PendleChainDeployment = {
	chainId: number
	name: string
}


// Constants


/** Documented EIP-155 chains returned by `GET /v2/markets/all`. */
export const pendleChainDeployments = [
	{
		chainId: 1,
		name: 'Ethereum',
	},
	{
		chainId: 10,
		name: 'Optimism',
	},
	{
		chainId: 56,
		name: 'BNB Chain',
	},
	{
		chainId: 143,
		name: 'Monad',
	},
	{
		chainId: 146,
		name: 'Sonic',
	},
	{
		chainId: 999,
		name: 'HyperEVM',
	},
	{
		chainId: 5000,
		name: 'Mantle',
	},
	{
		chainId: 8453,
		name: 'Base',
	},
	{
		chainId: 9745,
		name: 'Plume',
	},
	{
		chainId: 42161,
		name: 'Arbitrum One',
	},
	{
		chainId: 80094,
		name: 'Berachain',
	},
] as const satisfies readonly PendleChainDeployment[]

/** Default page size documented by Pendle for `GET /v2/markets/all`. */
export const pendleMarketsAllDefaultLimit = 10

/** Maximum page size documented by Pendle for `GET /v2/markets/all`. */
export const pendleMarketsAllMaxLimit = 100


// Lookups


export const pendleByChainId = Object.fromEntries(
	pendleChainDeployments.map((deployment) => [
		deployment.chainId,
		deployment,
	])
)
