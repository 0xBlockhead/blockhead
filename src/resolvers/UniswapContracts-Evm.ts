import { networks } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


const ERC721_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as const


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

		defineResolver({
			entityType: EntityType.UniswapV3Pool,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({ $network, poolAddress }, context) => {
						const {
							uniswapV3DeploymentByChainId,
							uniswapV3PoolByChainIdAndAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							getFactoryPool,
							getPosition,
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')
						const chainId = chainIdFromNetwork($network)
						const address = normalizeUniswapAddress(poolAddress)
						const catalogEntry = uniswapV3PoolByChainIdAndAddress[`${chainId}:${address}`]
						if (catalogEntry == null)
							throw new Error(`UniswapContracts_Evm: pool ${address} not in Uniswap V3 catalog for chain ${String(chainId)}`)
						const factoryAddress = uniswapV3DeploymentByChainId[chainId]?.factoryAddress
						const positionManager = uniswapV3DeploymentByChainId[chainId]?.nonfungiblePositionManagerAddress
						if (factoryAddress == null || positionManager == null)
							throw new Error(`UniswapContracts_Evm: no Uniswap V3 deployment for chain ${String(chainId)}`)

						const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
						if (voltaireTransports.length === 0)
							throw new Error(`UniswapContracts_Evm: no JSON-RPC URL for UniswapV3Pool.$$positions on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const transport of voltaireTransports) {
							try {
								const logs = await transport.getLogs({
									address: positionManager,
									topic0: ERC721_TRANSFER_TOPIC,
								})
								const tokenIds = new Map<bigint, boolean>()
								for (const log of logs) {
									const topics = log.topics ?? []
									const tokenIdHex = topics.at(3)
									if (tokenIdHex == null) continue
									const tokenId = (() => {
										try {
											return BigInt(tokenIdHex)
										} catch {
											return undefined
										}
									})()
									if (tokenId == null || tokenId < 0n) continue
									const recipient = topics.at(2)
									tokenIds.set(tokenId, recipient != null && normalizeUniswapAddress(`0x${recipient.slice(-40)}`) !== '0x0000000000000000000000000000000000000000')
								}

								const positions = []
								for (const [tokenId, active] of tokenIds) {
									if (!active) continue
									const position = await getPosition({
										getCall: transport.getCall,
										positionManager,
										tokenId,
									})
									const positionPool = await getFactoryPool({
										getCall: transport.getCall,
										factoryAddress,
										token0: position.token0,
										token1: position.token1,
										fee: position.fee,
									})
									if (normalizeUniswapAddress(positionPool) !== address) continue
									positions.push({
										[EntityMetaKey.Selector]: {
											positionManager,
											tokenId,
										},
									})
									if (positions.length >= resolverContextRowLimit(context)) break
								}
								return {
									$$positions: positions,
								}
							} catch (error) {
								errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
							}
						}
						throw new Error(`UniswapContracts_Evm: all position log endpoints failed for pool ${address} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
					},
				},
			},
		})({
			$$positions: {
				select: (entity) => entity.$$positions,
				resolveCount: (entity) => entity.$$positions.length,
			},
		})
	],
}
