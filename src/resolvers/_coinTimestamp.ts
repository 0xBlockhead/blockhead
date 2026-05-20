export type CoinFundamentalsObservation = {
	timestampMs: number
	marketCap?: bigint
	change24hPercent?: number
	transport?: string
	providerAssetId?: string
}

export const coinTimestampFieldsFromObservation = (
	observation: CoinFundamentalsObservation,
) => (
	{
		...(observation.marketCap != null && { marketCap: observation.marketCap }),
		...(observation.change24hPercent != null && {
			change24hPercent: observation.change24hPercent,
		}),
		...(observation.transport != null && { transport: observation.transport }),
		...(observation.providerAssetId != null && {
			providerAssetId: observation.providerAssetId,
		}),
	}
)
