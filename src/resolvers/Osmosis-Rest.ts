import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import bindings from '$/sources/Osmosis/bindings.ts'
import { osmosisLcdRestEndpoints } from '$/sources/Osmosis/Rest/queries.ts'
import type {
	OsmosisFullPositionBreakdown,
	OsmosisPoolManagerPool,
} from '$/sources/Osmosis/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type OsmosisPoolId = EntitySelector<typeof schema, EntityType.OsmosisPool>
type OsmosisPositionId = EntitySelector<typeof schema, EntityType.OsmosisPosition>
type CosmosAccountId = EntitySelector<typeof schema, EntityType.CosmosAccount>

const osmosisBinding = bindings[Source.Osmosis_LCD_Rest][0]
const osmosisLcdCaip2NetworkKey = osmosisBinding.target.key

const osmosisCaip2 = {
	namespace: 'cosmos',
	reference: 'osmosis-1',
} as const

const osmosisNetworkApplicability = [
	{
		caip2: osmosisCaip2,
	},
	{
		slug: 'osmosis',
	},
] as const

const osmosisNetworkResolverSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot> | _Snapshot
) => ({
	Caip2: {
		appliesTo: [osmosisNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [osmosisNetworkApplicability[1]],
		resolve,
	},
})
const osmosisNetworkReferenceApplicability = [
	{
		$network: osmosisNetworkApplicability[0],
	},
	{
		$network: osmosisNetworkApplicability[1],
	},
] as const

const osmosisNetworkTimestampApplicability = [
	{
		...osmosisNetworkReferenceApplicability[0],
		source: Source.Osmosis_LCD_Rest,
	},
	{
		...osmosisNetworkReferenceApplicability[1],
		source: Source.Osmosis_LCD_Rest,
	},
] as const

const osmosisPoolApplicability = osmosisNetworkReferenceApplicability

const osmosisPoolChildApplicability = [
	{
		$pool: osmosisNetworkReferenceApplicability[0],
	},
	{
		$pool: osmosisNetworkReferenceApplicability[1],
	},
] as const

const assertOsmosisNetwork = (network: NetworkId) => {
	if (
		'slug' in network
		&& network.slug === 'osmosis'
	)
		return

	if (
		'caip2' in network
		&& network.caip2.namespace === osmosisCaip2.namespace
		&& network.caip2.reference === osmosisCaip2.reference
	)
		return

	if (
		'caip2' in network
		&& `${network.caip2.namespace}:${network.caip2.reference}` === osmosisLcdCaip2NetworkKey
	)
		return

	throw new Error(`${Source.Osmosis_LCD_Rest}: unsupported network`)
}

const osmosisPaginationCount = (
	total: string | undefined,
	label: string
) => {
	if (total == null)
		throw new Error(`${Source.Osmosis_LCD_Rest}: ${label} pagination total missing`)

	const count = Number(total)
	if (!Number.isSafeInteger(count) || count < 0)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid ${label} pagination total ${total}`)

	return count
}

const channelPartsFromPath = (path: string) => {
	const segments = path.split('/')
	if (segments.length < 2 || segments.length % 2 !== 0)
		return undefined

	return {
		sourcePort: segments[segments.length - 2],
		sourceChannel: segments[segments.length - 1],
	}
}

const getOsmosisBlockReferences = async (
	network: NetworkId,
	limit: number
) => {
	assertOsmosisNetwork(network)
	const { getLatestBlock } = await import('$/sources/Osmosis/Rest/queries.ts')
	const latestBlock = await getLatestBlock()
	const latestBlockHeight = BigInt(latestBlock.block.header.height)
	return Array.from({
		length: Math.min(
			Number(latestBlockHeight + 1n),
			limit
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			height: latestBlockHeight - BigInt(blockOffset),
		},
	}))
}

const osmosisPoolAssetsFromWire = (wire: OsmosisPoolManagerPool) => (
	wire.pool_assets?.map((asset) => ({
		denom: asset.token.denom,
		amount: asset.token.amount,
		...(asset.weight != null && {
			weight: asset.weight,
		}),
	}))
	?? wire.pool_liquidity?.map((coin) => ({
		denom: coin.denom,
		amount: coin.amount,
	}))
	?? []
)

const osmosisLiquidityKindFromTypeUrl = (typeUrl: string | undefined) => (
	typeUrl == null ?
		undefined
	: typeUrl.includes('concentratedliquidity') ?
		'Concentrated liquidity'
	: typeUrl.includes('stableswap') ?
		'Stableswap'
	: typeUrl.includes('cosmwasm') ?
		'CosmWasm'
	: typeUrl.includes('gamm') ?
		'Balancer'
	:
		undefined
)

const osmosisClaimableSpreadRewardsText = (
	coins: OsmosisFullPositionBreakdown['claimable_spread_rewards']
) => (
	coins == null || coins.length === 0 ?
		undefined
	:
		coins
			.map((coin) => `${coin.amount}${coin.denom}`)
			.join(',')
)

const mapOsmosisPositionSnapshot = (
	network: NetworkId,
	breakdown: OsmosisFullPositionBreakdown
) => {
	const {
		position,
		asset0,
		asset1,
		claimable_spread_rewards: claimableSpreadRewards,
	} = breakdown
	const claimableSpreadRewardsText = osmosisClaimableSpreadRewardsText(claimableSpreadRewards)
	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		positionId: position.position_id,
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: network,
				poolId: position.pool_id,
			},
		},
		$account: {
			[EntityMetaKey.Selector]: {
				$network: network,
				address: position.address,
			},
		},
		tickLower: position.lower_tick,
		tickUpper: position.upper_tick,
		liquidity: position.liquidity,
		...(position.join_time != null && {
			joinTime: position.join_time,
		}),
		...(asset0 != null && {
			asset0Amount: asset0.amount,
			asset0Denom: asset0.denom,
		}),
		...(asset1 != null && {
			asset1Amount: asset1.amount,
			asset1Denom: asset1.denom,
		}),
		...(claimableSpreadRewardsText != null && {
			claimableSpreadRewards: claimableSpreadRewardsText,
		}),
	}
}

const mapOsmosisPoolSnapshot = (
	network: NetworkId,
	wire: OsmosisPoolManagerPool
) => {
	const liquidityKind = osmosisLiquidityKindFromTypeUrl(wire['@type'])
	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		poolId: wire.id,
		...(wire['@type'] != null && {
			typeUrl: wire['@type'],
		}),
		...(liquidityKind != null && {
			liquidityKind,
		}),
		...(wire.address != null && {
			address: wire.address,
		}),
		...(wire.pool_params?.swap_fee != null && {
			swapFee: wire.pool_params.swap_fee,
		}),
		...(wire.pool_params?.exit_fee != null && {
			exitFee: wire.pool_params.exit_fee,
		}),
		...(wire.total_weight != null && {
			totalWeight: wire.total_weight,
		}),
		...(wire.total_shares != null && {
			totalSharesAmount: wire.total_shares.amount,
			totalSharesDenom: wire.total_shares.denom,
		}),
		...(wire.token0 != null && {
			token0Denom: wire.token0,
		}),
		...(wire.token1 != null && {
			token1Denom: wire.token1,
		}),
		...(wire.current_sqrt_price != null && {
			currentSqrtPrice: wire.current_sqrt_price,
		}),
		...(wire.current_tick != null && {
			currentTick: wire.current_tick,
		}),
		...(wire.current_tick_liquidity != null && {
			currentTickLiquidity: wire.current_tick_liquidity,
		}),
		...(wire.tick_spacing != null && {
			tickSpacing: wire.tick_spacing,
		}),
		...(wire.exponent_at_price_one != null && {
			exponentAtPriceOne: wire.exponent_at_price_one,
		}),
		...(wire.spread_factor != null && {
			spreadFactor: wire.spread_factor,
		}),
		...(wire.last_liquidity_update != null && {
			lastLiquidityUpdate: wire.last_liquidity_update,
		}),
		assets: osmosisPoolAssetsFromWire(wire),
	}
}

const resolveOsmosisPool = async (
	entitySelector: OsmosisPoolId
) => {
	assertOsmosisNetwork(entitySelector.$network)
	const { getPool } = await import('$/sources/Osmosis/Rest/queries.ts')
	const {
		pool,
	} = await getPool(entitySelector.poolId)
	if (pool.id !== entitySelector.poolId)
		throw new Error(`${Source.Osmosis_LCD_Rest}: pool id mismatch ${pool.id} !== ${entitySelector.poolId}`)

	return mapOsmosisPoolSnapshot(entitySelector.$network, pool)
}

export default {
	source: Source.Osmosis_LCD_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network) => {
					assertOsmosisNetwork(network)
					return osmosisLcdRestEndpoints
				}
			),
		})({
			Cosmos: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: osmosisNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getLatestBlock,
							getNodeInfo,
							getStakingPool,
							getSyncing,
							getValidators,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const [
							nodeInfo,
							latestBlock,
							syncing,
							bondedValidators,
							stakingPool,
						] = await Promise.all([
							getNodeInfo(),
							getLatestBlock(),
							getSyncing(),
							getValidators({
								limit: 1,
								status: 'BOND_STATUS_BONDED',
							}),
							getStakingPool(),
						])
						if (nodeInfo.default_node_info.network !== osmosisCaip2.reference)
							throw new Error(`${Source.Osmosis_LCD_Rest}: LCD network mismatch`)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [
								NetworkLedgerModel.Account,
							],
							executionModels: [
								NetworkExecutionModel.CosmosSdk,
							],
							latestBlockHeight: BigInt(latestBlock.block.header.height),
							latestBlockHash: latestBlock.block_id.hash,
							latestBlockTimeMs: Date.parse(latestBlock.block.header.time),
							latestBlockTransactionCount: latestBlock.block.data.txs?.length ?? 0,
							chainId: nodeInfo.default_node_info.network,
							nodeNetwork: nodeInfo.default_node_info.network,
							applicationName: nodeInfo.application_version?.app_name ?? nodeInfo.application_version?.name,
							applicationVersion: nodeInfo.application_version?.version,
							cosmosSdkVersion: nodeInfo.application_version?.cosmos_sdk_version,
							isSyncing: syncing.syncing,
							bondedValidatorCount: osmosisPaginationCount(bondedValidators.pagination?.total, 'bonded validator'),
							bondedTokens: BigInt(stakingPool.pool.bonded_tokens),
							notBondedTokens: BigInt(stakingPool.pool.not_bonded_tokens),
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			ledgerModels: (timestamp) => timestamp.ledgerModels,
			executionModels: (timestamp) => timestamp.executionModels,
			Cosmos: {
				latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
				latestBlockHash: (timestamp) => timestamp.latestBlockHash,
				latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
				latestBlockTransactionCount: (timestamp) => timestamp.latestBlockTransactionCount,
				chainId: (timestamp) => timestamp.chainId,
				nodeNetwork: (timestamp) => timestamp.nodeNetwork,
				applicationName: (timestamp) => timestamp.applicationName,
				applicationVersion: (timestamp) => timestamp.applicationVersion,
				cosmosSdkVersion: (timestamp) => timestamp.cosmosSdkVersion,
				isSyncing: (timestamp) => timestamp.isSyncing,
				bondedValidatorCount: (timestamp) => timestamp.bondedValidatorCount,
				bondedTokens: (timestamp) => timestamp.bondedTokens,
				notBondedTokens: (timestamp) => timestamp.notBondedTokens,
			},
		}),

		defineResolver({
			entityType: EntityType.CosmosBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {
						assertOsmosisNetwork($network)
						const { getBlock } = await import('$/sources/Osmosis/Rest/queries.ts')
						const wireBlock = await getBlock({
							height,
						})
						return {
							hash: wireBlock.block_id.hash,
							proposerConsensusAddress: wireBlock.block.header.proposer_address,
							timestampMs: Date.parse(wireBlock.block.header.time),
							transactionCount: wireBlock.block.data.txs?.length ?? 0,
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			proposerConsensusAddress: (block) => block.proposerConsensusAddress,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.IbcDenomTrace,
			resolve: {
				NetworkTraceKey: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						assertOsmosisNetwork(entitySelector.$network)
						const {
							getDenomTrace,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							denom_trace: denomTrace,
						} = await getDenomTrace(entitySelector.traceKey)
						const channel = channelPartsFromPath(denomTrace.path)
						const denomHash = (
							entitySelector.traceKey.startsWith('hash:') ?
								entitySelector.traceKey.slice('hash:'.length).toLowerCase()
							: entitySelector.traceKey.startsWith('ibc/') ?
								entitySelector.traceKey.slice('ibc/'.length).toLowerCase()
							: /^[0-9A-Fa-f]{64}$/.test(entitySelector.traceKey) ?
								entitySelector.traceKey.toLowerCase()
							:
								undefined
						)
						return {
							path: denomTrace.path,
							baseDenom: denomTrace.base_denom,
							displayDenom: denomTrace.base_denom,
							...(denomHash != null && {
								denomHash,
							}),
							...(channel != null && {
								sourcePort: channel.sourcePort,
								sourceChannel: channel.sourceChannel,
							}),
						}
					},
				},
			},
		})({
			path: (trace) => trace.path,
			baseDenom: (trace) => trace.baseDenom,
			displayDenom: (trace) => trace.displayDenom,
			denomHash: (trace) => trace.denomHash,
			sourcePort: (trace) => trace.sourcePort,
			sourceChannel: (trace) => trace.sourceChannel,
		}),

		defineResolver({
			entityType: EntityType.OsmosisPool,
			resolve: {
				NetworkPoolId: {
					appliesTo: osmosisPoolApplicability,
					resolve: resolveOsmosisPool,
				},
			},
		})({
			$network: (pool) => pool.$network,
			poolId: (pool) => pool.poolId,
			typeUrl: (pool) => pool.typeUrl,
			liquidityKind: (pool) => pool.liquidityKind,
			address: (pool) => pool.address,
			swapFee: (pool) => pool.swapFee,
			exitFee: (pool) => pool.exitFee,
			totalWeight: (pool) => pool.totalWeight,
			totalSharesAmount: (pool) => pool.totalSharesAmount,
			totalSharesDenom: (pool) => pool.totalSharesDenom,
			token0Denom: (pool) => pool.token0Denom,
			token1Denom: (pool) => pool.token1Denom,
			currentSqrtPrice: (pool) => pool.currentSqrtPrice,
			currentTick: (pool) => pool.currentTick,
			currentTickLiquidity: (pool) => pool.currentTickLiquidity,
			tickSpacing: (pool) => pool.tickSpacing,
			exponentAtPriceOne: (pool) => pool.exponentAtPriceOne,
			spreadFactor: (pool) => pool.spreadFactor,
			lastLiquidityUpdate: (pool) => pool.lastLiquidityUpdate,
			$$assets: (pool) => (
				pool.assets.map((asset) => ({
					[EntityMetaKey.Selector]: {
						$pool: {
							$network: pool.$network[EntityMetaKey.Selector],
							poolId: pool.poolId,
						},
						denom: asset.denom,
					},
				}))
			),
		}),

		defineResolver({
			entityType: EntityType.OsmosisPosition,
			resolve: {
				NetworkPositionId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						positionId,
					}: OsmosisPositionId) => {
						assertOsmosisNetwork($network)
						const { getPositionById } = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							position,
						} = await getPositionById({
							positionId,
						})
						if (position.position.position_id !== positionId)
							throw new Error(`${Source.Osmosis_LCD_Rest}: position id mismatch ${position.position.position_id} !== ${positionId}`)

						return mapOsmosisPositionSnapshot($network, position)
					},
				},
			},
		})({
			$network: (position) => position.$network,
			positionId: (position) => position.positionId,
			$pool: (position) => position.$pool,
			$account: (position) => position.$account,
			tickLower: (position) => position.tickLower,
			tickUpper: (position) => position.tickUpper,
			liquidity: (position) => position.liquidity,
			joinTime: (position) => position.joinTime,
			asset0Amount: (position) => position.asset0Amount,
			asset0Denom: (position) => position.asset0Denom,
			asset1Amount: (position) => position.asset1Amount,
			asset1Denom: (position) => position.asset1Denom,
			claimableSpreadRewards: (position) => position.claimableSpreadRewards,
		}),

		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						address,
					}: CosmosAccountId, context) => {
						assertOsmosisNetwork($network)
						const limit = resolverContextRowLimit(context)
						const offset = context.pagination.offset ?? 0
						const { getPositionsByOwner } = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							positions,
							pagination,
						} = await getPositionsByOwner({
							address,
							limit,
							offset,
						})
						const reportedTotal = (
							pagination?.total == null ?
								undefined
							:
								Number(pagination.total)
						)
						const totalCount = (
							reportedTotal != null
							&& Number.isSafeInteger(reportedTotal)
							&& reportedTotal >= 0 ?
								reportedTotal
							:
								offset + positions.length
						)
						return {
							rows: positions.map((breakdown) => ({
								[EntityMetaKey.Selector]: {
									$network,
									positionId: breakdown.position.position_id,
								},
							})),
							totalCount,
						}
					},
				},
			},
		})({
			$$osmosisPositions: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.OsmosisPoolAsset,
			resolve: {
				PoolDenom: {
					appliesTo: osmosisPoolChildApplicability,
					resolve: async ({
						$pool,
						denom,
					}) => {
						const pool = await resolveOsmosisPool($pool)
						const asset = pool.assets.find((candidate) => candidate.denom === denom)
						if (asset == null)
							throw new Error(`${Source.Osmosis_LCD_Rest}: pool ${$pool.poolId} has no asset ${denom}`)

						return {
							$pool: {
								[EntityMetaKey.Selector]: $pool,
							},
							denom: asset.denom,
							amount: asset.amount,
							...(asset.weight != null && {
								weight: asset.weight,
							}),
							$cosmosDenom: {
								[EntityMetaKey.Selector]: {
									$network: $pool.$network,
									denom: asset.denom,
								},
							},
						}
					},
				},
			},
		})({
			$pool: (asset) => asset.$pool,
			denom: (asset) => asset.denom,
			amount: (asset) => asset.amount,
			weight: (asset) => asset.weight,
			$cosmosDenom: (asset) => asset.$cosmosDenom,
		}),

		defineResolver({
			entityType: EntityType.OsmosisPool_Timestamp,
			resolve: {
				PoolTimestampMsBaseQuote: {
					appliesTo: osmosisPoolChildApplicability,
					resolve: async ({
						$pool,
						timestampMs,
						baseAssetDenom,
						quoteAssetDenom,
					}) => {
						assertOsmosisNetwork($pool.$network)
						const { getSpotPrice } = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							spot_price: spotPrice,
						} = await getSpotPrice({
							poolId: $pool.poolId,
							baseAssetDenom,
							quoteAssetDenom,
						})
						return {
							$pool: {
								[EntityMetaKey.Selector]: $pool,
							},
							timestampMs,
							baseAssetDenom,
							quoteAssetDenom,
							source: Source.Osmosis_LCD_Rest,
							spotPrice,
						}
					},
				},
			},
		})({
			$pool: (observation) => observation.$pool,
			timestampMs: (observation) => observation.timestampMs,
			baseAssetDenom: (observation) => observation.baseAssetDenom,
			quoteAssetDenom: (observation) => observation.quoteAssetDenom,
			source: (observation) => observation.source,
			spotPrice: (observation) => observation.spotPrice,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network) => {
					assertOsmosisNetwork(network)
					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: Date.now(),
							source: Source.Osmosis_LCD_Rest,
						},
					}]
				}
			),
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => (
					getOsmosisBlockReferences(
						network,
						resolverContextRowLimit(context)
					)
				)
			),
		})({
			Cosmos: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => {
					assertOsmosisNetwork(network)
					const limit = resolverContextRowLimit(context)
					const offset = context.pagination.offset ?? 0
					const { getConcentratedLiquidityPools } = await import('$/sources/Osmosis/Rest/queries.ts')
					const {
						pools,
						pagination,
					} = await getConcentratedLiquidityPools({
						limit,
						offset,
					})
					const reportedTotal = (
						pagination?.total == null ?
							undefined
						:
							Number(pagination.total)
					)
					const totalCount = (
						reportedTotal != null
						&& Number.isSafeInteger(reportedTotal)
						&& reportedTotal > 0 ?
							reportedTotal
						:
							offset + pools.length
					)
					return {
						rows: pools.map((pool) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								poolId: pool.id,
							},
							[EntityMetaKey.Fields]: Object.fromEntries(
								Object.entries(
									mapOsmosisPoolSnapshot(network, pool)
								)
									.filter(([field]) => field !== '$network' && field !== 'poolId' && field !== 'assets')
									.map(([field, value]) => [
										entityFieldAddressKey(EntityType.OsmosisPool, [], field),
										value,
									])
							),
						})),
						totalCount,
					}
				}
			),
		})({
			Cosmos: {
				$$osmosisPools: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),
	],
}
