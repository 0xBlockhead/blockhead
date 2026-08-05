// Types


type MorphoGraphqlNetwork = {
	chainId: number
	name: string
}


// Constants


/** Networks with a Morpho GraphQL deployment. */
export const morphoGraphqlNetworks = [
	{
		chainId: 1,
		name: 'Ethereum',
	},
	{
		chainId: 10,
		name: 'OP Mainnet',
	},
	{
		chainId: 130,
		name: 'Unichain',
	},
	{
		chainId: 137,
		name: 'Polygon',
	},
	{
		chainId: 143,
		name: 'Monad',
	},
	{
		chainId: 480,
		name: 'World Chain',
	},
	{
		chainId: 988,
		name: 'Stable',
	},
	{
		chainId: 999,
		name: 'HyperEVM',
	},
	{
		chainId: 4217,
		name: 'Tempo',
	},
	{
		chainId: 4663,
		name: 'Robinhood Chain',
	},
	{
		chainId: 8453,
		name: 'Base',
	},
	{
		chainId: 42161,
		name: 'Arbitrum',
	},
	{
		chainId: 747474,
		name: 'Katana',
	},
] as const satisfies readonly MorphoGraphqlNetwork[]

/** Morpho's documented default market page size. */
export const morphoMarketPageLimit = 100

/** Morpho Blue market id (bytes32). */
export const morphoMarketIdPattern = /^0x[0-9a-fA-F]{64}$/


// Lookups


export const morphoGraphqlNetworkByChainId = Object.fromEntries(
	morphoGraphqlNetworks.map((network) => [
		network.chainId,
		network,
	])
)
