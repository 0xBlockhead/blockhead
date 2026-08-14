import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	networkByCaip2,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import {
	type getIbcChannels,
	type getIbcClientStates,
	type getIbcConnections,
	osmosisLcdRestEndpoints,
} from '$/sources/Osmosis/Rest/queries.ts'
import type {
	OsmosisFullPositionBreakdown,
	OsmosisPoolManagerPool,
} from '$/sources/Osmosis/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type OsmosisPoolId = EntitySelector<typeof schema, EntityType.OsmosisPool>
type OsmosisPositionId = EntitySelector<typeof schema, EntityType.OsmosisPosition>
type CosmosAccountId = EntitySelector<typeof schema, EntityType.CosmosAccount>
type OsmosisIbcChannel = Awaited<ReturnType<typeof getIbcChannels>>['channels'][number]
type OsmosisIbcClient = Awaited<ReturnType<typeof getIbcClientStates>>['client_states'][number]
type OsmosisIbcConnection = Awaited<ReturnType<typeof getIbcConnections>>['connections'][number]

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
		&& network.caip2.namespace === osmosisCaip2.namespace
		&& network.caip2.reference === osmosisCaip2.reference
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

const osmosisIbcConnectionIdFromPath = (
	path: string
) => {
	if (path.startsWith('connections/')) {
		const connectionId = path.slice('connections/'.length)
		if (connectionId === '' || connectionId.includes('/'))
			throw new Error(`${Source.Osmosis_LCD_Rest}: invalid IBC connection path ${path}`)

		return connectionId
	}

	if (path.includes('/'))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid IBC connection path ${path}`)

	return path
}

const osmosisCounterpartyNetworkReference = (
	counterpartyChainId: string
) => {
	const catalog = networkByCaip2[`cosmos:${counterpartyChainId}`]
	if (!Object.hasOwn(networkByCaip2, `cosmos:${counterpartyChainId}`))
		return

	return {
		[EntityMetaKey.Selector]: {
			caip2: catalog.caip2,
		},
	}
}

const osmosisIbcChannelListRows = (
	network: NetworkId,
	channels: OsmosisIbcChannel[]
) => (
	channels.map((channel) => {
		const portId = channel.port_id
		const channelId = channel.channel_id
		if (portId == null || portId === '' || channelId == null || channelId === '')
			throw new Error(`${Source.Osmosis_LCD_Rest}: IBC channel list row missing port or channel id`)

		return {
			[EntityMetaKey.Selector]: {
				$network: network,
				portId,
				channelId,
			},
			[EntityMetaKey.Fields]: {
				...(channel.connection_hops.length === 1 && {
					[entityFieldAddressKey(EntityType.IbcChannel, [], '$connection')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							connectionId: channel.connection_hops[0],
						},
					},
				}),
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyPortId')]: channel.counterparty.port_id,
				...(channel.counterparty.channel_id !== '' && {
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyChannelId')]: channel.counterparty.channel_id,
				}),
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'ordering')]: channel.ordering,
				...(channel.version !== '' && {
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'version')]: channel.version,
				}),
			},
		}
	})
)

const osmosisUnsignedInteger = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid ${label} ${value}`)

	return BigInt(value)
}

const osmosisDurationToNs = (
	value: string,
	label: string
) => {
	const match = /^(0|[1-9]\d*)(?:\.(\d{1,9}))?s$/.exec(value)
	if (match == null)
		throw new Error(`${Source.Osmosis_LCD_Rest}: invalid ${label} duration ${value}`)

	const wholeSeconds = BigInt(match[1])
	const fraction = match[2] ?? ''
	const nanos = BigInt(fraction.padEnd(9, '0'))
	return wholeSeconds * 1_000_000_000n + nanos
}

const osmosisIbcConnectionStableFields = (
	network: NetworkId,
	connection: Omit<OsmosisIbcConnection, 'id'>
) => ({
	clientId: connection.client_id,
	$client: {
		[EntityMetaKey.Selector]: {
			$network: network,
			clientId: connection.client_id,
		},
	},
	counterpartyClientId: connection.counterparty.client_id,
	...(connection.counterparty.connection_id !== '' && {
		counterpartyConnectionId: connection.counterparty.connection_id,
	}),
	delayPeriodNs: osmosisUnsignedInteger(
		connection.delay_period,
		'delay period'
	),
})

