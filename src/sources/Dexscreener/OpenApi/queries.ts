/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import { getDexscreenerJson } from '$/sources/Dexscreener/OpenApi/client.ts'
import type {
	DexscreenerPair,
	DexscreenerPairsResponse,
	DexscreenerSearchResponse,
	DexscreenerTokenPairsResponse,
} from '$/sources/Dexscreener/OpenApi/types.ts'


const maximumPairs = 100
const maximumLabels = 32
const maximumTimeframes = 32
const unsignedDecimalPattern = /^(0|[1-9]\d*)(\.\d+)?$/

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
		if (!Number.isFinite(value) || (nonnegative && value < 0))
			throw new Error(`Dexscreener_Rest: invalid ${label} ${timeframe}`)
	}
	return Object.fromEntries(entries)
}

const normalizePair = (pair: DexscreenerPair) => {
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
		|| (pair.labels?.length ?? 0) > maximumLabels
	)
		throw new Error('Dexscreener_Rest: incomplete pair identity')

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
	const normalizedTransactions: Partial<Record<string, {
		buys: number
		sells: number
	}>> = Object.fromEntries(txns.map(([timeframe, counts]) => [
		timeframe,
		{
			buys: optionalFiniteNumber(counts.buys ?? 0, `${timeframe} buys`, true) ?? 0,
			sells: optionalFiniteNumber(counts.sells ?? 0, `${timeframe} sells`, true) ?? 0,
		},
	]))

	return {
		chainId: pair.chainId,
		dexId: pair.dexId,
		pairAddress: pair.pairAddress,
		...(pair.url != null && pair.url !== '' && { url: pair.url }),
		labels: pair.labels ?? [],
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
	}
}

const normalizePairs = (pairs: DexscreenerPair[] | null | undefined) => {
	const rows = pairs ?? []
	if (
		rows.length > maximumPairs
		|| new Set(rows.map((pair) => `${pair.chainId}:${pair.pairAddress?.toLowerCase()}`)).size !== rows.length
	)
		throw new Error('Dexscreener_Rest: malformed pair cardinality')
	return rows.map(normalizePair)
}

export const getLatestPairs = async ({
	chainId,
	pairId,
}: {
	chainId: string
	pairId: string
}) => {
	if (chainId === '' || pairId === '')
		throw new Error('Dexscreener_Rest: empty requested pair identity')
	const response = await getDexscreenerJson<DexscreenerPairsResponse>(
		`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`
	)
	const pairs = normalizePairs(response.pairs)
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
	if (chainId === '' || tokenAddress === '')
		throw new Error('Dexscreener_Rest: empty requested token identity')
	const pairs = normalizePairs(
		await getDexscreenerJson<DexscreenerTokenPairsResponse>(
			`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`
		)
	)
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
	return {
		pairs: normalizePairs(response.pairs),
	}
}
