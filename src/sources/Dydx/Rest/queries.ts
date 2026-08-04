import { DecimalString } from '$/schema/DecimalString.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Dydx/bindings.ts'
import type { components } from '$/sources/Dydx/OpenApi/openapi.d.ts'
import {
	dydxAddressPattern,
	dydxIndexerRestPathPrefix,
	dydxMarketTickerPattern,
	dydxPageLimitMax,
	dydxPageLimitMin,
	dydxPerpetualMarketsResponseMax,
	dydxSubaccountNumberMax,
} from '$/sources/Dydx/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'

type DydxPerpetualPosition = components['schemas']['PerpetualPositionResponseObject']

const binding = bindings[Source.DydxIndexer].find(
	({ apiFamily }) => apiFamily === ApiFamily.OpenApiHttp
)

if (binding == null)
	throw new Error('DydxIndexer_Rest: OpenAPI binding is missing')

const assertSubaccount = ({
	address,
	subaccountNumber,
}: {
	address: string
	subaccountNumber: number
}) => {
	if (!dydxAddressPattern.test(address))
		throw new Error(`DydxIndexer_Rest: invalid dYdX address ${address}`)

	if (!Number.isSafeInteger(subaccountNumber) || subaccountNumber < 0 || subaccountNumber > dydxSubaccountNumberMax)
		throw new Error(`DydxIndexer_Rest: invalid subaccount number ${subaccountNumber}`)
}

const assertLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < dydxPageLimitMin || limit > dydxPageLimitMax)
		throw new Error(`DydxIndexer_Rest: invalid page limit ${limit}`)
}

const assertHeight = (height: string) => {
	if (!/^(?:0|[1-9]\d*)$/.test(height))
		throw new Error(`DydxIndexer_Rest: invalid block height ${height}`)
}

const assertDecimal = (value: string, field: string) => {
	if (!DecimalString.allows(value))
		throw new Error(`DydxIndexer_Rest: invalid decimal ${field}`)
}

const assertNonNegativeDecimal = (value: string, field: string) => {
	if (!NonNegativeDecimalString.allows(value))
		throw new Error(`DydxIndexer_Rest: invalid non-negative decimal ${field}`)
}

const observeResponse = async <_Value>(
	request: Promise<_Value>
) => ({
	value: await request,
	observedAtMs: Date.now(),
})

const subaccountQuery = ({
	address,
	subaccountNumber,
	limit,
	createdBeforeOrAtHeight,
}: {
	address: string
	subaccountNumber: number
	limit: number
	createdBeforeOrAtHeight?: string
}) => {
	assertSubaccount({
		address,
		subaccountNumber,
	})
	assertLimit(limit)
	if (createdBeforeOrAtHeight != null)
		assertHeight(createdBeforeOrAtHeight)

	return new URLSearchParams({
		address,
		subaccountNumber: String(subaccountNumber),
		limit: String(limit),
		...(createdBeforeOrAtHeight != null && { createdBeforeOrAtHeight }),
	})
}

const assertPosition = (
	position: DydxPerpetualPosition,
	subaccountNumber: number
) => {
	if (position.subaccountNumber !== subaccountNumber)
		throw new Error('DydxIndexer_Rest: foreign subaccount position')

	for (const [field, value] of Object.entries({
		size: position.size,
		realizedPnl: position.realizedPnl,
		unrealizedPnl: position.unrealizedPnl,
		netFunding: position.netFunding,
	}))
		assertDecimal(value, field)

	for (const [field, value] of Object.entries({
		maxSize: position.maxSize,
		entryPrice: position.entryPrice,
		sumOpen: position.sumOpen,
		sumClose: position.sumClose,
	}))
		assertNonNegativeDecimal(value, field)
}

export const getHeight = async () => {
	const observation = await observeResponse(
		sourceGetJson<components['schemas']['HeightResponse']>(
			binding,
			httpUrl(binding, `${dydxIndexerRestPathPrefix}/height`)
		)
	)
	assertHeight(observation.value.height)
	if (!Number.isFinite(Date.parse(observation.value.time)))
		throw new Error('DydxIndexer_Rest: invalid height time')

	return observation
}

