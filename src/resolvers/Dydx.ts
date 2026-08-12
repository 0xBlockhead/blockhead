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
import {
	dydxNextFundingAtMs,
	type DydxPerpetualPosition,
} from '$/sources/Dydx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type DydxPerpetualPositionId = EntitySelector<typeof schema, EntityType.DydxChainPerpetualPosition>
type DydxSubaccountId = EntitySelector<typeof schema, EntityType.DydxChainSubaccount>

type DydxLiveMarket = {
	marketKind: string
}

type DydxLiveMarketObservation = {
	fundingRate?: string
	nextFundingAtMs?: number
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

const dydxOrderApplicability = [
	{
		$subaccount: dydxSubaccountApplicability[0],
	},
	{
		$subaccount: dydxSubaccountApplicability[1],
	},
] as const

const dydxPerpetualPositionApplicability = [
	{
		$subaccount: dydxSubaccountApplicability[0],
		$market: dydxMarketApplicability[0],
	},
	{
		$subaccount: dydxSubaccountApplicability[0],
		$market: dydxMarketApplicability[1],
	},
	{
		$subaccount: dydxSubaccountApplicability[1],
		$market: dydxMarketApplicability[0],
	},
	{
		$subaccount: dydxSubaccountApplicability[1],
		$market: dydxMarketApplicability[1],
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

const assetsFromTicker = (ticker: string) => {
	const separatorIndex = ticker.indexOf('-')
	if (separatorIndex <= 0 || separatorIndex === ticker.length - 1)
		throw new Error(`DydxIndexer: invalid market ticker ${ticker}`)

	return {
		baseAsset: ticker.slice(0, separatorIndex),
		quoteAsset: ticker.slice(separatorIndex + 1),
	}
}

const marginUsageFromEquity = ({
	equity,
	freeCollateral,
}: {
	equity: string
	freeCollateral: string
}) => {
	const equityNumber = Number(equity)
	const freeCollateralNumber = Number(freeCollateral)
	if (
		!Number.isFinite(equityNumber)
		|| !Number.isFinite(freeCollateralNumber)
		|| equityNumber === 0
	)
		return

	return (equityNumber - freeCollateralNumber) / equityNumber
}

type DydxOrderWire = {
	clientId: string
	createdAt?: string
	createdAtHeight?: string
	goodTilBlock?: string
	goodTilBlockTime?: string
	id: string
	price: string
	side: string
	size: string
	status: string
	ticker: string
	timeInForce: string
	totalFilled: string
	type: string
	updatedAt?: string
	updatedAtHeight?: string
}

const projectOrderTimestamps = (
	order: DydxOrderWire,
	subaccount: DydxSubaccountId,
	observedAtMs: number
) => [{
	[EntityMetaKey.Selector]: {
		$order: {
			$subaccount: subaccount,
			orderId: order.id,
		},
		timestampMs: (
			order.updatedAt != null ?
				parseTimestampMs(order.updatedAt, 'updatedAt')
			: order.createdAt != null ?
				parseTimestampMs(order.createdAt, 'createdAt')
			:
				observedAtMs
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
}]

const projectOrderFields = (
	order: DydxOrderWire,
	subaccount: DydxSubaccountId,
	observedAtMs: number
) => ({
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
		[entityFieldAddressKey(EntityType.DydxChainOrder, [], '$$timestamps')]: projectOrderTimestamps(
			order,
			subaccount,
			observedAtMs
		),
	},
})

const projectPerpetualPositionTimestamp = (
	position: DydxPerpetualPosition,
	positionSelector: DydxPerpetualPositionId,
	observedAtMs: number,
	updatedAtHeight?: string
) => {
	return {
		[EntityMetaKey.Selector]: {
			$position: positionSelector,
			timestampMs: observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			...(updatedAtHeight != null && {
				[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'blockHeight')]: BigInt(updatedAtHeight),
			}),
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'side')]: position.side,
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'size')]: position.size,
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'entryPrice')]: position.entryPrice,
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'unrealizedPnl')]: position.unrealizedPnl,
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'realizedPnl')]: position.realizedPnl,
			[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition_Timestamp, [], 'netFunding')]: position.netFunding,
		},
	}
}

