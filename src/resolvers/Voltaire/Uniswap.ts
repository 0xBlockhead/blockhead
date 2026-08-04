import { networks } from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


const voltaireJsonRpcHttpTransportsByChainId = async () => (
	(await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId
)


const errorMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	:
		String(error)
)


const allJsonRpcEndpointsFailedError = (
	chainId: number,
	fieldName: string,
	errors: readonly string[]
) => (
	new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for ${fieldName} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
)


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
		throw new Error('Voltaire_JsonRpc: network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`Voltaire_JsonRpc: invalid EIP-155 chain id ${caip2.reference}`)

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


const withTransports = async <_Result>(
	chainId: number,
	fieldName: string,
	resolve: (getCall: (call: {
		to: `0x${string}`
		input: `0x${string}`
		blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
	}) => Promise<`0x${string}`>) => Promise<_Result>
) => {
	const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
	if (jsonRpcTransports.length === 0)
		throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for ${fieldName} on chain ${String(chainId)}`)

	const errors: string[] = []
	for (const jsonRpcTransport of jsonRpcTransports) {
		try {
			return await resolve((call) => (
				jsonRpcTransport.getCall({
					to: call.to,
					input: call.input,
					blockTag: call.blockTag,
				})
			))
		} catch (error) {
			errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
		}
	}
	throw allJsonRpcEndpointsFailedError(chainId, fieldName, errors)
}


export const uniswapV3Resolvers = [
	defineResolver({
		entityType: EntityType.UniswapV3Pool,
		resolve: {
			NetworkPoolAddress: {
				resolve: async ({ $network, poolAddress }) => {
					const chainId = chainIdFromNetwork($network)
					const {
						getPoolFactory,
						getPoolToken0,
						getPoolToken1,
						getPoolFee,
						getPoolTickSpacing,
						normalizeUniswapAddress,
					} = await import('$/sources/Uniswap/Contracts/queries.ts')

					const address = normalizeUniswapAddress(poolAddress)
					return withTransports(chainId, 'UniswapV3Pool', async (getCall) => {
						const [
							factoryAddress,
							token0Address,
							token1Address,
							fee,
							tickSpacing,
						] = await Promise.all([
							getPoolFactory({ getCall, poolAddress: address }),
							getPoolToken0({ getCall, poolAddress: address }),
							getPoolToken1({ getCall, poolAddress: address }),
							getPoolFee({ getCall, poolAddress: address }),
							getPoolTickSpacing({ getCall, poolAddress: address }),
						])

						return {
							$factory: evmContractRef($network, factoryAddress),
							$token0: evmContractRef($network, token0Address),
							$token1: evmContractRef($network, token1Address),
							fee,
							tickSpacing,
							$poolContract: evmContractRef($network, address),
						}
					})
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
		entityType: EntityType.UniswapV3Pool_Block,
		resolve: {
			PoolBlockNumber: {
				resolve: async ({ $pool, blockNumber }) => {
					const chainId = chainIdFromNetwork($pool.$network)
					const {
						getPoolFeeGrowthGlobal0X128,
						getPoolFeeGrowthGlobal1X128,
						getPoolLiquidity,
						getPoolProtocolFees,
						getPoolSlot0,
						normalizeUniswapAddress,
					} = await import('$/sources/Uniswap/Contracts/queries.ts')

					const poolAddress = normalizeUniswapAddress($pool.poolAddress)
					return withTransports(chainId, 'UniswapV3Pool_Block', async (getCall) => {
						const [
							slot0,
							liquidity,
							feeGrowthGlobal0X128,
							feeGrowthGlobal1X128,
							protocolFees,
						] = await Promise.all([
							getPoolSlot0({ getCall, poolAddress, blockNumber }),
							getPoolLiquidity({ getCall, poolAddress, blockNumber }),
							getPoolFeeGrowthGlobal0X128({ getCall, poolAddress, blockNumber }),
							getPoolFeeGrowthGlobal1X128({ getCall, poolAddress, blockNumber }),
							getPoolProtocolFees({ getCall, poolAddress, blockNumber }),
						])

						return {
							sqrtPriceX96: slot0.sqrtPriceX96,
							liquidity,
							tick: slot0.tick,
							observationIndex: slot0.observationIndex,
							observationCardinality: slot0.observationCardinality,
							observationCardinalityNext: slot0.observationCardinalityNext,
							feeProtocol: slot0.feeProtocol,
							unlocked: slot0.unlocked,
							feeGrowthGlobal0X128,
							feeGrowthGlobal1X128,
							protocolFeesToken0: protocolFees.token0,
							protocolFeesToken1: protocolFees.token1,
						}
					})
				},
			},
		},
	})({
		sqrtPriceX96: (entity) => entity.sqrtPriceX96,
		liquidity: (entity) => entity.liquidity,
		tick: (entity) => entity.tick,
		observationIndex: (entity) => entity.observationIndex,
		observationCardinality: (entity) => entity.observationCardinality,
		observationCardinalityNext: (entity) => entity.observationCardinalityNext,
		feeProtocol: (entity) => entity.feeProtocol,
		unlocked: (entity) => entity.unlocked,
		feeGrowthGlobal0X128: (entity) => entity.feeGrowthGlobal0X128,
		feeGrowthGlobal1X128: (entity) => entity.feeGrowthGlobal1X128,
		protocolFeesToken0: (entity) => entity.protocolFeesToken0,
		protocolFeesToken1: (entity) => entity.protocolFeesToken1,
	}),

	defineResolver({
		entityType: EntityType.UniswapV3Position,
		resolve: {
			PositionManagerTokenId: {
				resolve: async ({ positionManager, tokenId }) => {
					const {
						chainIdsForUniswapV3NonfungiblePositionManager,
						getUniswapV3FactoryAddress,
					} = await import('$/sources/Uniswap/Catalog/queries.ts')
					const {
						getFactoryPool,
						getPosition,
						normalizeUniswapAddress,
					} = await import('$/sources/Uniswap/Contracts/queries.ts')

					const manager = normalizeUniswapAddress(positionManager)
					const chainIds = chainIdsForUniswapV3NonfungiblePositionManager(manager)
					if (chainIds.length === 0)
						throw new Error(`Voltaire_JsonRpc: unknown Uniswap V3 position manager ${manager}`)

					const errors: string[] = []
					for (const chainId of chainIds) {
						const factoryAddress = getUniswapV3FactoryAddress(chainId)
						if (factoryAddress == null) {
							errors.push(`chain ${String(chainId)}: missing factory`)
							continue
						}

						try {
							return await withTransports(chainId, 'UniswapV3Position', async (getCall) => {
								const position = await getPosition({
									getCall,
									positionManager: manager,
									tokenId,
								})
								const poolAddress = await getFactoryPool({
									getCall,
									factoryAddress,
									token0: position.token0,
									token1: position.token1,
									fee: position.fee,
								})
								const $network = evmNetworkSelectorFromChainId(chainId)

								return {
									$pool: {
										[EntityMetaKey.Selector]: {
											$network,
											poolAddress,
										},
									},
									tickLower: position.tickLower,
									tickUpper: position.tickUpper,
								}
							})
						} catch (error) {
							errors.push(`chain ${String(chainId)}: ${errorMessage(error)}`)
						}
					}

					throw new Error(`Voltaire_JsonRpc: UniswapV3Position failed for ${manager}/${String(tokenId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
				},
			},
		},
	})({
		$pool: (entity) => entity.$pool,
		tickLower: (entity) => entity.tickLower,
		tickUpper: (entity) => entity.tickUpper,
	}),

	defineResolver({
		entityType: EntityType.UniswapV3Position_Block,
		resolve: {
			PositionBlockNumber: {
				resolve: async ({ $position, blockNumber }) => {
					const {
						chainIdsForUniswapV3NonfungiblePositionManager,
					} = await import('$/sources/Uniswap/Catalog/queries.ts')
					const {
						getPosition,
						getPositionOwner,
						normalizeUniswapAddress,
					} = await import('$/sources/Uniswap/Contracts/queries.ts')

					const manager = normalizeUniswapAddress($position.positionManager)
					const tokenId = $position.tokenId
					const chainIds = chainIdsForUniswapV3NonfungiblePositionManager(manager)
					if (chainIds.length === 0)
						throw new Error(`Voltaire_JsonRpc: unknown Uniswap V3 position manager ${manager}`)

					const errors: string[] = []
					for (const chainId of chainIds) {
						try {
							return await withTransports(chainId, 'UniswapV3Position_Block', async (getCall) => {
								const [
									owner,
									position,
								] = await Promise.all([
									getPositionOwner({
										getCall,
										positionManager: manager,
										tokenId,
										blockNumber,
									}),
									getPosition({
										getCall,
										positionManager: manager,
										tokenId,
										blockNumber,
									}),
								])

								return {
									$owner: {
										[EntityMetaKey.Selector]: {
											address: owner,
										},
									},
									liquidity: position.liquidity,
									tokensOwed0: position.tokensOwed0,
									tokensOwed1: position.tokensOwed1,
									feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
									feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
								}
							})
						} catch (error) {
							errors.push(`chain ${String(chainId)}: ${errorMessage(error)}`)
						}
					}

					throw new Error(`Voltaire_JsonRpc: UniswapV3Position_Block failed for ${manager}/${String(tokenId)}@${String(blockNumber)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
				},
			},
		},
	})({
		$owner: (entity) => entity.$owner,
		liquidity: (entity) => entity.liquidity,
		tokensOwed0: (entity) => entity.tokensOwed0,
		tokensOwed1: (entity) => entity.tokensOwed1,
		feeGrowthInside0LastX128: (entity) => entity.feeGrowthInside0LastX128,
		feeGrowthInside1LastX128: (entity) => entity.feeGrowthInside1LastX128,
	}),
]
