import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	DydxDecimal,
	DydxFills,
	DydxIndexerHeight,
	DydxIndexerObservation,
	DydxOrder,
	DydxPerpetualMarkets,
	DydxPerpetualPosition,
	DydxPositions,
	DydxSubaccountResponse,
	DydxValidatorLatestBlock,
} from '$/sources/Dydx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

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
		throw new Error(`Dydx_Rest: invalid dYdX address ${address}`)

	if (!Number.isSafeInteger(subaccountNumber) || subaccountNumber < 0 || subaccountNumber > 128_000)
		throw new Error(`Dydx_Rest: invalid subaccount number ${subaccountNumber}`)
}

const assertLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`Dydx_Rest: invalid page limit ${limit}`)
}

const assertHeight = (height: string) => {
	if (!/^(?:0|[1-9]\d*)$/.test(height))
		throw new Error(`Dydx_Rest: invalid block height ${height}`)
}

const assertDecimal = (value: DydxDecimal, field: string) => {
	if (!decimalPattern.test(value))
		throw new Error(`Dydx_Rest: invalid decimal ${field}`)
}

const observeIndexer = async <_Value>(
	binding: SourceBinding,
	request: Promise<_Value>
): Promise<DydxIndexerObservation<_Value>> => {
	const [value, indexerHeight] = await Promise.all([
		request,
		sourceGetJson<DydxIndexerHeight>(binding, httpUrl(binding, '/v4/height')),
	])
	assertHeight(indexerHeight.height)
	return {
		value,
		indexedAtHeight: indexerHeight.height,
		indexedAtTime: indexerHeight.time,
		resolvedAtMs: Date.now(),
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
		throw new Error('Dydx_Rest: foreign subaccount position')

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
	binding,
	ticker,
}: {
	binding: SourceBinding
	ticker?: string
}) => {
	if (ticker != null && !tickerPattern.test(ticker))
		throw new Error(`Dydx_Rest: invalid market ticker ${ticker}`)

	const observation = await observeIndexer(
		binding,
		sourceGetJson<DydxPerpetualMarkets>(
			binding,
			httpUrl(
				binding,
				`/v4/perpetualMarkets${ticker == null ? '' : `?market=${encodeURIComponent(ticker)}`}`
			)
		)
	)
	if (Object.keys(observation.value.markets).length > 500)
		throw new Error('Dydx_Rest: perpetual market response exceeds bound')

	for (const [marketKey, market] of Object.entries(observation.value.markets)) {
		if (marketKey !== market.ticker || (ticker != null && market.ticker !== ticker))
			throw new Error('Dydx_Rest: mismatched market identity')

		for (const [field, value] of Object.entries({
			...(market.oraclePrice != null && { oraclePrice: market.oraclePrice }),
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
	binding,
	address,
	subaccountNumber,
}: {
	binding: SourceBinding
	address: string
	subaccountNumber: number
}) => {
	assertSubaccount({
		address,
		subaccountNumber,
	})
	const observation = await observeIndexer(
		binding,
		sourceGetJson<DydxSubaccountResponse>(
			binding,
			httpUrl(
				binding,
				`/v4/addresses/${encodeURIComponent(address)}/subaccountNumber/${subaccountNumber}`
			)
		).then(({ subaccount }) => subaccount)
	)
	if (
		observation.value.address !== address
		|| observation.value.subaccountNumber !== subaccountNumber
	)
		throw new Error('Dydx_Rest: mismatched subaccount identity')

	assertDecimal(observation.value.equity, 'equity')
	assertDecimal(observation.value.freeCollateral, 'freeCollateral')
	assertHeight(observation.value.updatedAtHeight)
	assertHeight(observation.value.latestProcessedBlockHeight)
	for (const position of Object.values(observation.value.openPerpetualPositions))
		assertPosition(position, subaccountNumber)

	return observation
}

export const getOrders = async ({
	binding,
	address,
	subaccountNumber,
	limit = 100,
}: {
	binding: SourceBinding
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
		binding,
		sourceGetJson<DydxOrder[]>(binding, httpUrl(binding, `/v4/orders?${query}`))
	)
	if (observation.value.length > limit)
		throw new Error('Dydx_Rest: order response exceeds requested limit')

	for (const order of observation.value) {
		if (order.subaccountNumber !== subaccountNumber)
			throw new Error('Dydx_Rest: foreign subaccount order')
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
	binding,
	address,
	subaccountNumber,
	limit = 100,
	createdBeforeOrAtHeight,
}: {
	binding: SourceBinding
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
		binding,
		sourceGetJson<DydxFills>(binding, httpUrl(binding, `/v4/fills?${query}`))
			.then(({ fills }) => fills)
	)
	if (observation.value.length > limit)
		throw new Error('Dydx_Rest: fill response exceeds requested limit')

	for (const fill of observation.value) {
		if (fill.subaccountNumber !== subaccountNumber)
			throw new Error('Dydx_Rest: foreign subaccount fill')
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
	binding,
	address,
	subaccountNumber,
	limit = 100,
	createdBeforeOrAtHeight,
}: {
	binding: SourceBinding
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
		binding,
		sourceGetJson<DydxPositions>(
			binding,
			httpUrl(binding, `/v4/perpetualPositions?${query}`)
		)
			.then(({ positions }) => positions)
	)
	if (observation.value.length > limit)
		throw new Error('Dydx_Rest: position response exceeds requested limit')
	for (const position of observation.value)
		assertPosition(position, subaccountNumber)

	return observation
}

export const getValidatorLatestBlock = async (binding: SourceBinding) => {
	if (
		binding.source !== Source.DydxValidator_Rest
		|| binding.target.kind !== SourceTargetKind.NetworkSlug
		|| binding.target.key !== 'dydx'
		|| !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		|| binding.wireProtocol !== WireProtocol.HttpRest
		|| binding.apiFamily !== ApiFamily.CosmosLcdApi
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericRead)
		|| binding.delivery !== SourceDelivery.RemoteQuery
	)
		throw new Error('Dydx_Rest: expected canonical mainnet validator binding')

	const value = await sourceGetJson<DydxValidatorLatestBlock>(
		binding,
		httpUrl(binding, '/cosmos/base/tendermint/v1beta1/blocks/latest')
	)
	if (value.block.header.chain_id !== 'dydx-mainnet-1')
		throw new Error('Dydx_Rest: validator returned a foreign chain')
	assertHeight(value.block.header.height)
	return value
}
