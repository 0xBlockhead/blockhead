// Types


// Constants
export enum MarketVenueId {
	Binance = 'Binance',
	Coinbase = 'Coinbase',
	Deribit = 'Deribit',
	Kraken = 'Kraken',
	Kucoin = 'Kucoin',
	Okx = 'Okx',
	PancakeSwap = 'PancakeSwap',
	SpotIndex = 'SpotIndex',
	Uniswap = 'Uniswap',
}

export const marketVenues = [
	{
		id: MarketVenueId.Binance,
		label: 'Binance',
	},
	{
		id: MarketVenueId.Coinbase,
		label: 'Coinbase',
	},
	{
		id: MarketVenueId.Deribit,
		label: 'Deribit',
	},
	{
		id: MarketVenueId.Kraken,
		label: 'Kraken',
	},
	{
		id: MarketVenueId.Kucoin,
		label: 'KuCoin',
	},
	{
		id: MarketVenueId.Okx,
		label: 'OKX',
	},
	{
		id: MarketVenueId.PancakeSwap,
		label: 'PancakeSwap',
	},
	{
		id: MarketVenueId.SpotIndex,
		label: 'Spot index',
	},
	{
		id: MarketVenueId.Uniswap,
		label: 'Uniswap',
	},
] as const satisfies readonly {
	id: MarketVenueId
	label: string
}[]


// Lookups

export const marketVenueById = Object.fromEntries(
	marketVenues.map((marketVenue) => [
		marketVenue.id,
		marketVenue,
	]),
) as {
	[Id in MarketVenueId]: Extract<(typeof marketVenues)[number], { id: Id }>
}
