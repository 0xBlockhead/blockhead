import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import bindings from '$/sources/Uniswap/bindings.ts'
import { Source } from '$/sources/Source.ts'


/**
 * Official Uniswap V3 factory + NonfungiblePositionManager deployments.
 * Addresses are chain-specific — do not assume CREATE2 parity across networks.
 * @see https://developers.uniswap.org/docs/protocols/v3/deployments
 * @see https://developers.uniswap.org/deployments.json
 */
export const uniswapV3Deployments = [
	{
		chainId: 1,
		factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
		nonfungiblePositionManagerAddress: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
	},
	{
		chainId: 10,
		factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
		nonfungiblePositionManagerAddress: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
	},
	{
		chainId: 56,
		factoryAddress: '0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7',
		nonfungiblePositionManagerAddress: '0x7b8a01b39d58278b5de7e48c8449c9f4f5170613',
	},
	{
		chainId: 137,
		factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
		nonfungiblePositionManagerAddress: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
	},
	{
		chainId: 8453,
		factoryAddress: '0x33128a8fc17869897dce68ed026d694621f6fdfd',
		nonfungiblePositionManagerAddress: '0x03a520b32c04bf3beef7beb72e919cf822ed34f1',
	},
	{
		chainId: 42161,
		factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
		nonfungiblePositionManagerAddress: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
	},
	{
		chainId: 42220,
		factoryAddress: '0xafe208a311b21f13ef87e33a90049fc17a7acdec',
		nonfungiblePositionManagerAddress: '0x3d79edaabc0eab6f08ed885c05fc0b014290d95a',
	},
	{
		chainId: 43114,
		factoryAddress: '0x740b1c1de25031c31ff4fc9a62f554a55cdc1bad',
		nonfungiblePositionManagerAddress: '0x655c406ebfa14ee2006250925e54ec43ad184f8b',
	},
] as const


export type UniswapV3Deployment = (typeof uniswapV3Deployments)[number]


/**
 * Canonical V3 fee tiers → tick spacing (Uniswap V3 whitepaper / docs).
 */
export const uniswapV3FeeTiers = [
	{
		fee: 100,
		tickSpacing: 1,
	},
	{
		fee: 500,
		tickSpacing: 10,
	},
	{
		fee: 3000,
		tickSpacing: 60,
	},
	{
		fee: 10000,
		tickSpacing: 200,
	},
] as const


export const uniswapV3TickSpacingByFee = Object.fromEntries(
	uniswapV3FeeTiers.map((tier) => [
		tier.fee,
		tier.tickSpacing,
	])
)


export const uniswapV3DeploymentByChainId = Object.fromEntries(
	uniswapV3Deployments.map((deployment) => [
		deployment.chainId,
		deployment,
	])
)


/**
 * Seed Uniswap V3 pools for the global hub (protocol-native catalog, not an indexer).
 * Addresses are the canonical CREATE2 deployments used by the Uniswap interface.
 * token0/token1 are sorted by address as on-chain; tickSpacing matches the fee tier.
 */
export const uniswapV3Pools = [
	{
		chainId: 1,
		poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		fee: 500,
		tickSpacing: 10,
	},
	{
		chainId: 1,
		poolAddress: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
		token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		fee: 3000,
		tickSpacing: 60,
	},
	{
		chainId: 1,
		poolAddress: '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
		token0: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		fee: 3000,
		tickSpacing: 60,
	},
	{
		chainId: 1,
		poolAddress: '0x11b815efb8f581194ae79006d24e0d814b7697f6',
		token0: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		token1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		fee: 500,
		tickSpacing: 10,
	},
	{
		chainId: 1,
		poolAddress: '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8',
		token0: '0x6b175474e89094c44da98b954eedeac495271d0f',
		token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		fee: 3000,
		tickSpacing: 60,
	},
	{
		chainId: 1,
		poolAddress: '0x3416cf6c708da44db2624d63ea0aaef7113527c6',
		token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		token1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		fee: 100,
		tickSpacing: 1,
	},
	{
		chainId: 8453,
		poolAddress: '0xd0b53d9277642d899dd5c92cfd4e0a7d3a6a6c3b',
		token0: '0x4200000000000000000000000000000000000006',
		token1: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
		fee: 500,
		tickSpacing: 10,
	},
	{
		chainId: 42161,
		poolAddress: '0xc6962004f452be9203591991d15f6b388e09e8d0',
		token0: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
		token1: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
		fee: 500,
		tickSpacing: 10,
	},
	{
		chainId: 10,
		poolAddress: '0x85149247691df622eaf1a8bd0cafd40bc45154a9',
		token0: '0x4200000000000000000000000000000000000006',
		token1: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
		fee: 500,
		tickSpacing: 10,
	},
	{
		chainId: 137,
		poolAddress: '0x45dda9cb7c25131df268515131f647d726f50608',
		token0: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
		token1: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
		fee: 500,
		tickSpacing: 10,
	},
] as const


export type UniswapV3PoolCatalogEntry = (typeof uniswapV3Pools)[number]


export const uniswapV3PoolByChainIdAndAddress = Object.fromEntries(
	uniswapV3Pools.map((pool) => [
		`${pool.chainId}:${pool.poolAddress}`,
		pool,
	])
)


export const getCatalogRows = () => (
	catalogRowsRequest(bindings[Source.UniswapContracts_Evm][0])
)


export const getUniswapV3PoolCatalogEntry = (
	chainId: number,
	poolAddress: `0x${string}`
) => (
	uniswapV3PoolByChainIdAndAddress[`${chainId}:${zeroExLowerCase(poolAddress)}`] as UniswapV3PoolCatalogEntry | undefined
)


export const getUniswapV3TickSpacingForFee = (
	fee: number
) => (
	uniswapV3TickSpacingByFee[fee]
)


export const getUniswapV3Deployment = (
	chainId: number
) => (
	uniswapV3DeploymentByChainId[chainId]
)


export const getUniswapV3FactoryAddress = (
	chainId: number
) => (
	getUniswapV3Deployment(chainId)?.factoryAddress
)


export const getUniswapV3NonfungiblePositionManagerAddress = (
	chainId: number
) => (
	getUniswapV3Deployment(chainId)?.nonfungiblePositionManagerAddress
)


export const chainIdsForUniswapV3NonfungiblePositionManager = (
	positionManagerAddress: `0x${string}`
) => {
	const normalized = zeroExLowerCase(positionManagerAddress)
	return uniswapV3Deployments
		.filter((deployment) => (
			deployment.nonfungiblePositionManagerAddress === normalized
		))
		.map((deployment) => deployment.chainId)
}
