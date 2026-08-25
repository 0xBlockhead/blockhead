import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Pyth/bindings.ts'
import type { paths } from '$/sources/Pyth/OpenApi/openapi.d.ts'
import {
	pythBenchmarksPriceFeedWire,
	pythBenchmarksPriceFeedsResponseWire,
	pythHermesPriceFeedsResponseWire,
	pythPriceUpdateResponseWire,
	type PythBenchmarksPriceFeed,
	type PythBenchmarksPriceFeedsResponse,
	type PythHermesPriceFeedsResponse,
	type PythPriceUpdateResponse,
} from '$/sources/Pyth/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const hermesBinding = Object.fromEntries(bindings[Source.PythHermes_Rest].map((binding) => [binding.target.key, binding]))['pyth-hermes']
const benchmarksBinding = Object.fromEntries(bindings[Source.PythBenchmarks_Rest].map((binding) => [binding.target.key, binding]))['pyth-benchmarks']

const assertPriceFeedId = (id: string) => {
	if (!/^[0-9a-f]{64}$/i.test(id))
		throw new Error(`Pyth_Rest: invalid price feed id ${id}`)
	return id.toLowerCase()
}

const assertPriceFeedIds = (ids: string[]) => {
	if (ids.length === 0)
		throw new Error('Pyth_Rest: price update requires at least one price feed id')
	const normalizedIds = ids.map(assertPriceFeedId)
	if (new Set(normalizedIds).size !== normalizedIds.length)
		throw new Error('Pyth_Rest: duplicate price feed id')
	return normalizedIds
}

const assertPriceUpdateIdentities = (
	priceUpdate: PythPriceUpdateResponse,
	requestedIds: string[]
) => {
	if (priceUpdate.parsed == null)
		return
	const parsedIds = new Set<string>()
	for (const parsedUpdate of priceUpdate.parsed) {
		const id = assertPriceFeedId(parsedUpdate.id.replace(/^0x/i, ''))
		if (!requestedIds.includes(id))
			throw new Error(`Pyth_Rest: foreign price update id ${parsedUpdate.id}`)
		if (parsedIds.has(id))
			throw new Error(`Pyth_Rest: duplicate price update id ${parsedUpdate.id}`)

		parsedIds.add(id)
	}
}

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`Pyth_Rest: invalid ${label} response envelope`)
	}
}

export const getPriceFeeds = async (
	parameters: NonNullable<paths['/v2/price_feeds']['get']['parameters']['query']> = {}
): Promise<PythHermesPriceFeedsResponse> => (
	assertEnvelope(
		'Hermes price feeds',
		pythHermesPriceFeedsResponseWire,
		await getJson(
			hermesBinding,
			`/v2/price_feeds${
				parameters.query != null || parameters.asset_type != null ?
					`?${new URLSearchParams({
						...(parameters.query != null && { query: parameters.query }),
						...(parameters.asset_type != null && { asset_type: parameters.asset_type }),
					})}`
					:
					''
			}`
		)
	)
)

const providerClockMsFor = (
	priceUpdate: PythPriceUpdateResponse
): number => {
	if (priceUpdate.parsed == null || priceUpdate.parsed.length === 0)
		throw new Error('Pyth_Rest: parsed price update missing for provider clock')
	return priceUpdate.parsed[0].price.publish_time * 1000
}

export const getLatestPriceUpdates = async (
	parameters: paths['/v2/updates/price/latest']['get']['parameters']['query']
): Promise<{
	priceUpdate: PythPriceUpdateResponse
	fetchedAtMs: number
	providerClockMs: number
}> => {
	const ids = assertPriceFeedIds(parameters['ids[]'])
	const priceUpdate = assertEnvelope(
		'Hermes latest price updates',
		pythPriceUpdateResponseWire,
		await getJson(
			hermesBinding,
			`/v2/updates/price/latest?${new URLSearchParams([
				...ids.map((id) => ['ids[]', id]),
				...(parameters.encoding != null ? [['encoding', parameters.encoding]] : []),
				...(parameters.parsed != null ? [['parsed', String(parameters.parsed)]] : []),
				...(parameters.ignore_invalid_price_ids != null ?
					[['ignore_invalid_price_ids', String(parameters.ignore_invalid_price_ids)]]
					:
					[]),
			])}`
		)
	)
	assertPriceUpdateIdentities(priceUpdate, ids)

	return {
		priceUpdate,
		fetchedAtMs: Date.now(),
		providerClockMs: providerClockMsFor(priceUpdate),
	}
}

export const getBenchmarkPriceFeeds = async (
	parameters: {
		query?: string
		asset_type?: string
	} = {}
): Promise<PythBenchmarksPriceFeedsResponse> => (
	assertEnvelope(
		'Benchmarks price feeds',
		pythBenchmarksPriceFeedsResponseWire,
		await getJson(
			benchmarksBinding,
			`/v1/price_feeds/${
				parameters.query != null || parameters.asset_type != null ?
					`?${new URLSearchParams({
						...(parameters.query != null && { query: parameters.query }),
						...(parameters.asset_type != null && { asset_type: parameters.asset_type }),
					})}`
					:
					''
			}`
		)
	)
)

export const getBenchmarkPriceFeed = async (
	id: string
): Promise<PythBenchmarksPriceFeed> => {
	const normalizedId = assertPriceFeedId(id)
	const priceFeed = assertEnvelope(
		'Benchmarks price feed',
		pythBenchmarksPriceFeedWire,
		await getJson(
			benchmarksBinding,
			`/v1/price_feeds/${encodeURIComponent(normalizedId)}`
		)
	)
	if (assertPriceFeedId(priceFeed.id.replace(/^0x/i, '')) !== normalizedId)
		throw new Error('Pyth_Rest: Benchmarks price feed does not match requested identity')
	return priceFeed
}

export const getBenchmarkPriceUpdateAt = async (
	{
		timestampSec,
		ids,
		encoding = 'hex',
		parsed = true,
	}: {
		timestampSec: number
		ids: string[]
		encoding?: 'hex' | 'base64'
		parsed?: boolean
	}
): Promise<{
	priceUpdate: PythPriceUpdateResponse
	fetchedAtMs: number
	providerClockMs: number
}> => {
	if (!Number.isSafeInteger(timestampSec) || timestampSec < 0)
		throw new Error(`Pyth_Rest: invalid Benchmarks price update timestamp ${timestampSec}`)
	const normalizedIds = assertPriceFeedIds(ids)

	const priceUpdate = assertEnvelope(
		'Benchmarks price update',
		pythPriceUpdateResponseWire,
		await getJson(
			benchmarksBinding,
			`/v1/updates/price/${timestampSec}?${new URLSearchParams([
				...normalizedIds.map((id) => ['ids', id]),
				['encoding', encoding],
				['parsed', String(parsed)],
			])}`
		)
	)
	assertPriceUpdateIdentities(priceUpdate, normalizedIds)

	return {
		priceUpdate,
		fetchedAtMs: Date.now(),
		providerClockMs: providerClockMsFor(priceUpdate),
	}
}
