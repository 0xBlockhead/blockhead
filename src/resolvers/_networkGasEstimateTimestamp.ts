import type { BlockscoutStatsWire } from '$/sources/Blockscout/Rest/types.ts'


export type GasEstimateObservation = {
	timestampMs: number
	slowGwei?: number
	averageGwei?: number
	fastGwei?: number
	legacyGasPriceWei?: bigint
	maxPriorityFeePerGasWei?: bigint
	baseFeePerGasWei?: bigint
	transport?: string
}

export const weiToGweiNumber = (wei: bigint) => (
	Number(wei) / 1e9
)

export const gweiFromDecimalString = (
	raw: string | undefined,
): number | undefined => {
	if (raw == null || raw.trim() === '') return undefined
	const value = Number(raw)
	return Number.isFinite(value) && value >= 0 ?
			value
		:	undefined
}

export const networkGasEstimateTimestampFieldsFromObservation = (
	observation: GasEstimateObservation,
) => (
	{
		...(observation.slowGwei != null && { slowGwei: observation.slowGwei }),
		...(observation.averageGwei != null && { averageGwei: observation.averageGwei }),
		...(observation.fastGwei != null && { fastGwei: observation.fastGwei }),
		...(observation.legacyGasPriceWei != null && {
			legacyGasPriceWei: observation.legacyGasPriceWei,
		}),
		...(observation.maxPriorityFeePerGasWei != null && {
			maxPriorityFeePerGasWei: observation.maxPriorityFeePerGasWei,
		}),
		...(observation.baseFeePerGasWei != null && {
			baseFeePerGasWei: observation.baseFeePerGasWei,
		}),
		...(observation.transport != null && { transport: observation.transport }),
	}
)

export const gasEstimateObservationFromBlockscoutStats = (
	stats: BlockscoutStatsWire,
): GasEstimateObservation | null => {
	const prices = stats.gas_prices
	if (prices == null) return null
	const hasTier = (
		prices.slow != null
		|| prices.average != null
		|| prices.fast != null
	)
	if (!hasTier) return null
	const updatedAtMs = (
		stats.gas_price_updated_at != null ?
			Date.parse(stats.gas_price_updated_at)
		:	NaN
	)
	const timestampMs = (
		Number.isFinite(updatedAtMs) ?
			updatedAtMs
		:	Date.now()
	)
	return {
		timestampMs,
		...(prices.slow != null
			&& Number.isFinite(prices.slow)
			&& prices.slow >= 0 && {
			slowGwei: prices.slow,
		}),
		...(prices.average != null
			&& Number.isFinite(prices.average)
			&& prices.average >= 0 && {
			averageGwei: prices.average,
		}),
		...(prices.fast != null
			&& Number.isFinite(prices.fast)
			&& prices.fast >= 0 && {
			fastGwei: prices.fast,
		}),
		transport: 'blockscout-stats',
	}
}
