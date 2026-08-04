import { networks } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>


const chainIdFromNetwork = (network: NetworkId) => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			((networkRow) => (
				networkRow != null && 'caip2' in networkRow ?
					networkRow.caip2
				:
					undefined
			))(networks.find(({ slug }) => slug === network.slug))
	)
	if (caip2?.namespace !== 'eip155')
		throw new Error('UniswapContracts_Evm: network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`UniswapContracts_Evm: invalid EIP-155 chain id ${caip2.reference}`)

	return chainId
}


const evmContractRef = (
	$network: NetworkId,
	address: `0x${string}`
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		address,
	},
})


export default {
	source: Source.UniswapContracts_Evm,
	resolvers: [
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { uniswapV3Pools } = await import('$/sources/Uniswap/Catalog/constants.ts')
						return uniswapV3Pools
							.slice(0, resolverContextRowLimit(context))
							.map((pool) => ({
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: {
											namespace: 'eip155' as const,
											reference: String(pool.chainId),
										},
									},
									poolAddress: pool.poolAddress,
								},
							}))
					},
				},
			},
		})({
			$$uniswapV3Pools: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.UniswapV3Pool,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({ $network, poolAddress }) => {
						const {
							uniswapV3DeploymentByChainId,
							uniswapV3FeeTierByFee,
							uniswapV3PoolByChainIdAndAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')

						const chainId = chainIdFromNetwork($network)
						const factoryAddress = uniswapV3DeploymentByChainId[chainId]?.factoryAddress
						if (factoryAddress == null)
							throw new Error(`UniswapContracts_Evm: no Uniswap V3 factory for chain ${String(chainId)}`)

						const address = normalizeUniswapAddress(poolAddress)
						const catalogEntry = uniswapV3PoolByChainIdAndAddress[`${chainId}:${address}`]
						if (catalogEntry == null)
							throw new Error(`UniswapContracts_Evm: pool ${address} not in Uniswap V3 catalog for chain ${String(chainId)}`)

						const tickSpacing = (
							catalogEntry.tickSpacing
							?? uniswapV3FeeTierByFee[catalogEntry.fee]?.tickSpacing
						)
						if (tickSpacing == null)
							throw new Error(`UniswapContracts_Evm: no tick spacing for fee ${String(catalogEntry.fee)}`)

						return {
							$factory: evmContractRef($network, factoryAddress),
							$poolContract: evmContractRef($network, address),
							$token0: evmContractRef($network, catalogEntry.token0),
							$token1: evmContractRef($network, catalogEntry.token1),
							fee: catalogEntry.fee,
							tickSpacing,
						}
					},
				},
			},
		})({
			$factory: (entity) => entity.$factory,
			$token0: (entity) => entity.$token0,
			$token1: (entity) => entity.$token1,
			fee: (entity) => entity.fee,
			tickSpacing: (entity) => entity.tickSpacing,
			$poolContract: (entity) => entity.$poolContract,
		}),
	],
} satisfies RegisteredSourceResolverModule