const resolveDydxPerpetualPosition = async (
	entitySelector: DydxPerpetualPositionId
) => {
	assertDydxSubaccount(entitySelector.$subaccount)
	assertDydxMainnet(entitySelector.$market.$network.$network)
	const {
		getPerpetualPositions,
		getSubaccount,
	} = await import('$/sources/Dydx/Rest/queries.ts')
	const [
		observation,
		positionsObservation,
	] = await Promise.all([
		getSubaccount({
			address: entitySelector.$subaccount.$account.address,
			subaccountNumber: entitySelector.$subaccount.subaccountNumber,
		}),
		getPerpetualPositions({
			address: entitySelector.$subaccount.$account.address,
			subaccountNumber: entitySelector.$subaccount.subaccountNumber,
		}),
	])
	const position = (
		observation.value.openPerpetualPositions[entitySelector.$market.ticker]
		?? positionsObservation.value
			.filter((candidate) => (
				candidate.market === entitySelector.$market.ticker
				&& candidate.closedAt != null
			))
			.sort((positionA, positionB) => (
				parseTimestampMs(positionB.closedAt ?? positionB.createdAt, 'closedAt')
				- parseTimestampMs(positionA.closedAt ?? positionA.createdAt, 'closedAt')
			)).find(() => true)
	)
	if (position == null)
		throw new Error(`DydxIndexer_Rest: position not found for ${entitySelector.$market.ticker}`)

	return {
		...observation,
		position,
		positionTimestampMs: (
			position.closedAt == null ?
				observation.observedAtMs
			:
				parseTimestampMs(position.closedAt, 'closedAt')
		),
		...(position.closedAt == null && {
			positionUpdatedAtHeight: observation.value.updatedAtHeight,
		}),
	}
}

export const dydxChainNetworkResolver = defineResolver({
	entityType: EntityType.DydxChainNetwork,
	resolve: {
		Network: {
			appliesTo: dydxNetworkApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxMainnet(entitySelector.$network)
				const {
					getHeight,
					getPerpetualMarkets,
				} = await import('$/sources/Dydx/Rest/queries.ts')
				const [
					marketsObservation,
					heightObservation,
				] = await Promise.all([
					getPerpetualMarkets({}),
					getHeight(),
				])

				const blockHeight = BigInt(heightObservation.value.height)
				return {
					markets: Object.values(marketsObservation.value.markets)
						.slice(0, resolverContextRowLimit(context)),
					marketCount: Object.keys(marketsObservation.value.markets).length,
					blockHeight,
					indexerHeight: blockHeight,
					observedAtMs: parseTimestampMs(heightObservation.value.time, 'height time'),
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
									[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'indexerHeight')]: latestBlock.height,
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
							const {
								baseAsset,
								quoteAsset,
							} = assetsFromTicker(ticker)

							return {
								[EntityMetaKey.Selector]: {
									$network: parentEntitySelector,
									ticker,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: baseAsset,
									[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: quoteAsset,
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
												...(observation.nextFundingAtMs !== undefined && {
													[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'nextFundingAtMs')]: observation.nextFundingAtMs,
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
							for await (const message of subscribeDydxIndexer(trigger.sourceBinding, {
								channel: 'v4_markets',
								type: 'subscribe',
							}, streamSignal)) {
								if (streamSignal.aborted)
									return
								if (message.type === 'connected' || message.type === 'pong')
									continue
								if (message.type === 'error')
									throw new Error(`DydxIndexer_WebSocket: ${message.message}`)
								if (message.type === 'unsubscribed')
									throw new Error(`DydxIndexer_WebSocket: unexpected ${message.channel} unsubscribe`)
								if (message.channel !== 'v4_markets')
									throw new Error(`DydxIndexer_WebSocket: unexpected ${message.channel} message`)

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
											nextFundingAtMs: dydxNextFundingAtMs(timestampMs),
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
												nextFundingAtMs: dydxNextFundingAtMs(timestampMs),
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
							for await (const message of subscribeDydxIndexer(trigger.sourceBinding, {
								channel: 'v4_block_height',
								type: 'subscribe',
							}, streamSignal)) {
								if (streamSignal.aborted)
									return
								if (message.type === 'connected' || message.type === 'pong')
									continue
								if (message.type === 'error')
									throw new Error(`DydxIndexer_WebSocket: ${message.message}`)
								if (message.type === 'unsubscribed')
									throw new Error(`DydxIndexer_WebSocket: unexpected ${message.channel} unsubscribe`)
								if (message.channel !== 'v4_block_height')
									throw new Error(`DydxIndexer_WebSocket: unexpected ${message.channel} message`)

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
	$$markets: (snapshot, network) => snapshot.markets.map((market) => {
		const {
			baseAsset,
			quoteAsset,
		} = assetsFromTicker(market.ticker)

		return {
			[EntityMetaKey.Selector]: {
				$network: network,
				ticker: market.ticker,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'baseAsset')]: baseAsset,
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'quoteAsset')]: quoteAsset,
				[entityFieldAddressKey(EntityType.DydxChainMarket, [], 'marketKind')]: market.marketType,
			},
		}
	}),
	$$timestamps: (snapshot, network) => [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs: snapshot.observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: snapshot.blockHeight,
			[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'indexerHeight')]: snapshot.indexerHeight,
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
					throw new Error(`DydxIndexer_Rest: market not found for ${entitySelector.ticker}`)

				return {
					market: observation.value.markets[entitySelector.ticker],
					observedAtMs: observation.observedAtMs,
				}
			},
		},
	},
})({
	baseAsset: (snapshot) => assetsFromTicker(snapshot.market.ticker).baseAsset,
	quoteAsset: (snapshot) => assetsFromTicker(snapshot.market.ticker).quoteAsset,
	marketKind: (snapshot) => snapshot.market.marketType,
	$$timestamps: (snapshot, market) => [{
		[EntityMetaKey.Selector]: {
			$market: market,
			timestampMs: snapshot.observedAtMs,
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: snapshot.market.nextFundingRate,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'nextFundingAtMs')]: dydxNextFundingAtMs(snapshot.observedAtMs),
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'openInterest')]: snapshot.market.openInterest,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: snapshot.market.oraclePrice,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'status')]: snapshot.market.status,
		},
	}],
})

