/**
 * Compound III Comet deployment catalog (official comet repo deployments/).
 * @see https://docs.compound.finance/
 * @see https://github.com/compound-finance/comet/tree/main/deployments
 */


// Types


type CompoundNetwork = {
	networkSlug: string
	chainId: number
	name: string
}

type CompoundCometDeployment = {
	networkSlug: string
	marketSlug: string
	chainId: number
	cometAddress: `0x${string}`
}


// Constants


/** Compound III deployment network folders under `deployments/`. */
export const compoundNetworks = [
	{
		networkSlug: 'mainnet',
		chainId: 1,
		name: 'Ethereum',
	},
	{
		networkSlug: 'base',
		chainId: 8453,
		name: 'Base',
	},
	{
		networkSlug: 'arbitrum',
		chainId: 42161,
		name: 'Arbitrum',
	},
	{
		networkSlug: 'optimism',
		chainId: 10,
		name: 'Optimism',
	},
	{
		networkSlug: 'polygon',
		chainId: 137,
		name: 'Polygon',
	},
	{
		networkSlug: 'scroll',
		chainId: 534352,
		name: 'Scroll',
	},
	{
		networkSlug: 'linea',
		chainId: 59144,
		name: 'Linea',
	},
	{
		networkSlug: 'mantle',
		chainId: 5000,
		name: 'Mantle',
	},
	{
		networkSlug: 'unichain',
		chainId: 130,
		name: 'Unichain',
	},
	{
		networkSlug: 'ronin',
		chainId: 2020,
		name: 'Ronin',
	},
] as const satisfies readonly CompoundNetwork[]

/** Known Comet proxy deployments from official `roots.json` artifacts. */
export const compoundCometDeployments = [
	{
		networkSlug: 'arbitrum',
		marketSlug: 'usdc.e',
		chainId: 42161,
		cometAddress: '0xa5edbdd9646f8dff606d7448e414884c7d905dca',
	},
	{
		networkSlug: 'arbitrum',
		marketSlug: 'usdc',
		chainId: 42161,
		cometAddress: '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
	},
	{
		networkSlug: 'arbitrum',
		marketSlug: 'usdt',
		chainId: 42161,
		cometAddress: '0xd98be00b5d27fc98112bde293e487f8d4ca57d07',
	},
	{
		networkSlug: 'arbitrum',
		marketSlug: 'weth',
		chainId: 42161,
		cometAddress: '0x6f7d514bbd4aff3bcd1140b7344b32f063dee486',
	},
	{
		networkSlug: 'base',
		marketSlug: 'aero',
		chainId: 8453,
		cometAddress: '0x784efeb622244d2348d4f2522f8860b96fbece89',
	},
	{
		networkSlug: 'base',
		marketSlug: 'usdbc',
		chainId: 8453,
		cometAddress: '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
	},
	{
		networkSlug: 'base',
		marketSlug: 'usdc',
		chainId: 8453,
		cometAddress: '0xb125e6687d4313864e53df431d5425969c15eb2f',
	},
	{
		networkSlug: 'base',
		marketSlug: 'usds',
		chainId: 8453,
		cometAddress: '0x2c776041ccfe903071af44aa147368a9c8eea518',
	},
	{
		networkSlug: 'base',
		marketSlug: 'weth',
		chainId: 8453,
		cometAddress: '0x46e6b214b524310239732d51387075e0e70970bf',
	},
	{
		networkSlug: 'linea',
		marketSlug: 'usdc',
		chainId: 59144,
		cometAddress: '0x8d38a3d6b3c3b7d96d6536da7eef94a9d7dbc991',
	},
	{
		networkSlug: 'linea',
		marketSlug: 'weth',
		chainId: 59144,
		cometAddress: '0x60f2058379716a64a7a5d29219397e79bc552194',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'usdc',
		chainId: 1,
		cometAddress: '0xc3d688b66703497daa19211eedff47f25384cdc3',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'usds',
		chainId: 1,
		cometAddress: '0x5d409e56d886231adaf00c8775665ad0f9897b56',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'usdt',
		chainId: 1,
		cometAddress: '0x3afdc9bca9213a35503b077a6072f3d0d5ab0840',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'wbtc',
		chainId: 1,
		cometAddress: '0xe85dc543813b8c2cfeaac371517b925a166a9293',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'weth',
		chainId: 1,
		cometAddress: '0xa17581a9e3356d9a858b789d68b4d866e593ae94',
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'wsteth',
		chainId: 1,
		cometAddress: '0x3d0bb1ccab520a66e607822fc55bc921738fafe3',
	},
	{
		networkSlug: 'mantle',
		marketSlug: 'usde',
		chainId: 5000,
		cometAddress: '0x606174f62cd968d8e684c645080fa694c1d7786e',
	},
	{
		networkSlug: 'optimism',
		marketSlug: 'usdc',
		chainId: 10,
		cometAddress: '0x2e44e174f7d53f0212823acc11c01a11d58c5bcb',
	},
	{
		networkSlug: 'optimism',
		marketSlug: 'usdt',
		chainId: 10,
		cometAddress: '0x995e394b8b2437ac8ce61ee0bc610d617962b214',
	},
	{
		networkSlug: 'optimism',
		marketSlug: 'weth',
		chainId: 10,
		cometAddress: '0xe36a30d249f7761327fd973001a32010b521b6fd',
	},
	{
		networkSlug: 'polygon',
		marketSlug: 'usdc',
		chainId: 137,
		cometAddress: '0xf25212e676d1f7f89cd72ffee66158f541246445',
	},
	{
		networkSlug: 'polygon',
		marketSlug: 'usdt',
		chainId: 137,
		cometAddress: '0xaeb318360f27748acb200ce616e389a6c9409a07',
	},
	{
		networkSlug: 'ronin',
		marketSlug: 'weth',
		chainId: 2020,
		cometAddress: '0x4006ed4097ee51c09a04c3b0951d28ccf19e6dfe',
	},
	{
		networkSlug: 'ronin',
		marketSlug: 'wron',
		chainId: 2020,
		cometAddress: '0xc0afdbd1ceb621ef576ba969ce9d4cef78dbc0c0',
	},
	{
		networkSlug: 'scroll',
		marketSlug: 'usdc',
		chainId: 534352,
		cometAddress: '0xb2f97c1bd3bf02f5e74d13f02e3e26f93d77ce44',
	},
	{
		networkSlug: 'unichain',
		marketSlug: 'usdc',
		chainId: 130,
		cometAddress: '0x2c7118c4c88b9841fcf839074c26ae8f035f2921',
	},
	{
		networkSlug: 'unichain',
		marketSlug: 'weth',
		chainId: 130,
		cometAddress: '0x6c987dde50db1dcdd32cd4175778c2a291978e2a',
	},
] as const satisfies readonly CompoundCometDeployment[]


// Lookups


export const compoundNetworkByChainId = Object.fromEntries(
	compoundNetworks.map((network) => [
		network.chainId,
		network,
	])
)

export const compoundNetworkBySlug = Object.fromEntries(
	compoundNetworks.map((network) => [
		network.networkSlug,
		network,
	])
)

export const compoundCometByChainIdAndAddress = Object.fromEntries(
	compoundCometDeployments.map((deployment) => [
		`${String(deployment.chainId)}:${deployment.cometAddress}`,
		deployment,
	])
)

export const compoundCometsByChainId = Object.groupBy(
	compoundCometDeployments,
	(deployment) => deployment.chainId
)
