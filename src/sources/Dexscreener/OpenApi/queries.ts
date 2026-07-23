/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import { getDexscreenerJson } from '$/sources/Dexscreener/OpenApi/client.ts'
import type {
	DexscreenerPair,
	DexscreenerPairObservation,
	DexscreenerPairObservationsResponse,
	DexscreenerPairsResponse,
	DexscreenerSearchResponse,
	DexscreenerTokenPairsResponse,
} from '$/sources/Dexscreener/OpenApi/types.ts'
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

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
		throw new Error(`Dexscreener_OpenApi: invalid ${label}`)
	return value
}

const normalizeTimeframeNumbers = (
	values: Record<string, number> | undefined,
	label: string,
	nonnegative = true
) => {
	const entries = Object.entries(values ?? {})
	if (entries.length > maximumTimeframes)
		throw new Error(`Dexscreener_OpenApi: excessive ${label} timeframes`)
	for (const [timeframe, value] of entries) {
		if (!Number.isFinite(value) || (nonnegative && value < 0))
			throw new Error(`Dexscreener_OpenApi: invalid ${label} ${timeframe}`)
	}
	return Object.fromEntries(entries)
}

const normalizePair = (
	pair: DexscreenerPair,
	resolvedAtMs: number
): DexscreenerPairObservation => {
	if (!Number.isSafeInteger(resolvedAtMs) || resolvedAtMs < 0)
		throw new Error('Dexscreener_OpenApi: invalid observation time')
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
		throw new Error('Dexscreener_OpenApi: incomplete pair identity')

	const txns = Object.entries(pair.txns ?? {})
	if (txns.length > maximumTimeframes)
		throw new Error('Dexscreener_OpenApi: excessive transaction timeframes')

	for (const value of [
		pair.priceNative,
		pair.priceUsd,
	]) {
		if (value != null && !unsignedDecimalPattern.test(value))
			throw new Error('Dexscreener_OpenApi: invalid price units')
	}
	const liquidityUsd = optionalFiniteNumber(pair.liquidity?.usd, 'USD liquidity')
	const liquidityBase = optionalFiniteNumber(pair.liquidity?.base, 'base liquidity')
	const liquidityQuote = optionalFiniteNumber(pair.liquidity?.quote, 'quote liquidity')
	const fdv = optionalFiniteNumber(pair.fdv, 'FDV')
	const marketCap = optionalFiniteNumber(pair.marketCap, 'market cap')
	const pairCreatedAt = optionalFiniteNumber(pair.pairCreatedAt, 'pair creation time', true)

	return {
		source: Source.Dexscreener_OpenApi,
		resolvedAtMs,
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
		txns: Object.fromEntries(txns.map(([timeframe, counts]) => [
			timeframe,
			{
				buys: optionalFiniteNumber(counts.buys ?? 0, `${timeframe} buys`, true) ?? 0,
				sells: optionalFiniteNumber(counts.sells ?? 0, `${timeframe} sells`, true) ?? 0,
			},
		])),
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

const normalizePairs = (
	pairs: DexscreenerPair[] | null | undefined,
	resolvedAtMs: number
): DexscreenerPairObservation[] => {
	const rows = pairs ?? []
	if (
		rows.length > maximumPairs
		|| new Set(rows.map((pair) => `${pair.chainId}:${pair.pairAddress?.toLowerCase()}`)).size !== rows.length
	)
		throw new Error('Dexscreener_OpenApi: malformed pair cardinality')
	return rows.map((pair) => normalizePair(pair, resolvedAtMs))
}

export const getLatestPairs = async ({
	binding,
	chainId,
	pairId,
	resolvedAtMs = Date.now(),
}: {
	binding: SourceBinding
	chainId: string
	pairId: string
	resolvedAtMs?: number
}): Promise<DexscreenerPairObservationsResponse> => {
	if (chainId === '' || pairId === '')
		throw new Error('Dexscreener_OpenApi: empty requested pair identity')
	const response = await getDexscreenerJson<DexscreenerPairsResponse>(
		binding,
		`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`
	)
	const pairs = normalizePairs(response.pairs, resolvedAtMs)
	if (pairs.some((pair) => (
		pair.chainId !== chainId
		|| pair.pairAddress.toLowerCase() !== pairId.toLowerCase()
	)))
		throw new Error('Dexscreener_OpenApi: pair response does not match requested identity')
	return { pairs }
}

export const getTokenPairs = async ({
	binding,
	chainId,
	tokenAddress,
	resolvedAtMs = Date.now(),
}: {
	binding: SourceBinding
	chainId: string
	tokenAddress: string
	resolvedAtMs?: number
}): Promise<DexscreenerPairObservation[]> => {
	if (chainId === '' || tokenAddress === '')
		throw new Error('Dexscreener_OpenApi: empty requested token identity')
	const pairs = normalizePairs(
		await getDexscreenerJson<DexscreenerTokenPairsResponse>(
			binding,
			`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`
		),
		resolvedAtMs
	)
	if (pairs.some((pair) => (
		pair.chainId !== chainId
		|| (
			pair.baseToken.address.toLowerCase() !== tokenAddress.toLowerCase()
			&& pair.quoteToken.address.toLowerCase() !== tokenAddress.toLowerCase()
		)
	)))
		throw new Error('Dexscreener_OpenApi: token pair response does not match requested identity')
	return pairs
}

export const getPairSearch = async ({
	binding,
	q,
	resolvedAtMs = Date.now(),
}: {
	binding: SourceBinding
	q: string
	resolvedAtMs?: number
}): Promise<DexscreenerPairObservationsResponse> => {
	if (q.trim() === '')
		throw new Error('Dexscreener_OpenApi: empty pair search')
	const response = await getDexscreenerJson<DexscreenerSearchResponse>(
		binding,
		`/latest/dex/search?q=${encodeURIComponent(q)}`
	)
	return {
		pairs: normalizePairs(response.pairs, resolvedAtMs),
	}
}
