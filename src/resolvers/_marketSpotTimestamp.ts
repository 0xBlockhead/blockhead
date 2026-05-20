export type MarketSpotObservation = {
	timestampMs: number
	price: bigint
	transport?: string
	providerAssetId?: string | null
	caip19?: string
	marketCap?: bigint
	volume24h?: bigint
}

export const marketTimestampFieldsFromObservation = (
	observation: MarketSpotObservation,
) => (
	{
		price: observation.price,
		...(observation.transport != null && { transport: observation.transport }),
		...(observation.providerAssetId !== undefined && {
			providerAssetId: observation.providerAssetId,
		}),
		...(observation.caip19 != null && { caip19: observation.caip19 }),
		...(observation.marketCap != null && { marketCap: observation.marketCap }),
		...(observation.volume24h != null && { volume24h: observation.volume24h }),
	}
)
