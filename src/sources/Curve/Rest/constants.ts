/**
 * Curve Finance platform / registry catalog (from official Curve API `getPlatforms`).
 * @see https://api.curve.finance/v1/documentation/
 * @see https://api.curve.finance/v1/getPlatforms
 */


// Types


type CurvePlatform = {
	blockchainId: string
	chainId: number
	registries: readonly string[]
}


type CurvePoolCatalogEntry = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
	name: string
	symbol: string
}


// Constants


/**
 * Curve API blockchainId → EIP-155 chain id + registries.
 * Snapshot of `GET /v1/getPlatforms` `data.platforms` + `platformToChainIdMap`.
 */
export const curvePlatforms = [
	{
		blockchainId: 'ethereum',
		chainId: 1,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-crypto',
			'factory-crvusd',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'optimism',
		chainId: 10,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'bsc',
		chainId: 56,
		registries: [
			'factory',
			'factory-crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'xdai',
		chainId: 100,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'polygon',
		chainId: 137,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'sonic',
		chainId: 146,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'x-layer',
		chainId: 196,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'fantom',
		chainId: 250,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-crypto',
			'factory-twocrypto',
			'factory-eywa',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'fraxtal',
		chainId: 252,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'zksync',
		chainId: 324,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'hyperliquid',
		chainId: 999,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'zkevm',
		chainId: 1101,
		registries: [
			'factory',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'moonbeam',
		chainId: 1284,
		registries: [
			'main',
			'factory',
		],
	},
	{
		blockchainId: 'kava',
		chainId: 2222,
		registries: [
			'main',
			'factory',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'mantle',
		chainId: 5000,
		registries: [
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'base',
		chainId: 8453,
		registries: [
			'factory',
			'factory-crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'arbitrum',
		chainId: 42161,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'celo',
		chainId: 42220,
		registries: [
			'factory',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'avalanche',
		chainId: 43114,
		registries: [
			'main',
			'factory',
			'crypto',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'aurora',
		chainId: 1313161555,
		registries: [
			'main',
			'factory-twocrypto',
			'factory-tricrypto',
			'factory-stable-ng',
		],
	},
	{
		blockchainId: 'harmony',
		chainId: 1666600000,
		registries: [
			'main',
			'crypto',
		],
	},
] as const satisfies readonly CurvePlatform[]


/**
 * Seed Curve pools for protocol-native catalog / tests (not a full indexer).
 * Addresses match Curve main registry / interface pool ids.
 */
export const curvePools = [
	{
		blockchainId: 'ethereum',
		chainId: 1,
		registryId: 'main',
		poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
		name: '3pool',
		symbol: '3Crv',
	},
	{
		blockchainId: 'ethereum',
		chainId: 1,
		registryId: 'main',
		poolAddress: '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
		name: 'steth',
		symbol: 'steCRV',
	},
	{
		blockchainId: 'ethereum',
		chainId: 1,
		registryId: 'main',
		poolAddress: '0xa5407eae9ba41422680e2e00537571bcc53efbfd',
		name: 'susd',
		symbol: 'crvPlain3andSUSD',
	},
	{
		blockchainId: 'arbitrum',
		chainId: 42161,
		registryId: 'main',
		poolAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
		name: '2pool',
		symbol: '2CRV',
	},
] as const satisfies readonly CurvePoolCatalogEntry[]


// Lookups


export const curvePlatformByBlockchainId = Object.fromEntries(
	curvePlatforms.map((platform) => [
		platform.blockchainId,
		platform,
	])
)


export const curvePlatformByChainId = Object.fromEntries(
	curvePlatforms.map((platform) => [
		platform.chainId,
		platform,
	])
)


export const curvePoolByChainIdAndAddress = Object.fromEntries(
	curvePools.map((pool) => [
		`${pool.chainId}:${pool.poolAddress}`,
		pool,
	])
)
