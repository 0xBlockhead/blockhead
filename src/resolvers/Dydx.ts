import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type DydxSubaccountId = EntitySelector<typeof schema, EntityType.DydxChainSubaccount>

type DydxLiveMarket = {
	marketKind: string
}

type DydxLiveMarketObservation = {
	fundingRate?: string
	openInterest?: string
	oraclePrice?: string
	status?: string
}

const dydxNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.dydx.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.dydx.slug,
		},
	},
] as const

const dydxMarketApplicability = [
	{
		$network: dydxNetworkApplicability[0],
	},
	{
		$network: dydxNetworkApplicability[1],
	},
] as const

const dydxSubaccountApplicability = [
	{
		$network: dydxNetworkApplicability[0],
	},
	{
		$network: dydxNetworkApplicability[1],
	},
] as const

const assertDydxMainnet = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.dydx.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.dydx.caip2.namespace
			&& network.caip2.reference === networkBySlug.dydx.caip2.reference
		)
	)
		return

	throw new Error('DydxIndexer: unsupported network')
}

const assertDydxSubaccount = (subaccount: DydxSubaccountId) => {
	assertDydxMainnet(subaccount.$network.$network)
	assertDydxMainnet(subaccount.$account.$network)
}

const parseTimestampMs = (
	value: string,
	field: string
) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`DydxIndexer: invalid ${field}`)

	return timestampMs
}