export const dydxChainMarketFundingHistoryResolver = defineResolver({
	entityType: EntityType.DydxChainMarket,
	resolve: {
		NetworkTicker: {
			appliesTo: dydxMarketApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxMainnet(entitySelector.$network.$network)
				const { getHistoricalFunding } = await import('$/sources/Dydx/Rest/queries.ts')

				return getHistoricalFunding({
					ticker: entitySelector.ticker,
					limit: resolverContextRowLimit(context),
				})
			},
		},
	},
})({
	$$timestamps: (observation, market) => observation.value.map((funding) => ({
		[EntityMetaKey.Selector]: {
			$market: market,
			timestampMs: parseTimestampMs(funding.effectiveAt, 'funding effectiveAt'),
			source: Source.DydxIndexer,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'fundingRate')]: funding.rate,
			[entityFieldAddressKey(EntityType.DydxChainMarket_Timestamp, [], 'oraclePrice')]: funding.price,
		},
	})),
})

export const dydxChainSubaccountResolver = defineResolver({
	entityType: EntityType.DydxChainSubaccount,
	resolve: {
		NetworkAccountSubaccountNumber: {
			appliesTo: dydxSubaccountApplicability,
			resolve: async (entitySelector, context) => {
				assertDydxSubaccount(entitySelector)
				const {
					getOrders,
					getPerpetualPositions,
					getSubaccount,
				} = await import('$/sources/Dydx/Rest/queries.ts')
				const {
					dydxPageLimitMax,
				} = await import('$/sources/Dydx/Rest/constants.ts')
				const positionLimit = resolverContextRowLimit(context)
				const [
					observation,
					ordersObservation,
					positionsObservation,
				] = await Promise.all([
					getSubaccount({
						address: entitySelector.$account.address,
						subaccountNumber: entitySelector.subaccountNumber,
					}),
					getOrders({
						address: entitySelector.$account.address,
						subaccountNumber: entitySelector.subaccountNumber,
						limit: dydxPageLimitMax,
					}),
					getPerpetualPositions({
						address: entitySelector.$account.address,
						subaccountNumber: entitySelector.subaccountNumber,
						limit: positionLimit,
					}),
				])

				const positionSnapshotsByMarket = new Map<string, {
					position: DydxPerpetualPosition
					timestampMs: number
					updatedAtHeight?: string
				}[]>()
				for (const position of Object.values(observation.value.openPerpetualPositions))
					positionSnapshotsByMarket.set(position.market, [{
						position,
						timestampMs: observation.observedAtMs,
						updatedAtHeight: observation.value.updatedAtHeight,
					}])
				for (const position of positionsObservation.value)
					if (position.closedAt != null)
						positionSnapshotsByMarket.set(position.market, [
							...(positionSnapshotsByMarket.get(position.market) ?? []),
							{
								position,
								timestampMs: parseTimestampMs(position.closedAt, 'closedAt'),
							},
						])

				return {
					...observation,
					positions: [...positionSnapshotsByMarket.values()].slice(0, positionLimit),
					...(
						ordersObservation.value.length < dydxPageLimitMax ?
							{
								openOrderCount: ordersObservation.value.filter((order) => (
									order.status === 'OPEN'
									|| order.status === 'UNTRIGGERED'
									|| order.status === 'BEST_EFFORT_OPENED'
								)).length,
							}
						:
							{}
					),
				}
			},
		},
	},
})({
	$$positions: {
		select: (observation, subaccount) => observation.positions.map((snapshots) => {
			const positionSelector = {
				$subaccount: subaccount,
				$market: {
					$network: subaccount.$network,
					ticker: snapshots[0].position.market,
				},
			}

			return {
				[EntityMetaKey.Selector]: positionSelector,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainPerpetualPosition, [], '$$timestamps')]: snapshots.map((snapshot) => (
						projectPerpetualPositionTimestamp(
							snapshot.position,
							positionSelector,
							snapshot.timestampMs,
							snapshot.updatedAtHeight
						)
					)),
				},
			}
		}),
	},
	$$timestamps: (observation, subaccount) => {
		const marginUsage = marginUsageFromEquity({
			equity: observation.value.equity,
			freeCollateral: observation.value.freeCollateral,
		})

		return [{
			[EntityMetaKey.Selector]: {
				$subaccount: subaccount,
				timestampMs: observation.observedAtMs,
				source: Source.DydxIndexer,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'blockHeight')]: BigInt(observation.value.updatedAtHeight),
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'equity')]: observation.value.equity,
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'freeCollateral')]: observation.value.freeCollateral,
				...(marginUsage !== undefined && {
					[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'marginUsage')]: marginUsage,
				}),
				[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'openPositionCount')]: Object.keys(observation.value.openPerpetualPositions).length,
				...('openOrderCount' in observation && observation.openOrderCount != null && {
					[entityFieldAddressKey(EntityType.DydxChainSubaccount_Timestamp, [], 'openOrderCount')]: observation.openOrderCount,
				}),
			},
		}]
	},
})

