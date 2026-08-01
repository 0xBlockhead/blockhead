import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Dydx/bindings.ts'
import type { components } from '$/sources/Dydx/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

type DydxPerpetualPosition = components['schemas']['PerpetualPositionResponseObject']

const binding = bindings[Source.DydxIndexer]

const decimalPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/
const addressPattern = /^dydx1[023456789acdefghjklmnpqrstuvwxyz]{38}$/
const tickerPattern = /^[A-Z0-9][A-Z0-9._-]{1,63}$/

const assertSubaccount = ({
	address,
	subaccountNumber,
}: {
	address: string
	subaccountNumber: number
}) => {
	if (!addressPattern.test(address))
		throw new Error(`DydxIndexer: invalid dYdX address ${address}`)

	if (!Number.isSafeInteger(subaccountNumber) || subaccountNumber < 0 || subaccountNumber > 128_000)
		throw new Error(`DydxIndexer: invalid subaccount number ${subaccountNumber}`)
}

const assertLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`DydxIndexer: invalid page limit ${limit}`)
}

const assertHeight = (height: string) => {
	if (!/^(?:0|[1-9]\d*)$/.test(height))
		throw new Error(`dYdX chain: invalid block height ${height}`)
}

const assertDecimal = (value: string, field: string) => {
	if (!decimalPattern.test(value))
		throw new Error(`DydxIndexer: invalid decimal ${field}`)
}

const observeIndexer = async <_Value>(
	request: Promise<_Value>
) => {
	const [value, indexerHeight] = await Promise.all([
		request,
		sourceGetJson<components['schemas']['HeightResponse']>(
			binding,
			httpUrl(binding, '/v4/height')
		),
	])
	assertHeight(indexerHeight.height)
	return {
		value,
		indexedAtHeight: indexerHeight.height,
		indexedAtTime: indexerHeight.time,
	}
}

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
		throw new Error('DydxIndexer: foreign subaccount position')

	for (const [field, value] of Object.entries({
		size: position.size,
		maxSize: position.maxSize,
		entryPrice: position.entryPrice,
		realizedPnl: position.realizedPnl,
		unrealizedPnl: position.unrealizedPnl,
		sumOpen: position.sumOpen,
		sumClose: position.sumClose,
		netFunding: position.netFunding,
	}))
		assertDecimal(value, field)
}

export const getPerpetualMarkets = async ({
	ticker,
}: {
	ticker?: string
}) => {
	if (ticker != null && !tickerPattern.test(ticker))
		throw new Error(`DydxIndexer: invalid market ticker ${ticker}`)

	const observation = await observeIndexer(
		sourceGetJson<components['schemas']['PerpetualMarketResponse']>(
			binding,
			httpUrl(
				binding,
				`/v4/perpetualMarkets${ticker == null ? '' : `?ticker=${encodeURIComponent(ticker)}`}`
			)
		)
	)
	if (Object.keys(observation.value.markets).length > 500)
		throw new Error('DydxIndexer: perpetual market response exceeds bound')

	for (const [marketKey, market] of Object.entries(observation.value.markets)) {
		if (marketKey !== market.ticker || (ticker != null && market.ticker !== ticker))
			throw new Error('DydxIndexer: mismatched market identity')

		assertDecimal(market.oraclePrice, 'oraclePrice')

		for (const [field, value] of Object.entries({
			priceChange24H: market.priceChange24H,
			volume24H: market.volume24H,
			nextFundingRate: market.nextFundingRate,
			initialMarginFraction: market.initialMarginFraction,
			maintenanceMarginFraction: market.maintenanceMarginFraction,
			openInterest: market.openInterest,
			tickSize: market.tickSize,
			stepSize: market.stepSize,
			baseOpenInterest: market.baseOpenInterest,
		}))
			assertDecimal(value, field)
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
	const observation = await observeIndexer(
		sourceGetJson<components['schemas']['SubaccountResponseObject']>(
			binding,
			httpUrl(
				binding,
				`/v4/addresses/${encodeURIComponent(address)}/subaccountNumber/${subaccountNumber}`
			)
		)
	)
	if (
		observation.value.address !== address
		|| observation.value.subaccountNumber !== subaccountNumber
	)
		throw new Error('DydxIndexer: mismatched subaccount identity')

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
	const observation = await observeIndexer(
		sourceGetJson<components['schemas']['OrderResponseObject'][]>(
			binding,
			httpUrl(binding, `/v4/orders?${query}`)
		)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer: order response exceeds requested limit')

	for (const order of observation.value) {
		if (order.subaccountNumber !== subaccountNumber)
			throw new Error('DydxIndexer: foreign subaccount order')
		for (const [field, value] of Object.entries({
			price: order.price,
			size: order.size,
			totalFilled: order.totalFilled,
		}))
			assertDecimal(value, field)
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
	const observation = await observeIndexer(
		sourceGetJson<components['schemas']['FillResponse']>(
			binding,
			httpUrl(binding, `/v4/fills?${query}`)
		)
			.then(({ fills }) => fills)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer: fill response exceeds requested limit')

	for (const fill of observation.value) {
		if (fill.subaccountNumber !== subaccountNumber)
			throw new Error('DydxIndexer: foreign subaccount fill')
		assertHeight(fill.createdAtHeight)
		for (const [field, value] of Object.entries({
			price: fill.price,
			size: fill.size,
			fee: fill.fee,
			affiliateRevShare: fill.affiliateRevShare,
		}))
			assertDecimal(value, field)
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
	const observation = await observeIndexer(
		sourceGetJson<components['schemas']['PerpetualPositionResponse']>(
			binding,
			httpUrl(binding, `/v4/perpetualPositions?${query}`)
		)
			.then(({ positions }) => positions)
	)
	if (observation.value.length > limit)
		throw new Error('DydxIndexer: position response exceeds requested limit')
	for (const position of observation.value)
		assertPosition(position, subaccountNumber)

	return observation
}