export const dydxChainNetworkResolver = defineResolver({
	entityType: EntityType.DydxChainNetwork,
	resolve: {
		Network: {
			appliesTo: dydxNetworkApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxMainnet(entitySelector.$network)
				const { getPerpetualMarkets } = await import('$/sources/Dydx/Rest/queries.ts')
				const observation = await getPerpetualMarkets({})

				return {
					markets: Object.values(observation.value.markets)
						.slice(0, resolverContextRowLimit(context)),
					marketCount: Object.keys(observation.value.markets).length,
					observedAtMs: observation.observedAtMs,
				}
			},
		},
	},
	resolveLive: {
		network: {
			facetPath: [],
			publishes: {
				'$$markets': true,
				'$$timestamps': true,
			},
			start: async ({
				fields,
				parentEntitySelector,
				signal,
				trigger,
			}) => {
				assertDydxMainnet(parentEntitySelector.$network)
				const { subscribeDydxIndexer } = await import('$/sources/Dydx/WebSocket/queries.ts')
				const trackedMarketByTicker = new Map<string, DydxLiveMarket>()
				const streamsAbortController = new AbortController()
				const streamSignal = AbortSignal.any([
					signal,
					streamsAbortController.signal,
				])
				let marketCount: number | undefined
				let latestBlock: {
					height: bigint
					timestampMs: number
				} | undefined
				const replaceNetworkTimestampRows = () => {
					if (marketCount === undefined && latestBlock === undefined)
						return

					fields.$$timestamps.replaceRows([{
						source: Source.DydxIndexer,
						value: [{
							[EntityMetaKey.Selector]: {
								$network: parentEntitySelector,
								timestampMs: latestBlock?.timestampMs ?? Date.now(),
								source: Source.DydxIndexer,
							},
							[EntityMetaKey.Fields]: {
								...(latestBlock !== undefined && {
									[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: latestBlock.height,
								}),
								...(marketCount !== undefined && {
									[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'marketCount')]: marketCount,
								}),
							},
						}],
					}])
				}
				const replaceMarketRows = (
					observationsByTicker: ReadonlyMap<string, ReadonlyMap<number, DydxLiveMarketObservation>>
				) => {
					fields.$$markets.replaceRows([{
						source: Source.DydxIndexer,
						value: [...trackedMarketByTicker].map(([ticker, liveMarket]) => {
							const observations = observationsByTicker.get(ticker)

							return {
								[EntityMetaKey.Selector]: {
									$network: parentEntitySelector,
									ticker,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: liveMarket.marketKind,
									...(observations !== undefined && {
										[entityFieldAddressKey(EntityType.DydxChainMarket, [], '$$timestamps')]: [...observations].map(([timestampMs, observation]) => ({
											[EntityMetaKey.Selector]: {
												$market: {
													$network: parentEntitySelector,
													ticker,
												},
												timestampMs,
												source: Source.DydxIndexer,
											},
											[EntityMetaKey.Fields]: {
												...(observation.fundingRate !== undefined && {
													[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: observation.fundingRate,
												}),
												...(observation.openInterest !== undefined && {
													[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: observation.openInterest,
												}),
												...(observation.oraclePrice !== undefined && {
													[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: observation.oraclePrice,
												}),
												...(observation.status !== undefined && {
													[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: observation.status,
												}),
											},
										})),
									}),
								},
							}
						}),
					}])
				}

				try {
					await Promise.all([
						(async () => {
							for await (const message of subscribeDydxIndexer({
								channel: 'v4_markets',
								type: 'subscribe',
							}, streamSignal)) {
								if (streamSignal.aborted)
									return
								if (message.type === 'connected' || message.type === 'pong')
									continue
								if (message.type === 'error')
									throw new Error(`DydxIndexer WebSocket: ${message.message}`)
								if (message.type === 'unsubscribed')
									throw new Error(`DydxIndexer WebSocket: unexpected ${message.channel} unsubscribe`)
								if (message.channel !== 'v4_markets')
									throw new Error(`DydxIndexer WebSocket: unexpected ${message.channel} message`)

								if (message.type === 'subscribed') {
									trackedMarketByTicker.clear()
									marketCount = Object.keys(message.contents.markets).length
									const timestampMs = Date.now()
									const observationsByTicker = new Map<string, Map<number, DydxLiveMarketObservation>>()
									for (const [ticker, market] of Object.entries(message.contents.markets)
										.slice(0, resolverContextRowLimit(trigger))) {
										trackedMarketByTicker.set(ticker, {
											marketKind: market.marketType,
										})
										observationsByTicker.set(ticker, new Map([[timestampMs, {
											fundingRate: market.nextFundingRate,
											openInterest: market.openInterest,
											oraclePrice: market.oraclePrice,
											status: market.status,
										}]]))
									}

									replaceMarketRows(observationsByTicker)
									fields.$$markets.count.replaceRows([{
										source: Source.DydxIndexer,
										value: marketCount,
									}])
									replaceNetworkTimestampRows()
									continue
								}

								const changedMarketTickers = new Set<string>()
								const observationsByTicker = new Map<string, Map<number, DydxLiveMarketObservation>>()
								for (const contents of (
									message.type === 'channel_batch_data' ?
										message.contents
									:
										[message.contents]
								)) {
									const timestampMs = Date.now()
									for (const [ticker, update] of Object.entries(contents.trading ?? {})) {
										const liveMarket = trackedMarketByTicker.get(ticker)
										if (liveMarket === undefined)
											continue

										if (update.marketType !== undefined) {
											liveMarket.marketKind = update.marketType
											changedMarketTickers.add(ticker)
										}

										if (
											update.nextFundingRate === undefined
											&& update.openInterest === undefined
											&& update.status === undefined
										)
											continue

										changedMarketTickers.add(ticker)
										const observationsByTimestamp = observationsByTicker.get(ticker) ?? new Map()
										observationsByTimestamp.set(timestampMs, {
											...observationsByTimestamp.get(timestampMs),
											...(update.nextFundingRate !== undefined && {
												fundingRate: update.nextFundingRate,
											}),
											...(update.openInterest !== undefined && {
												openInterest: update.openInterest,
											}),
											...(update.status !== undefined && {
												status: update.status,
											}),
										})
										observationsByTicker.set(ticker, observationsByTimestamp)
									}

									for (const [ticker, update] of Object.entries(contents.oraclePrices ?? {})) {
										if (!trackedMarketByTicker.has(ticker))
											continue

										changedMarketTickers.add(ticker)
										const timestampMs = parseTimestampMs(update.effectiveAt, 'oracle effectiveAt')
										const observationsByTimestamp = observationsByTicker.get(ticker) ?? new Map()
										observationsByTimestamp.set(timestampMs, {
											...observationsByTimestamp.get(timestampMs),
											oraclePrice: update.oraclePrice,
										})
										observationsByTicker.set(ticker, observationsByTimestamp)
									}
								}

								if (changedMarketTickers.size !== 0)
									replaceMarketRows(observationsByTicker)
							}
						})(),
						(async () => {
							for await (const message of subscribeDydxIndexer({
								channel: 'v4_block_height',
								type: 'subscribe',
							}, streamSignal)) {
								if (streamSignal.aborted)
									return
								if (message.type === 'connected' || message.type === 'pong')
									continue
								if (message.type === 'error')
									throw new Error(`DydxIndexer WebSocket: ${message.message}`)
								if (message.type === 'unsubscribed')
									throw new Error(`DydxIndexer WebSocket: unexpected ${message.channel} unsubscribe`)
								if (message.channel !== 'v4_block_height')
									throw new Error(`DydxIndexer WebSocket: unexpected ${message.channel} message`)

								for (const contents of (
									message.type === 'channel_batch_data' ?
										message.contents
									:
										[message.contents]
								)) {
									latestBlock = {
										height: BigInt(
											message.type === 'subscribed' ?
												contents.height
											:
												contents.blockHeight
										),
										timestampMs: parseTimestampMs(contents.time, 'block height time'),
									}
									replaceNetworkTimestampRows()
								}
							}
						})(),
					])
				} finally {
					streamsAbortController.abort()
				}
			},
		},
	},
})({
	$$markets: (snapshot, network) => snapshot.markets.map((market) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			ticker: market.ticker,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: market.marketType,
		},
	})),
	$$timestamps: (snapshot, network) => [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs: snapshot.observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'marketCount')]: snapshot.marketCount,
		},
	}],
})