export const getPerpetualMarkets = async ({
	ticker,
}: {
	ticker?: string
}) => {
	if (ticker != null && !dydxMarketTickerPattern.test(ticker))
		throw new Error(`DydxIndexer_Rest: invalid market ticker ${ticker}`)

	const observation = await observeResponse(
		sourceGetJson<components['schemas']['PerpetualMarketResponse']>(
			binding,
			httpUrl(
				binding,
				`${dydxIndexerRestPathPrefix}/perpetualMarkets${ticker == null ? '' : `?ticker=${encodeURIComponent(ticker)}`}`
			)
		)
	)
	if (Object.keys(observation.value.markets).length > dydxPerpetualMarketsResponseMax)
		throw new Error('DydxIndexer_Rest: perpetual market response exceeds bound')

	for (const [marketKey, market] of Object.entries(observation.value.markets)) {
		if (marketKey !== market.ticker || (ticker != null && market.ticker !== ticker))
			throw new Error('DydxIndexer_Rest: mismatched market identity')

		assertNonNegativeDecimal(market.oraclePrice, 'oraclePrice')
		assertNonNegativeDecimal(market.openInterest, 'openInterest')

		for (const [field, value] of Object.entries({
			priceChange24H: market.priceChange24H,
			nextFundingRate: market.nextFundingRate,
		}))
			assertDecimal(value, field)

		for (const [field, value] of Object.entries({
			volume24H: market.volume24H,
			initialMarginFraction: market.initialMarginFraction,
			maintenanceMarginFraction: market.maintenanceMarginFraction,
			tickSize: market.tickSize,
			stepSize: market.stepSize,
			baseOpenInterest: market.baseOpenInterest,
		}))
			assertNonNegativeDecimal(value, field)
	}

	return observation
}

export const getSubaccount = async ({
	address,
	subaccountNumber,
}: {
	address: string
	subaccountNumber: number
}) => {
	assertSubaccount({
		address,
		subaccountNumber,
	})
	const observation = await observeResponse(
		sourceGetJson<components['schemas']['SubaccountResponseObject']>(
			binding,
			httpUrl(
				binding,
				`${dydxIndexerRestPathPrefix}/addresses/${encodeURIComponent(address)}/subaccountNumber/${subaccountNumber}`
			)
		)
	)
	if (
		observation.value.address !== address
		|| observation.value.subaccountNumber !== subaccountNumber
	)
		throw new Error('DydxIndexer_Rest: mismatched subaccount identity')

	assertDecimal(observation.value.equity, 'equity')
	assertDecimal(observation.value.freeCollateral, 'freeCollateral')
	assertHeight(observation.value.updatedAtHeight)
	assertHeight(observation.value.latestProcessedBlockHeight)
	for (const position of Object.values(observation.value.openPerpetualPositions))
		assertPosition(position, subaccountNumber)

	return observation
}

export const getOrders = async ({
	address,
	subaccountNumber,
	limit = 100,
}: {
	address: string
	subaccountNumber: number
	limit?: number
}) => {
	const query = subaccountQuery({
		address,
		subaccountNumber,
		limit,
	})
	const observation = await observeResponse(
		sourceGetJson<components['schemas']['OrderResponseObject'][]>(
			binding,
			httpUrl(binding, `${dydxIndexerRestPathPrefix}/orders?${query}`)
		)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer_Rest: order response exceeds requested limit')

	for (const order of observation.value) {
		if (order.subaccountNumber !== subaccountNumber)
			throw new Error('DydxIndexer_Rest: foreign subaccount order')
		for (const [field, value] of Object.entries({
			price: order.price,
			size: order.size,
			totalFilled: order.totalFilled,
		}))
			assertNonNegativeDecimal(value, field)
	}

	return observation
}

export const getFills = async ({
	address,
	subaccountNumber,
	limit = 100,
	createdBeforeOrAtHeight,
}: {
	address: string
	subaccountNumber: number
	limit?: number
	createdBeforeOrAtHeight?: string
}) => {
	const query = subaccountQuery({
		address,
		subaccountNumber,
		limit,
		createdBeforeOrAtHeight,
	})
	const observation = await observeResponse(
		sourceGetJson<components['schemas']['FillResponse']>(
			binding,
			httpUrl(binding, `${dydxIndexerRestPathPrefix}/fills?${query}`)
		)
			.then(({ fills }) => fills)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer_Rest: fill response exceeds requested limit')

	for (const fill of observation.value) {
		if (fill.subaccountNumber !== subaccountNumber)
			throw new Error('DydxIndexer_Rest: foreign subaccount fill')
		assertHeight(fill.createdAtHeight)
		for (const [field, value] of Object.entries({
			fee: fill.fee,
		}))
			assertDecimal(value, field)

		for (const [field, value] of Object.entries({
			price: fill.price,
			size: fill.size,
			affiliateRevShare: fill.affiliateRevShare,
		}))
			assertNonNegativeDecimal(value, field)
	}

	return observation
}

export const getPerpetualPositions = async ({
	address,
	subaccountNumber,
	limit = 100,
	createdBeforeOrAtHeight,
}: {
	address: string
	subaccountNumber: number
	limit?: number
	createdBeforeOrAtHeight?: string
}) => {
	const query = subaccountQuery({
		address,
		subaccountNumber,
		limit,
		createdBeforeOrAtHeight,
	})
	const observation = await observeResponse(
		sourceGetJson<components['schemas']['PerpetualPositionResponse']>(
			binding,
			httpUrl(binding, `${dydxIndexerRestPathPrefix}/perpetualPositions?${query}`)
		)
			.then(({ positions }) => positions)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer_Rest: position response exceeds requested limit')
	for (const position of observation.value)
		assertPosition(position, subaccountNumber)

	return observation
}