const osmosisIbcClientStableFields = (
	network: NetworkId,
	clientState: OsmosisIbcClient['client_state']
) => {
	const $counterpartyNetwork = osmosisCounterpartyNetworkReference(clientState.chain_id)

	return {
		clientType: (
			clientState['@type'].includes('tendermint') ?
				'07-tendermint'
			:
				clientState['@type']
		),
		trustLevel: `${clientState.trust_level.numerator}/${clientState.trust_level.denominator}`,
		trustingPeriodNs: osmosisDurationToNs(
			clientState.trusting_period,
			'trusting period'
		),
		unbondingPeriodNs: osmosisDurationToNs(
			clientState.unbonding_period,
			'unbonding period'
		),
		maxClockDriftNs: osmosisDurationToNs(
			clientState.max_clock_drift,
			'max clock drift'
		),
		counterpartyChainId: clientState.chain_id,
		...($counterpartyNetwork != null && {
			$counterpartyNetwork,
		}),
	}
}

const getOsmosisBlockReferences = async (
	network: NetworkId,
	limit: number,
	offset: number,
	cursorHeight?: bigint
) => {
	assertOsmosisNetwork(network)
	const { getLatestBlock } = await import('$/sources/Osmosis/Rest/queries.ts')
	const latestBlock = await getLatestBlock()
	const latestBlockHeight = BigInt(latestBlock.block.header.height)
	if (cursorHeight != null && cursorHeight > latestBlockHeight)
		throw new Error(`${Source.Osmosis_LCD_Rest}: blocks continuation exceeds tip`)

	const firstBlockHeight = cursorHeight ?? latestBlockHeight - BigInt(offset)
	return {
		rows: Array.from({
			length: Math.min(
				Math.max(
					Number(firstBlockHeight + 1n),
					0
				),
				limit
			),
		}, (_value, blockOffset) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: firstBlockHeight - BigInt(blockOffset),
			},
		})),
		totalCount: latestBlockHeight + 1n,
	}
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
								$channel: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										portId: channel.sourcePort,
										channelId: channel.sourceChannel,
									},
								},
							}),
							$cosmosDenom: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									denom: (
										denomHash != null ?
											`ibc/${denomHash.toUpperCase()}`
										:
											denomTrace.base_denom
									),
								},
							},
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
			$channel: (trace) => trace.$channel,
			$cosmosDenom: (trace) => trace.$cosmosDenom,
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
			positionCount: {
				resolve: async ({
					$network,
					poolId,
				}: OsmosisPoolId) => {
					assertOsmosisNetwork($network)
					const { getNumPoolPositions } = await import('$/sources/Osmosis/Rest/queries.ts')
					const {
						position_count: positionCount,
					} = await getNumPoolPositions({
						poolId,
					})
					return BigInt(positionCount)
				},
			},
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
			$$timestamps: {
				resolve: async (
					{
						$network,
						poolId,
					}: OsmosisPoolId,
					_context
				) => {
					assertOsmosisNetwork($network)
					const pool = await resolveOsmosisPool({
						$network,
						poolId,
					})
					if (
						(pool.token0Denom == null && pool.assets.length < 1)
						|| (pool.token1Denom == null && pool.assets.length < 2)
					)
						return undefined

					const baseAssetDenom = pool.token0Denom ?? pool.assets[0]?.denom
					const quoteAssetDenom = pool.token1Denom ?? pool.assets[1]?.denom
					if (baseAssetDenom === quoteAssetDenom)
						return undefined

					const { getSpotPrice } = await import('$/sources/Osmosis/Rest/queries.ts')
					const timestampMs = Date.now()
					const $pool = {
						$network,
						poolId,
					}
					const [
						forward,
						reverse,
					] = await Promise.all([
						getSpotPrice({
							poolId,
							baseAssetDenom,
							quoteAssetDenom,
						}),
						getSpotPrice({
							poolId,
							baseAssetDenom: quoteAssetDenom,
							quoteAssetDenom: baseAssetDenom,
						}),
					])
					return [
						{
							[EntityMetaKey.Selector]: {
								$pool,
								timestampMs,
								baseAssetDenom,
								quoteAssetDenom,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'source')]: Source.Osmosis_LCD_Rest,
								[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'spotPrice')]: forward.spot_price,
							},
						},
						{
							[EntityMetaKey.Selector]: {
								$pool,
								timestampMs,
								baseAssetDenom: quoteAssetDenom,
								quoteAssetDenom: baseAssetDenom,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'source')]: Source.Osmosis_LCD_Rest,
								[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'spotPrice')]: reverse.spot_price,
							},
						},
					]
				},
			},
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
							rows: positions.map((breakdown) => {
								const position = mapOsmosisPositionSnapshot($network, breakdown)
								return {
									[EntityMetaKey.Selector]: {
										$network,
										positionId: breakdown.position.position_id,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(position)
											.filter(([field]) => (
												field !== '$network'
												&& field !== 'positionId'
											))
											.map(([field, value]) => [
												entityFieldAddressKey(EntityType.OsmosisPosition, [], field),
												value,
											])
									),
								}
							}),
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
			entityType: EntityType.CosmosDenom,
			resolve: {
				NetworkDenom: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({ $network, denom }) => {
						assertOsmosisNetwork($network)
						const { getDenomMetadata } = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							metadata,
						} = await getDenomMetadata({
							denom,
						})
						return {
							display: metadata.display,
							base: metadata.base,
							symbol: metadata.symbol,
						}
					},
				},
			},
		})({
			display: (denom) => denom.display,
			base: (denom) => denom.base,
			symbol: (denom) => denom.symbol,
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
				async (network, context) => {
					const offset = context.pagination.offset ?? 0
					if (!Number.isSafeInteger(offset) || offset < 0)
						throw new Error(`${Source.Osmosis_LCD_Rest}: invalid blocks offset`)

					return getOsmosisBlockReferences(
						network,
						resolverContextRowLimit(context),
						offset,
						context.providerContinuationToken == null ?
							undefined
						:
							osmosisUnsignedInteger(context.providerContinuationToken, 'blocks continuation')
					)
				}
			),
		})({
			Cosmos: {
				$$blocks: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
					continuation: (snapshot) => {
						const lastBlockHeight = snapshot.rows.at(-1)?.[EntityMetaKey.Selector].height
						return {
							operation: 'network-blocks',
							terminal: lastBlockHeight == null || lastBlockHeight === 0n,
							...(lastBlockHeight != null && lastBlockHeight > 0n && {
								token: String(lastBlockHeight - 1n),
							}),
						}
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => {
					assertOsmosisNetwork(network)
					const limit = resolverContextRowLimit(context)
					const offset = context.pagination.offset ?? 0
					const { getPools } = await import('$/sources/Osmosis/Rest/queries.ts')
					const {
						pools,
					} = await getPools()
					const window = pools.slice(offset, offset + limit)
					return {
						rows: window.map((pool) => ({
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
						totalCount: pools.length,
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => {
					assertOsmosisNetwork(network)
					const {
						getIbcChannels,
					} = await import('$/sources/Osmosis/Rest/queries.ts')
					const response = await getIbcChannels({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: osmosisIbcChannelListRows(network, response.channels),
						totalCount: osmosisPaginationCount(response.pagination?.total, 'IBC channel'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcChannels: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => {
					assertOsmosisNetwork(network)
					const {
						getIbcClientStates,
					} = await import('$/sources/Osmosis/Rest/queries.ts')
					const response = await getIbcClientStates({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: response.client_states.map((client) => {
							const fields = osmosisIbcClientStableFields(network, client.client_state)

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									clientId: client.client_id,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.IbcClient, [], 'clientType')]: fields.clientType,
									[entityFieldAddressKey(EntityType.IbcClient, [], 'trustLevel')]: fields.trustLevel,
									[entityFieldAddressKey(EntityType.IbcClient, [], 'trustingPeriodNs')]: fields.trustingPeriodNs,
									[entityFieldAddressKey(EntityType.IbcClient, [], 'unbondingPeriodNs')]: fields.unbondingPeriodNs,
									[entityFieldAddressKey(EntityType.IbcClient, [], 'maxClockDriftNs')]: fields.maxClockDriftNs,
									[entityFieldAddressKey(EntityType.IbcClient, [], 'counterpartyChainId')]: fields.counterpartyChainId,
									...(fields.$counterpartyNetwork != null && {
										[entityFieldAddressKey(EntityType.IbcClient, [], '$counterpartyNetwork')]: fields.$counterpartyNetwork,
									}),
								},
							}
						}),
						totalCount: osmosisPaginationCount(response.pagination?.total, 'IBC client'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcClients: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: osmosisNetworkResolverSelectors(
				async (network, context) => {
					assertOsmosisNetwork(network)
					const {
						getIbcConnections,
					} = await import('$/sources/Osmosis/Rest/queries.ts')
					const response = await getIbcConnections({
						limit: resolverContextRowLimit(context),
					})
					return {
						rows: response.connections.map((connection) => {
							const fields = osmosisIbcConnectionStableFields(network, connection)

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									connectionId: connection.id,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.IbcConnection, [], 'clientId')]: fields.clientId,
									[entityFieldAddressKey(EntityType.IbcConnection, [], '$client')]: fields.$client,
									[entityFieldAddressKey(EntityType.IbcConnection, [], 'counterpartyClientId')]: fields.counterpartyClientId,
									...(fields.counterpartyConnectionId != null && {
										[entityFieldAddressKey(EntityType.IbcConnection, [], 'counterpartyConnectionId')]: fields.counterpartyConnectionId,
									}),
									[entityFieldAddressKey(EntityType.IbcConnection, [], 'delayPeriodNs')]: fields.delayPeriodNs,
								},
							}
						}),
						totalCount: osmosisPaginationCount(response.pagination?.total, 'IBC connection'),
					}
				}
			),
		})({
			Cosmos: {
				$$ibcConnections: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.IbcChannel,
			resolve: {
				NetworkPortIdChannelId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						portId,
						channelId,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getIbcChannel,
							getIbcClientState,
							getIbcConnection,
							getIbcNextSequenceReceive,
							getIbcNextSequenceSend,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							channel,
						} = await getIbcChannel({
							portId,
							channelId,
						})
						const connectionId = channel.connection_hops[0]
						if (connectionId === '')
							throw new Error(`${Source.Osmosis_LCD_Rest}: IBC channel missing connection hop`)

						const [
							{
								connection,
							},
							nextSequenceSend,
							nextSequenceReceive,
						] = await Promise.all([
							getIbcConnection({
								connectionId,
							}),
							getIbcNextSequenceSend({
								portId,
								channelId,
							}),
							getIbcNextSequenceReceive({
								portId,
								channelId,
							}),
						])
						const {
							client_state: clientState,
						} = await getIbcClientState({
							clientId: connection.client_id,
						})
						const $counterpartyNetwork = osmosisCounterpartyNetworkReference(clientState.chain_id)
						return {
							$connection: {
								[EntityMetaKey.Selector]: {
									$network,
									connectionId,
								},
							},
							$client: {
								[EntityMetaKey.Selector]: {
									$network,
									clientId: connection.client_id,
								},
							},
							counterpartyChainId: clientState.chain_id,
							...($counterpartyNetwork != null && {
								$counterpartyNetwork,
							}),
							counterpartyPortId: channel.counterparty.port_id,
							counterpartyChannelId: channel.counterparty.channel_id,
							state: channel.state,
							ordering: channel.ordering,
							version: channel.version,
							nextSequenceSend: osmosisUnsignedInteger(
								nextSequenceSend.next_sequence_send,
								'next sequence send'
							),
							nextSequenceReceive: osmosisUnsignedInteger(
								nextSequenceReceive.next_sequence_receive,
								'next sequence receive'
							),
						}
					},
				},
			},
		})({
			$connection: (channel) => channel.$connection,
			$client: (channel) => channel.$client,
			counterpartyChainId: (channel) => channel.counterpartyChainId,
			$counterpartyNetwork: (channel) => channel.$counterpartyNetwork,
			counterpartyPortId: (channel) => channel.counterpartyPortId,
			counterpartyChannelId: (channel) => channel.counterpartyChannelId,
			state: (channel) => channel.state,
			ordering: (channel) => channel.ordering,
			version: (channel) => channel.version,
			nextSequenceSend: (channel) => channel.nextSequenceSend,
			nextSequenceReceive: (channel) => channel.nextSequenceReceive,
		}),

		defineResolver({
			entityType: EntityType.IbcConnection,
			resolve: {
				NetworkConnectionId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						connectionId,
					}, context) => {
						assertOsmosisNetwork($network)
						const {
							getIbcConnectionChannels,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const response = await getIbcConnectionChannels({
							connectionId,
							limit: resolverContextRowLimit(context),
						})
						return {
							rows: osmosisIbcChannelListRows($network, response.channels),
							totalCount: osmosisPaginationCount(response.pagination?.total, 'IBC connection channel'),
						}
					},
				},
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcConnection,
			resolve: {
				NetworkConnectionId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						connectionId,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getIbcConnection,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							connection,
						} = await getIbcConnection({
							connectionId,
						})
						return {
							...osmosisIbcConnectionStableFields($network, connection),
							state: connection.state,
						}
					},
				},
			},
		})({
			clientId: (connection) => connection.clientId,
			$client: (connection) => connection.$client,
			counterpartyClientId: (connection) => connection.counterpartyClientId,
			counterpartyConnectionId: (connection) => connection.counterpartyConnectionId,
			state: (connection) => connection.state,
			delayPeriodNs: (connection) => connection.delayPeriodNs,
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getIbcClientConnections,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							connection_paths: connectionPaths,
						} = await getIbcClientConnections({
							clientId,
						})
						return {
							rows: connectionPaths.map((path) => ({
								[EntityMetaKey.Selector]: {
									$network,
									connectionId: osmosisIbcConnectionIdFromPath(path),
								},
							})),
							totalCount: connectionPaths.length,
						}
					},
				},
			},
		})({
			$$connections: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}, context) => {
						assertOsmosisNetwork($network)
						const {
							getIbcClientConnections,
							getIbcConnectionChannels,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							connection_paths: connectionPaths,
						} = await getIbcClientConnections({
							clientId,
						})
						const limit = resolverContextRowLimit(context)
						const connectionIds = connectionPaths.map(osmosisIbcConnectionIdFromPath)
						const channelPages = await Promise.all(
							connectionIds.map((connectionId) => (
								getIbcConnectionChannels({
									connectionId,
									limit,
								})
							))
						)
						const rows = []
						for (const page of channelPages) {
							for (const row of osmosisIbcChannelListRows($network, page.channels)) {
								if (rows.length >= limit)
									break

								rows.push(row)
							}
							if (rows.length >= limit)
								break
						}
						return {
							rows,
							totalCount: channelPages.reduce(
								(sum, page) => (
									sum + osmosisPaginationCount(page.pagination?.total, 'IBC client channel')
								),
								0
							),
						}
					},
				},
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcClient,
			resolve: {
				NetworkClientId: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async ({
						$network,
						clientId,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getIbcClientState,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							client_state: clientState,
						} = await getIbcClientState({
							clientId,
						})
						return {
							...osmosisIbcClientStableFields($network, clientState),
							latestHeight: clientState.latest_height,
							frozenHeight: clientState.frozen_height,
						}
					},
				},
			},
		})({
			clientType: (client) => client.clientType,
			latestHeight: (client) => client.latestHeight,
			frozenHeight: (client) => client.frozenHeight,
			trustLevel: (client) => client.trustLevel,
			trustingPeriodNs: (client) => client.trustingPeriodNs,
			unbondingPeriodNs: (client) => client.unbondingPeriodNs,
			maxClockDriftNs: (client) => client.maxClockDriftNs,
			counterpartyChainId: (client) => client.counterpartyChainId,
			$counterpartyNetwork: (client) => client.$counterpartyNetwork,
		}),
	],
}
