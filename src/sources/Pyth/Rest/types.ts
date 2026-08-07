import { type as arktype } from 'arktype'

/** Fixed-point integer strings from Hermes / Benchmarks (`price` / `conf`). */
export const pythFixedPointIntegerString = '/^-?(0|[1-9]\\d*)$/'

/** 32-byte price feed id, optional `0x`, case-insensitive. */
export const pythPriceFeedIdWire = '/^(0x)?[0-9A-Fa-f]{64}$/'

export const pythRpcPriceWire = arktype({
	price: pythFixedPointIntegerString,
	conf: pythFixedPointIntegerString,
	expo: 'number.integer',
	publish_time: 'number.integer >= 0',
})

export type PythRpcPrice = typeof pythRpcPriceWire.infer

export const pythParsedPriceUpdateMetadataWire = arktype({
	'prev_publish_time?': 'number.integer >= 0 | null',
	'proof_available_time?': 'number.integer >= 0 | null',
	'slot?': 'number.integer >= 0 | null',
})

export const pythParsedPriceUpdateWire = arktype({
	id: pythPriceFeedIdWire,
	price: pythRpcPriceWire,
	ema_price: pythRpcPriceWire,
	metadata: pythParsedPriceUpdateMetadataWire,
})

export type PythParsedPriceUpdate = typeof pythParsedPriceUpdateWire.infer

export const pythBinaryUpdateWire = arktype({
	encoding: "'hex' | 'base64'",
	data: 'string[]',
})

export const pythPriceUpdateResponseWire = arktype({
	binary: pythBinaryUpdateWire,
	'parsed?': pythParsedPriceUpdateWire.array().or(arktype.null),
})

export type PythPriceUpdateResponse = typeof pythPriceUpdateResponseWire.infer

/** Hermes `GET /v2/price_feeds` row. */
export const pythHermesPriceFeedMetadataWire = arktype({
	id: pythPriceFeedIdWire,
	attributes: 'Record<string, string>',
})

export type PythHermesPriceFeedMetadata = typeof pythHermesPriceFeedMetadataWire.infer

export const pythHermesPriceFeedsResponseWire = pythHermesPriceFeedMetadataWire.array()

export type PythHermesPriceFeedsResponse = typeof pythHermesPriceFeedsResponseWire.infer

const pythBenchmarksMarketHoursWire = arktype({
	is_open: 'boolean',
	'next_open': 'number.integer >= 0 | null',
	'next_close': 'number.integer >= 0 | null',
})

/** Benchmarks `GET /v1/price_feeds/` / `/{id}` row. */
export const pythBenchmarksPriceFeedWire = arktype({
	id: pythPriceFeedIdWire,
	market_hours: pythBenchmarksMarketHoursWire.or(arktype.null),
	attributes: 'Record<string, string>',
})

export type PythBenchmarksPriceFeed = typeof pythBenchmarksPriceFeedWire.infer

export const pythBenchmarksPriceFeedsResponseWire = pythBenchmarksPriceFeedWire.array()

export type PythBenchmarksPriceFeedsResponse = typeof pythBenchmarksPriceFeedsResponseWire.infer
