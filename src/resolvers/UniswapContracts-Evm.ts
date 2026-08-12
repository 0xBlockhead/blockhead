import { networks } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
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
			entityType: EntityType.UniswapCcaAuction,
			resolve: {
				NetworkAuctionAddress: {
					resolve: async ({ $network, auctionAddress }) => {
						const {
							getCcaAuctionConfiguration,
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')
						const chainId = chainIdFromNetwork($network)
						const address = normalizeUniswapAddress(auctionAddress)
						const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
						if (voltaireTransports.length === 0)
							throw new Error(`UniswapContracts_Evm: no JSON-RPC URL for UniswapCcaAuction on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const transport of voltaireTransports) {
							try {
								const blockNumber = await transport.getBlockNumber()
								const configuration = await getCcaAuctionConfiguration({
									getCall: transport.getCall,
									auctionAddress: address,
									blockNumber,
								})
								if (configuration.auctionAddress !== address)
									throw new Error(`configuration address ${configuration.auctionAddress} does not match ${address}`)
								if (configuration.blockNumber !== blockNumber)
									throw new Error(`configuration block ${String(configuration.blockNumber)} does not match ${String(blockNumber)}`)

								return {
									auctionAddress: configuration.auctionAddress,
									$auctionContract: evmContractRef($network, configuration.auctionAddress),
									$currency: {
										[EntityMetaKey.Selector]: (
											configuration.currencyAddress === '0x0000000000000000000000000000000000000000' ?
												{
													$network,
													type: CoinInstanceType.NativeCurrency,
												}
											:
												{
													$network,
													type: CoinInstanceType.Erc20Token,
													$contract: {
														$network,
														address: configuration.currencyAddress,
													},
												}
										),
									},
									$token: {
										[EntityMetaKey.Selector]: {
											$network,
											type: CoinInstanceType.Erc20Token,
											$contract: {
												$network,
												address: configuration.tokenAddress,
											},
										},
									},
									totalSupply: configuration.totalSupply,
									$tokensRecipient: {
										[EntityMetaKey.Selector]: {
											address: configuration.tokensRecipient,
										},
									},
									$fundsRecipient: {
										[EntityMetaKey.Selector]: {
											address: configuration.fundsRecipient,
										},
									},
									$startBlock: {
										[EntityMetaKey.Selector]: {
											$network,
											blockNumber: configuration.startBlock,
										},
									},
									$endBlock: {
										[EntityMetaKey.Selector]: {
											$network,
											blockNumber: configuration.endBlock,
										},
									},
									$claimBlock: {
										[EntityMetaKey.Selector]: {
											$network,
											blockNumber: configuration.claimBlock,
										},
									},
									$validationHook: (
										configuration.validationHookAddress === '0x0000000000000000000000000000000000000000' ?
											undefined
										:
											evmContractRef($network, configuration.validationHookAddress)
									),
									floorPriceQ96: configuration.floorPriceQ96,
									tickSpacingQ96: configuration.tickSpacingQ96,
								}
							} catch (error) {
								errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
							}
						}
						throw new Error(`UniswapContracts_Evm: all UniswapCcaAuction endpoints failed for ${address} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
					},
				},
			},
		})({
			auctionAddress: (entity) => entity.auctionAddress,
			$auctionContract: (entity) => entity.$auctionContract,
			$currency: (entity) => entity.$currency,
			$token: (entity) => entity.$token,
			totalSupply: (entity) => entity.totalSupply,
			$tokensRecipient: (entity) => entity.$tokensRecipient,
			$fundsRecipient: (entity) => entity.$fundsRecipient,
			$startBlock: (entity) => entity.$startBlock,
			$endBlock: (entity) => entity.$endBlock,
			$claimBlock: (entity) => entity.$claimBlock,
			$validationHook: (entity) => entity.$validationHook,
			floorPriceQ96: (entity) => entity.floorPriceQ96,
			tickSpacingQ96: (entity) => entity.tickSpacingQ96,
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
				Token0Token1Fee: {
					resolve: async ({ $token0, $token1, fee }) => {
						if (!('address' in $token0) || !('address' in $token1))
							throw new Error('UniswapContracts_Evm: Token0Token1Fee requires EvmContract address selectors')

						const {
							uniswapV3DeploymentByChainId,
							uniswapV3FeeTierByFee,
							uniswapV3Pools,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')

						const chainId = chainIdFromNetwork($token0.$network)
						if (chainIdFromNetwork($token1.$network) !== chainId)
							throw new Error('UniswapContracts_Evm: Token0Token1Fee token networks must match')

						const factoryAddress = uniswapV3DeploymentByChainId[chainId]?.factoryAddress
						if (factoryAddress == null)
							throw new Error(`UniswapContracts_Evm: no Uniswap V3 factory for chain ${String(chainId)}`)

						const token0 = normalizeUniswapAddress($token0.address)
						const token1 = normalizeUniswapAddress($token1.address)
						const catalogEntry = uniswapV3Pools.find((pool) => (
							pool.chainId === chainId
							&& pool.token0 === token0
							&& pool.token1 === token1
							&& pool.fee === fee
						))
						if (catalogEntry == null)
							throw new Error(`UniswapContracts_Evm: pool not in Uniswap V3 catalog for ${token0}/${token1}/${String(fee)} on chain ${String(chainId)}`)

						const tickSpacing = (
							catalogEntry.tickSpacing
							?? uniswapV3FeeTierByFee[catalogEntry.fee]?.tickSpacing
						)
						if (tickSpacing == null)
							throw new Error(`UniswapContracts_Evm: no tick spacing for fee ${String(catalogEntry.fee)}`)

						const $network = $token0.$network
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							poolAddress: catalogEntry.poolAddress,
							$factory: evmContractRef($network, factoryAddress),
							$poolContract: evmContractRef($network, catalogEntry.poolAddress),
							$token0: evmContractRef($network, catalogEntry.token0),
							$token1: evmContractRef($network, catalogEntry.token1),
							fee: catalogEntry.fee,
							tickSpacing,
						}
					},
				},
			},
		})({
			$network: (entity) => entity.$network,
			poolAddress: (entity) => entity.poolAddress,
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
		}),

		defineResolver({
			entityType: EntityType.UniswapV3Pool,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({ $network, poolAddress }) => {
						const {
							uniswapV3PoolByChainIdAndAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')
						const chainId = chainIdFromNetwork($network)
						const address = normalizeUniswapAddress(poolAddress)
						if (uniswapV3PoolByChainIdAndAddress[`${chainId}:${address}`] == null)
							throw new Error(`UniswapContracts_Evm: pool ${address} not in Uniswap V3 catalog for chain ${String(chainId)}`)

						const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
						if (voltaireTransports.length === 0)
							throw new Error(`UniswapContracts_Evm: no JSON-RPC URL for UniswapV3Pool.$$blocks on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const transport of voltaireTransports) {
							try {
								const blockNumber = await transport.getBlockNumber()
								return {
									$$blocks: [{
										[EntityMetaKey.Selector]: {
											$pool: {
												$network,
												poolAddress: address,
											},
											blockNumber,
										},
									}],
								}
							} catch (error) {
								errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
							}
						}
						throw new Error(`UniswapContracts_Evm: all tip block endpoints failed for pool ${address} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
					},
				},
			},
		})({
			$$blocks: {
				select: (entity) => entity.$$blocks,
				resolveCount: (entity) => entity.$$blocks.length,
			},
		}),

		defineResolver({
			entityType: EntityType.UniswapV3Pool_Block,
			resolve: {
				PoolBlockNumber: {
					resolve: async ({ $pool, blockNumber }) => {
						if (!('poolAddress' in $pool))
							throw new Error('UniswapContracts_Evm: UniswapV3Pool_Block requires NetworkPoolAddress')

						const {
							uniswapV3PoolByChainIdAndAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							getPoolFeeGrowthGlobal0X128,
							getPoolFeeGrowthGlobal1X128,
							getPoolLiquidity,
							getPoolProtocolFees,
							getPoolSlot0,
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')

						const chainId = chainIdFromNetwork($pool.$network)
						const poolAddress = normalizeUniswapAddress($pool.poolAddress)
						if (uniswapV3PoolByChainIdAndAddress[`${chainId}:${poolAddress}`] == null)
							throw new Error(`UniswapContracts_Evm: pool ${poolAddress} not in Uniswap V3 catalog for chain ${String(chainId)}`)

						const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
						if (voltaireTransports.length === 0)
							throw new Error(`UniswapContracts_Evm: no JSON-RPC URL for UniswapV3Pool_Block on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const transport of voltaireTransports) {
							try {
								const [
									slot0,
									liquidity,
									feeGrowthGlobal0X128,
									feeGrowthGlobal1X128,
									protocolFees,
								] = await Promise.all([
									getPoolSlot0({ getCall: transport.getCall, poolAddress, blockNumber }),
									getPoolLiquidity({ getCall: transport.getCall, poolAddress, blockNumber }),
									getPoolFeeGrowthGlobal0X128({ getCall: transport.getCall, poolAddress, blockNumber }),
									getPoolFeeGrowthGlobal1X128({ getCall: transport.getCall, poolAddress, blockNumber }),
									getPoolProtocolFees({ getCall: transport.getCall, poolAddress, blockNumber }),
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
							} catch (error) {
								errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
							}
						}
						throw new Error(`UniswapContracts_Evm: all UniswapV3Pool_Block endpoints failed for ${poolAddress}@${String(blockNumber)} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
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
							uniswapV3DeploymentsByNonfungiblePositionManagerAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							getFactoryPool,
							getPosition,
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')

						const manager = normalizeUniswapAddress(positionManager)
						const chainIds = (
							uniswapV3DeploymentsByNonfungiblePositionManagerAddress[manager]
								?.map((deployment) => deployment.chainId)
							?? []
						)
						if (chainIds.length === 0)
							throw new Error(`UniswapContracts_Evm: unknown Uniswap V3 position manager ${manager}`)

						const errors: string[] = []
						for (const chainId of chainIds) {
							const deployment = uniswapV3DeploymentsByNonfungiblePositionManagerAddress[manager]
								?.find((candidate) => candidate.chainId === chainId)
							if (deployment == null)
								throw new Error(`UniswapContracts_Evm: no Uniswap V3 factory for position manager ${manager} on chain ${String(chainId)}`)

							const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
							for (const transport of voltaireTransports) {
								try {
									const blockNumber = await transport.getBlockNumber()
									const position = await getPosition({
										getCall: transport.getCall,
										positionManager: manager,
										tokenId,
										blockNumber,
									})
									const poolAddress = normalizeUniswapAddress(await getFactoryPool({
										getCall: transport.getCall,
										factoryAddress: deployment.factoryAddress,
										token0: position.token0,
										token1: position.token1,
										fee: position.fee,
										blockNumber,
									}))
									return {
										$pool: {
											[EntityMetaKey.Selector]: {
												$network: {
													caip2: {
														namespace: 'eip155',
														reference: String(chainId),
													},
												},
												poolAddress,
											},
										},
										tickLower: position.tickLower,
										tickUpper: position.tickUpper,
										$$blocks: [{
											[EntityMetaKey.Selector]: {
												$position: {
													positionManager: manager,
													tokenId,
												},
												blockNumber,
											},
										}],
									}
								} catch (error) {
									errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
								}
							}
						}
						throw new Error(`UniswapContracts_Evm: UniswapV3Position.$$blocks failed for ${manager}/${String(tokenId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
					},
				},
			},
		})({
			$pool: (entity) => entity.$pool,
			tickLower: (entity) => entity.tickLower,
			tickUpper: (entity) => entity.tickUpper,
			$$blocks: {
				select: (entity) => entity.$$blocks,
				resolveCount: (entity) => entity.$$blocks.length,
			},
		}),

		defineResolver({
			entityType: EntityType.UniswapV3Position_Block,
			resolve: {
				PositionBlockNumber: {
					resolve: async ({ $position, blockNumber }) => {
						const {
							uniswapV3DeploymentsByNonfungiblePositionManagerAddress,
						} = await import('$/sources/Uniswap/Catalog/constants.ts')
						const {
							getPosition,
							getPositionOwner,
							normalizeUniswapAddress,
						} = await import('$/sources/Uniswap/Contracts/queries.ts')

						const manager = normalizeUniswapAddress($position.positionManager)
						const tokenId = $position.tokenId
						const chainIds = (
							uniswapV3DeploymentsByNonfungiblePositionManagerAddress[manager]
								?.map((deployment) => deployment.chainId)
							?? []
						)
						if (chainIds.length === 0)
							throw new Error(`UniswapContracts_Evm: unknown Uniswap V3 position manager ${manager}`)

						const errors: string[] = []
						for (const chainId of chainIds) {
							const voltaireTransports = (await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
							for (const transport of voltaireTransports) {
								try {
									const [
										owner,
										position,
									] = await Promise.all([
										getPositionOwner({
											getCall: transport.getCall,
											positionManager: manager,
											tokenId,
											blockNumber,
										}),
										getPosition({
											getCall: transport.getCall,
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
								} catch (error) {
									errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
								}
							}
						}
						throw new Error(`UniswapContracts_Evm: UniswapV3Position_Block failed for ${manager}/${String(tokenId)}@${String(blockNumber)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
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
	],
}
