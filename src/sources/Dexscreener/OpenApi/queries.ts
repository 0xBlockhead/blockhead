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
import type {
	DexscreenerPair,
	DexscreenerPairsResponse,
	DexscreenerSearchResponse,
	DexscreenerTokenPairsResponse,
	DexscreenerTokensResponse,
} from '$/sources/Dexscreener/OpenApi/types.ts'


const unsignedDecimalPattern = /^(0|[1-9]\d*)(\.\d+)?$/

const requireApiChainId = (
	chainId: string,
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

const normalizePair = (
	pair: DexscreenerPair | null | undefined,
	resolvedAtMs: number,
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

	const txns = Object.entries(pair.txns ?? {})
	if (txns.length > maximumTimeframes)
		throw new Error('Dexscreener_Rest: excessive transaction timeframes')

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
	const normalizedTransactions = Object.fromEntries(txns.map(([timeframe, counts]) => {
		if (timeframe === '')
			throw new Error('Dexscreener_Rest: empty transaction timeframe key')
		if (counts == null || counts.buys == null || counts.sells == null)
			throw new Error(`Dexscreener_Rest: incomplete ${timeframe} transaction counts`)
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
		txns: normalizedTransactions,
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
		resolvedAtMs,
	}
}

const normalizePairs = (
	pairs: DexscreenerPair[] | null | undefined,
	resolvedAtMs = Date.now(),
	label = 'pairs',
) => {
	if (!Array.isArray(pairs))
		throw new Error(`Dexscreener_Rest: invalid ${label} response envelope`)
	const rows = pairs
	if (
		rows.length > maximumPairs
		|| new Set(rows.map((pair) => `${pair?.chainId}:${pair?.pairAddress?.toLowerCase()}`)).size !== rows.length
	)
		throw new Error('Dexscreener_Rest: malformed pair cardinality')
	return rows.map((pair) => normalizePair(pair, resolvedAtMs))
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
	const response = await getDexscreenerJson<DexscreenerPairsResponse>(
		`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`
	)
	if (response == null || !Array.isArray(response.pairs))
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
	const response = await getDexscreenerJson<DexscreenerTokenPairsResponse>(
		`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`
	)
	if (!Array.isArray(response))
		throw new Error('Dexscreener_Rest: invalid token-pairs response envelope')
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
	const response = await getDexscreenerJson<DexscreenerTokensResponse>(
		`/tokens/v1/${encodeURIComponent(chainId)}/${tokenAddresses.map(encodeURIComponent).join(',')}`
	)
	if (!Array.isArray(response))
		throw new Error('Dexscreener_Rest: invalid tokens response envelope')
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
	const response = await getDexscreenerJson<DexscreenerSearchResponse>(
		`/latest/dex/search?q=${encodeURIComponent(q)}`
	)
	if (response == null || !Array.isArray(response.pairs))
		throw new Error('Dexscreener_Rest: invalid pair-search response envelope')
	return {
		pairs: normalizePairs(response.pairs, Date.now(), 'pair-search'),
	}
}