export const dydxChainMarketResolver = defineResolver({
	entityType: EntityType.DydxChainMarket,
	resolve: {
		NetworkTicker: {
			appliesTo: dydxMarketApplicability,
			resolve: async (entitySelector) => {
				assertDydxMainnet(entitySelector.$network.$network)
				const { getPerpetualMarkets } = await import('$/sources/Dydx/Rest/queries.ts')
				const observation = await getPerpetualMarkets({
					ticker: entitySelector.ticker,
				})
				if (!Object.hasOwn(observation.value.markets, entitySelector.ticker))
					throw new Error(`DydxIndexer: market not found for ${entitySelector.ticker}`)

				return {
					market: observation.value.markets[entitySelector.ticker],
					observedAtMs: observation.observedAtMs,
				}
			},
		},
	},
})({
	marketKind: (snapshot) => snapshot.market.marketType,
	$$timestamps: (snapshot, market) => [{
		[EntityMetaKey.Selector]: {
			$market: market,
			timestampMs: snapshot.observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: snapshot.market.nextFundingRate,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: snapshot.market.openInterest,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: snapshot.market.oraclePrice,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: snapshot.market.status,
		},
	}],
})

export const dydxChainSubaccountResolver = defineResolver({
	entityType: EntityType.DydxChainSubaccount,
	resolve: {
		NetworkAccountSubaccountNumber: {
			appliesTo: dydxSubaccountApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxSubaccount(entitySelector)
				const { getSubaccount } = await import('$/sources/Dydx/Rest/queries.ts')
				const observation = await getSubaccount({
					address: entitySelector.$account.address,
					subaccountNumber: entitySelector.subaccountNumber,
				})

				return {
					...observation,
					positions: Object.values(observation.value.openPerpetualPositions)
						.slice(0, resolverContextRowLimit(context)),
				}
			},
		},
	},
})({
	$$positions: {
		select: (observation, subaccount) => observation.positions.map((position) => ({
			[EntityMetaKey.Selector]: {
				$subaccount: subaccount,
				$market: {
					$network: subaccount.$network,
					ticker: position.market,
				},
				timestampMs: observation.observedAtMs,
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'blockHeight')]: BigInt(observation.value.updatedAtHeight),
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'side')]: position.side,
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'size')]: position.size,
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'entryPrice')]: position.entryPrice,
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'unrealizedPnl')]: position.unrealizedPnl,
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'realizedPnl')]: position.realizedPnl,
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'netFunding')]: position.netFunding,
			},
		})),
		resolveCount: (observation) => Object.keys(observation.value.openPerpetualPositions).length,
	},
	$$timestamps: (observation, subaccount) => [{
		[EntityMetaKey.Selector]: {
			$subaccount: subaccount,
			timestampMs: observation.observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'blockHeight')]: BigInt(observation.value.updatedAtHeight),
			[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'equity')]: observation.value.equity,
			[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'freeCollateral')]: observation.value.freeCollateral,
			[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'openPositionCount')]: Object.keys(observation.value.openPerpetualPositions).length,
		},
	}],
})

