/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import {
	maximumLabels,
	maximumPairs,
	maximumTimeframes,
	maximumTokenAddresses,
	numericChainIdByDexscreenerApiChainLabel,
} from '$/sources/Dexscreener/OpenApi/constants.ts'
import { getDexscreenerJson } from '$/sources/Dexscreener/OpenApi/client.ts'
import {
	dexscreenerOrdersResponseWire,
	dexscreenerPairListWire,
	dexscreenerPairsResponseWire,
	dexscreenerTokenMarketingListWire,
	dexscreenerTxnCountsWire,
	type DexscreenerPair,
} from '$/sources/Dexscreener/OpenApi/types.ts'


const unsignedDecimalPattern = /^(0|[1-9]\d*)(\.\d+)?$/

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Dexscreener_Rest: invalid ${label} response envelope`)
	}
}

const requireApiChainId = (
	chainId: string
) => {
	if (chainId === '' || !numericChainIdByDexscreenerApiChainLabel.has(chainId))
		throw new Error(`Dexscreener_Rest: unsupported chain ${chainId}`)
}

const optionalFiniteNumber = (
	value: number | undefined | null,
	label: string,
	integer = false,
	nonnegative = true
) => {
	if (value == null) return undefined
	if (
		!Number.isFinite(value)
		|| (nonnegative && value < 0)
		|| (integer && !Number.isSafeInteger(value))
	)
		throw new Error(`Dexscreener_Rest: invalid ${label}`)
	return value
}

const normalizeTimeframeNumbers = (
	values: Record<string, number> | undefined,
	label: string,
	nonnegative = true
) => {
	const entries = Object.entries(values ?? {})
	if (entries.length > maximumTimeframes)
		throw new Error(`Dexscreener_Rest: excessive ${label} timeframes`)
	for (const [timeframe, value] of entries) {
		if (timeframe === '')
			throw new Error(`Dexscreener_Rest: empty ${label} timeframe key`)
		if (!Number.isFinite(value) || (nonnegative && value < 0))
			throw new Error(`Dexscreener_Rest: invalid ${label} ${timeframe}`)
	}
	return Object.fromEntries(entries)
}

const normalizeTxnCounts = (
	txns: Record<string, unknown> | undefined
) => {
	const entries = Object.entries(txns ?? {})
	if (entries.length > maximumTimeframes)
		throw new Error('Dexscreener_Rest: excessive transaction timeframes')
	return Object.fromEntries(entries.map(([timeframe, rawCounts]) => {
		if (timeframe === '')
			throw new Error('Dexscreener_Rest: empty transaction timeframe key')
		let counts
		try {
			counts = dexscreenerTxnCountsWire.assert(rawCounts)
		} catch {
			throw new Error(`Dexscreener_Rest: incomplete ${timeframe} transaction counts`)
		}
		const buys = optionalFiniteNumber(counts.buys, `${timeframe} buys`, true)
		const sells = optionalFiniteNumber(counts.sells, `${timeframe} sells`, true)
		if (buys == null || sells == null)
			throw new Error(`Dexscreener_Rest: incomplete ${timeframe} transaction counts`)
		return [
			timeframe,
			{
				buys,
				sells,
			},
		]
	}))
}

const normalizePairInfo = (
	info: DexscreenerPair['info']
) => {
	if (info == null)
		return undefined
	const websites = info.websites ?? undefined
	const socials = info.socials ?? undefined
	if (websites != null && websites.some((website) => website.url === ''))
		throw new Error('Dexscreener_Rest: malformed pair info websites')
	if (socials != null && socials.some((social) => (
		(social.platform != null && social.platform === '')
		|| (social.handle != null && social.handle === '')
	)))
		throw new Error('Dexscreener_Rest: malformed pair info socials')
	return {
		...(info.imageUrl != null && info.imageUrl !== '' && { imageUrl: info.imageUrl }),
		...(info.openGraph != null && info.openGraph !== '' && { openGraph: info.openGraph }),
		...(websites != null && { websites }),
		...(socials != null && { socials }),
	}
}

const normalizePair = (
	pair: DexscreenerPair | null | undefined,
	resolvedAtMs: number
) => {
	if (pair == null)
		throw new Error('Dexscreener_Rest: null pair row')
	if (
		pair.chainId == null
		|| pair.chainId === ''
		|| pair.dexId == null
		|| pair.dexId === ''
		|| pair.pairAddress == null
		|| pair.pairAddress === ''
		|| pair.baseToken?.address == null
		|| pair.baseToken.address === ''
		|| pair.baseToken.name == null
		|| pair.baseToken.symbol == null
		|| pair.quoteToken?.address == null
		|| pair.quoteToken.address === ''
		|| pair.quoteToken.name == null
		|| pair.quoteToken.symbol == null
	)
		throw new Error('Dexscreener_Rest: incomplete pair identity')

	const labels = pair.labels ?? []
	if (
		labels.length > maximumLabels
		|| labels.some((label) => label === '')
	)
		throw new Error('Dexscreener_Rest: malformed pair labels')

	for (const value of [
		pair.priceNative,
		pair.priceUsd,
	]) {
		if (value != null && !unsignedDecimalPattern.test(value))
			throw new Error('Dexscreener_Rest: invalid price units')
	}
	const liquidityUsd = optionalFiniteNumber(pair.liquidity?.usd, 'USD liquidity')
	const liquidityBase = optionalFiniteNumber(pair.liquidity?.base, 'base liquidity')
	const liquidityQuote = optionalFiniteNumber(pair.liquidity?.quote, 'quote liquidity')
	const fdv = optionalFiniteNumber(pair.fdv, 'FDV')
	const marketCap = optionalFiniteNumber(pair.marketCap, 'market cap')
	const pairCreatedAt = optionalFiniteNumber(pair.pairCreatedAt, 'pair creation time', true)
	const boostsActive = optionalFiniteNumber(pair.boosts?.active, 'active boosts', true)
	const info = normalizePairInfo(pair.info)

	return {
		chainId: pair.chainId,
		dexId: pair.dexId,
		pairAddress: pair.pairAddress,
		...(pair.url != null && pair.url !== '' && { url: pair.url }),
		labels,
		baseToken: {
			address: pair.baseToken.address,
			name: pair.baseToken.name,
			symbol: pair.baseToken.symbol,
		},
		quoteToken: {
			address: pair.quoteToken.address,
			name: pair.quoteToken.name,
			symbol: pair.quoteToken.symbol,
		},
		...(pair.priceNative != null && { priceNative: pair.priceNative }),
		...(pair.priceUsd != null && { priceUsd: pair.priceUsd }),
		txns: normalizeTxnCounts(pair.txns),
		volume: normalizeTimeframeNumbers(pair.volume, 'volume'),
		priceChange: normalizeTimeframeNumbers(pair.priceChange ?? undefined, 'price change', false),
		...(pair.liquidity != null && {
			liquidity: {
				...(liquidityUsd != null && {
					usd: liquidityUsd,
				}),
				...(liquidityBase != null && {
					base: liquidityBase,
				}),
				...(liquidityQuote != null && {
					quote: liquidityQuote,
				}),
			},
		}),
		...(fdv != null && {
			fdv,
		}),
		...(marketCap != null && {
			marketCap,
		}),
		...(pairCreatedAt != null && {
			pairCreatedAt,
		}),
		...(info != null && {
			info,
		}),
		...(boostsActive != null && {
			boosts: {
				active: boostsActive,
			},
		}),
		resolvedAtMs,
	}
}

const normalizePairs = (
	pairs: (DexscreenerPair | null)[] | null | undefined,
	resolvedAtMs = Date.now(),
	label = 'pairs'
) => {
	if (pairs == null)
		throw new Error(`Dexscreener_Rest: invalid ${label} response envelope`)
	if (
		pairs.length > maximumPairs
		|| new Set(pairs.map((pair) => `${pair?.chainId}:${pair?.pairAddress?.toLowerCase()}`)).size !== pairs.length
	)
		throw new Error('Dexscreener_Rest: malformed pair cardinality')
	return pairs.map((pair) => normalizePair(pair, resolvedAtMs))
}

export const getLatestPairs = async ({
	chainId,
	pairId,
}: {
	chainId: string
	pairId: string
}) => {
	requireApiChainId(chainId)
	if (pairId === '')
		throw new Error('Dexscreener_Rest: empty requested pair identity')
	const response = assertEnvelope(
		'latest-pairs',
		dexscreenerPairsResponseWire,
		await getDexscreenerJson(
			`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`
		)
	)
	if (response.pairs == null)
		throw new Error('Dexscreener_Rest: invalid latest-pairs response envelope')
	const pairs = normalizePairs(response.pairs, Date.now(), 'latest-pairs')
	if (pairs.length === 0)
		throw new Error('Dexscreener_Rest: pair not found')
	if (pairs.some((pair) => (
		pair.chainId !== chainId
		|| pair.pairAddress.toLowerCase() !== pairId.toLowerCase()
	)))
		throw new Error('Dexscreener_Rest: pair response does not match requested identity')
	return { pairs }
}

export const getTokenPairs = async ({
	chainId,
	tokenAddress,
}: {
	chainId: string
	tokenAddress: string
}) => {
	requireApiChainId(chainId)
	if (tokenAddress === '')
		throw new Error('Dexscreener_Rest: empty requested token identity')
	const response = assertEnvelope(
		'token-pairs',
		dexscreenerPairListWire,
		await getDexscreenerJson(
			`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`
		)
	)
	const pairs = normalizePairs(response, Date.now(), 'token-pairs')
	if (pairs.some((pair) => (
		pair.chainId !== chainId
		|| (
			pair.baseToken.address.toLowerCase() !== tokenAddress.toLowerCase()
			&& pair.quoteToken.address.toLowerCase() !== tokenAddress.toLowerCase()
		)
	)))
		throw new Error('Dexscreener_Rest: token pair response does not match requested identity')
	return pairs
}

export const getTokens = async ({
	chainId,
	tokenAddresses,
}: {
	chainId: string
	tokenAddresses: string[]
}) => {
	requireApiChainId(chainId)
	if (
		tokenAddresses.length === 0
		|| tokenAddresses.length > maximumTokenAddresses
		|| tokenAddresses.some((tokenAddress) => tokenAddress === '')
		|| new Set(tokenAddresses.map((tokenAddress) => tokenAddress.toLowerCase())).size !== tokenAddresses.length
	)
		throw new Error('Dexscreener_Rest: malformed token address list')
	const requested = new Set(tokenAddresses.map((tokenAddress) => tokenAddress.toLowerCase()))
	const response = assertEnvelope(
		'tokens',
		dexscreenerPairListWire,
		await getDexscreenerJson(
			`/tokens/v1/${encodeURIComponent(chainId)}/${tokenAddresses.map(encodeURIComponent).join(',')}`
		)
	)
	const pairs = normalizePairs(response, Date.now(), 'tokens')
	if (pairs.some((pair) => (
		pair.chainId !== chainId
		|| (
			!requested.has(pair.baseToken.address.toLowerCase())
			&& !requested.has(pair.quoteToken.address.toLowerCase())
		)
	)))
		throw new Error('Dexscreener_Rest: tokens response does not match requested identity')
	return pairs
}

export const getPairSearch = async ({
	q,
}: {
	q: string
}) => {
	if (q.trim() === '')
		throw new Error('Dexscreener_Rest: empty pair search')
	const response = assertEnvelope(
		'pair-search',
		dexscreenerPairsResponseWire,
		await getDexscreenerJson(
			`/latest/dex/search?q=${encodeURIComponent(q)}`
		)
	)
	if (response.pairs == null)
		throw new Error('Dexscreener_Rest: invalid pair-search response envelope')
	return {
		pairs: normalizePairs(response.pairs, Date.now(), 'pair-search'),
	}
}

export const getLatestTokenProfiles = async () => (
	assertEnvelope(
		'token-profiles',
		dexscreenerTokenMarketingListWire,
		await getDexscreenerJson('/token-profiles/latest/v1')
	)
)

export const getLatestTokenBoosts = async () => (
	assertEnvelope(
		'token-boosts-latest',
		dexscreenerTokenMarketingListWire,
		await getDexscreenerJson('/token-boosts/latest/v1')
	)
)

export const getTopTokenBoosts = async () => (
	assertEnvelope(
		'token-boosts-top',
		dexscreenerTokenMarketingListWire,
		await getDexscreenerJson('/token-boosts/top/v1')
	)
)

export const getTokenOrders = async ({
	chainId,
	tokenAddress,
}: {
	chainId: string
	tokenAddress: string
}) => {
	requireApiChainId(chainId)
	if (tokenAddress === '')
		throw new Error('Dexscreener_Rest: empty requested token identity')
	const response = assertEnvelope(
		'token-orders',
		dexscreenerOrdersResponseWire,
		await getDexscreenerJson(
			`/orders/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`
		)
	)
	const orders = (
		Array.isArray(response) ?
			response
		:
			response.orders
	)
	const boosts = (
		Array.isArray(response) ?
			undefined
		:
			response.boosts
	)
	if (orders.some((order) => (
		(order.chainId != null && order.chainId !== chainId)
		|| (
			order.tokenAddress != null
			&& order.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()
		)
	)))
		throw new Error('Dexscreener_Rest: token orders response does not match requested identity')
	return {
		orders,
		...(boosts != null && { boosts }),
	}
}
