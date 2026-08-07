/**
 * Dexscreener OpenAPI / live REST wire shapes (fail-closed arktype envelopes).
 *
 * @see https://docs.dexscreener.com/api/reference
 * @see ./openapi.yml
 */

import { type as arktype } from 'arktype'


const nullableString = arktype('string | null')


const dexscreenerTokenWire = arktype({
	'address?': nullableString,
	'name?': nullableString,
	'symbol?': nullableString,
})

const dexscreenerWebsiteWire = arktype({
	'url?': 'string',
})

const dexscreenerSocialWire = arktype({
	'platform?': 'string',
	'handle?': 'string',
})

/** Live pair `info` retains OpenAPI fields plus tip leftover `openGraph`. */
export const dexscreenerPairInfoWire = arktype({
	'imageUrl?': nullableString,
	'openGraph?': nullableString,
	'websites?': dexscreenerWebsiteWire.array().or(arktype('null')),
	'socials?': dexscreenerSocialWire.array().or(arktype('null')),
})

export type DexscreenerPairInfo = typeof dexscreenerPairInfoWire.infer

export const dexscreenerPairBoostsWire = arktype({
	'active?': 'number.integer >= 0',
})

export type DexscreenerPairBoosts = typeof dexscreenerPairBoostsWire.infer

export const dexscreenerTxnCountsWire = arktype({
	buys: 'number',
	sells: 'number',
})

export type DexscreenerTxnCounts = typeof dexscreenerTxnCountsWire.infer

export const dexscreenerPairWire = arktype({
	'chainId?': 'string',
	'dexId?': 'string',
	'url?': 'string',
	'pairAddress?': 'string',
	'labels?': arktype('string[]').or(arktype('null')),
	'baseToken?': dexscreenerTokenWire,
	'quoteToken?': dexscreenerTokenWire,
	'priceNative?': 'string',
	'priceUsd?': nullableString,
	'txns?': 'Record<string, unknown>',
	'volume?': 'Record<string, number>',
	'priceChange?': arktype('Record<string, number>').or(arktype('null')),
	'liquidity?': arktype({
		'usd?': 'number | null',
		'base?': 'number',
		'quote?': 'number',
	}).or(arktype('null')),
	'fdv?': 'number | null',
	'marketCap?': 'number | null',
	'pairCreatedAt?': 'number.integer | null',
	'info?': dexscreenerPairInfoWire,
	'boosts?': dexscreenerPairBoostsWire,
})

export type DexscreenerPair = typeof dexscreenerPairWire.infer

/**
 * Latest-pairs / search envelopes.
 * Live tip leftovers: optional singular `pair` beside `pairs` (+ documented `schemaVersion`).
 */
const dexscreenerPairRowWire = dexscreenerPairWire.or(arktype('null'))

export const dexscreenerPairsResponseWire = arktype({
	'schemaVersion?': 'string',
	'pairs?': dexscreenerPairRowWire.array().or(arktype('null')),
	'pair?': dexscreenerPairWire,
})

export type DexscreenerPairsResponse = typeof dexscreenerPairsResponseWire.infer

export const dexscreenerPairListWire = dexscreenerPairRowWire.array()

export type DexscreenerTokenPairsResponse = typeof dexscreenerPairListWire.infer
export type DexscreenerTokensResponse = typeof dexscreenerPairListWire.infer

export type DexscreenerSearchResponse = DexscreenerPairsResponse


const dexscreenerLinkWire = arktype({
	'type?': nullableString,
	'label?': nullableString,
	'url?': 'string',
})

/** Token profile / boost / community-takeover row (live arrays; OpenAPI sometimes types a singular object). */
export const dexscreenerTokenMarketingWire = arktype({
	'url?': 'string',
	'chainId?': 'string',
	'tokenAddress?': 'string',
	'amount?': 'number',
	'totalAmount?': 'number',
	'icon?': nullableString,
	'header?': nullableString,
	'openGraph?': nullableString,
	'description?': nullableString,
	'links?': dexscreenerLinkWire.array().or(arktype('null')),
	'claimDate?': 'string',
})

export type DexscreenerTokenMarketing = typeof dexscreenerTokenMarketingWire.infer

export const dexscreenerTokenMarketingListWire = dexscreenerTokenMarketingWire.array()

export type DexscreenerTokenMarketingList = typeof dexscreenerTokenMarketingListWire.infer

export const dexscreenerOrderWire = arktype({
	'chainId?': 'string',
	'tokenAddress?': 'string',
	'type?': "'tokenProfile' | 'communityTakeover' | 'tokenAd' | 'trendingBarAd'",
	'status?': "'processing' | 'cancelled' | 'on-hold' | 'approved' | 'rejected'",
	'paymentTimestamp?': 'number.integer >= 0',
})

export type DexscreenerOrder = typeof dexscreenerOrderWire.infer

/**
 * Live `/orders/v1/{chainId}/{tokenAddress}` returns `{ orders, boosts }` —
 * OpenAPI still documents a bare order array.
 */
export const dexscreenerOrdersResponseWire = arktype({
	orders: dexscreenerOrderWire.array(),
	'boosts?': dexscreenerTokenMarketingListWire,
}).or(dexscreenerOrderWire.array())

export type DexscreenerOrdersResponse = typeof dexscreenerOrdersResponseWire.infer