export const dydxChainSubaccountOrdersResolver = defineResolver({
	entityType: EntityType.DydxChainSubaccount,
	resolve: {
		NetworkAccountSubaccountNumber: {
			appliesTo: dydxSubaccountApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxSubaccount(entitySelector)
				const { getOrders } = await import('$/sources/Dydx/Rest/queries.ts')

				return getOrders({
					address: entitySelector.$account.address,
					subaccountNumber: entitySelector.subaccountNumber,
					limit: resolverContextRowLimit(context),
				})
			},
		},
	},
})({
	$$orders: (observation, subaccount) => observation.value.map((order) => ({
		[EntityMetaKey.Selector]: {
			$subaccount: subaccount,
			orderId: order.id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], '$market')]: {
				[EntityMetaKey.Selector]: {
					$network: subaccount.$network,
					ticker: order.ticker,
				},
			},
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'side')]: order.side,
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'orderType')]: order.type,
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'timeInForce')]: order.timeInForce,
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'clientId')]: order.clientId,
			...(order.goodTilBlock != null && {
				[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'goodTilBlock')]: BigInt(order.goodTilBlock),
			}),
			...(order.goodTilBlockTime != null && {
				[entityFieldAddressKey(EntityType.DydxChainOrder, [], 'goodTilBlockTimeMs')]: parseTimestampMs(order.goodTilBlockTime, 'goodTilBlockTime'),
			}),
			[entityFieldAddressKey(EntityType.DydxChainOrder, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$order: {
						$subaccount: subaccount,
						orderId: order.id,
					},
					timestampMs: (
						order.updatedAt != null ?
							parseTimestampMs(order.updatedAt, 'updatedAt')
						:
						order.createdAt != null ?
							parseTimestampMs(order.createdAt, 'createdAt')
						:
							observation.observedAtMs
					),
					source: Source.DydxIndexer,
				},
				[EntityMetaKey.Fields]: {
					...(order.updatedAtHeight != null && {
						[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'blockHeight')]: BigInt(order.updatedAtHeight),
					}),
					...(order.updatedAtHeight == null && order.createdAtHeight != null && {
						[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'blockHeight')]: BigInt(order.createdAtHeight),
					}),
					[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'status')]: order.status,
					[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'price')]: order.price,
					[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'size')]: order.size,
					[entityFieldAddressKey(EntityType.DydxChainOrder_Timestamp, [], 'totalFilled')]: order.totalFilled,
				},
			}],
		},
	})),
})

export const dydxNetworkReferenceResolver = defineResolver({
	entityType: EntityType.Network,
	resolve: {
		Caip2: {
			appliesTo: [dydxNetworkApplicability[0].$network],
			resolve: async (network) => network,
		},
		Slug: {
			appliesTo: [dydxNetworkApplicability[1].$network],
			resolve: async (network) => network,
		},
	},
})({
	Dydx: {
		$dydxChainNetwork: (network) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
			},
		}),
	},
})

export default {
	source: Source.DydxIndexer,

	resolvers: [
		dydxChainMarketResolver,
		dydxChainNetworkResolver,
		dydxChainSubaccountOrdersResolver,
		dydxChainSubaccountResolver,
		dydxNetworkReferenceResolver,
	],
} satisfies RegisteredSourceResolverModule