export const dydxChainPerpetualPositionResolver = defineResolver({
	entityType: EntityType.DydxChainPerpetualPosition,
	resolve: {
		SubaccountMarket: {
			appliesTo: dydxPerpetualPositionApplicability,
			resolve: resolveDydxPerpetualPosition,
		},
	},
})({
	$$timestamps: (observation, position) => [
		projectPerpetualPositionTimestamp(
			observation.position,
			position,
			observation.positionTimestampMs,
			observation.positionUpdatedAtHeight
		),
	],
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
	$$orders: (observation, subaccount) => observation.value.map((order) => (
		projectOrderFields(
			order,
			subaccount,
			observation.observedAtMs
		)
	)),
})

export const dydxChainOrderResolver = defineResolver({
	entityType: EntityType.DydxChainOrder,
	resolve: {
		SubaccountOrderId: {
			appliesTo: dydxOrderApplicability,
			resolve: async (entitySelector) => {
				assertDydxSubaccount(entitySelector.$subaccount)
				const { getOrder } = await import('$/sources/Dydx/Rest/queries.ts')
				const observation = await getOrder({
					orderId: entitySelector.orderId,
				})
				if (observation.value.subaccountNumber !== entitySelector.$subaccount.subaccountNumber)
					throw new Error('DydxIndexer_Rest: foreign subaccount order')

				return observation
			},
		},
	},
})({
	$market: (observation, order) => ({
		[EntityMetaKey.Selector]: {
			$network: order.$subaccount.$network,
			ticker: observation.value.ticker,
		},
	}),
	side: (observation) => observation.value.side,
	orderType: (observation) => observation.value.type,
	timeInForce: (observation) => observation.value.timeInForce,
	clientId: (observation) => observation.value.clientId,
	goodTilBlock: (observation) => (
		observation.value.goodTilBlock != null ?
			BigInt(observation.value.goodTilBlock)
		:
			undefined
	),
	goodTilBlockTimeMs: (observation) => (
		observation.value.goodTilBlockTime != null ?
			parseTimestampMs(observation.value.goodTilBlockTime, 'goodTilBlockTime')
		:
			undefined
	),
	$$timestamps: (observation, order) => (
		projectOrderTimestamps(
			observation.value,
			order.$subaccount,
			observation.observedAtMs
		)
	),
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
		dydxChainMarketFundingHistoryResolver,
		dydxChainMarketResolver,
		dydxChainNetworkResolver,
		dydxChainOrderResolver,
		dydxChainPerpetualPositionResolver,
		dydxChainSubaccountOrdersResolver,
		dydxChainSubaccountResolver,
		dydxNetworkReferenceResolver,
	],
} satisfies RegisteredSourceResolverModule
