import type { Type } from 'arktype'

import type { SourceProvider } from '$/sources/$SourceProvider.ts'

/** String-keyed map of public env (matches `$env/dynamic/public` after coercing missing values to `''`). */
export type SourcePublicEnvWire = Record<string, string>

export enum Source {
	Allium_Rest = 'Allium_Rest',
	Atproto_Xrpc = 'Atproto_Xrpc',
	Beacon_Rest = 'Beacon_Rest',
	Blobscan_Rest = 'Blobscan_Rest',
	Blockscout_Rest = 'Blockscout_Rest',
	Caips_Github = 'Caips_Github',
	Chainlist_Rest = 'Chainlist_Rest',
	Coingecko_OpenApi = 'Coingecko_OpenApi',
	Coingecko_Rest = 'Coingecko_Rest',
	CoinMarketCap_Rest = 'CoinMarketCap_Rest',
	Coinpaprika_OpenApi = 'Coinpaprika_OpenApi',
	Constants_Internal = 'Constants_Internal',
	Defillama_OpenApi = 'Defillama_OpenApi',
	Defillama_Rest = 'Defillama_Rest',
	Dexscreener_OpenApi = 'Dexscreener_OpenApi',
	Dune_Rest = 'Dune_Rest',
	Ensips_Github = 'Ensips_Github',
	EthereumEips_Github = 'EthereumEips_Github',
	EthereumLists_Rest = 'EthereumLists_Rest',
	EthereumSpecs_Github = 'EthereumSpecs_Github',
	Etherscan_Rest = 'Etherscan_Rest',
	Farcaster_Rest = 'Farcaster_Rest',
	Ipfs_Rest = 'Ipfs_Rest',
	L2Beat_Rest = 'L2Beat_Rest',
	Lens_Graphql = 'Lens_Graphql',
	Lifi_Rest = 'Lifi_Rest',
	Local_Internal = 'Local_Internal',
	Mastodon_Rest = 'Mastodon_Rest',
	MetadataVision_Rest = 'MetadataVision_Rest',
	MevRelay_Rest = 'MevRelay_Rest',
	Neynar_Rest = 'Neynar_Rest',
	Openchain_Rest = 'Openchain_Rest',
	Reddit_Rest = 'Reddit_Rest',
	Snapchain_Rest = 'Snapchain_Rest',
	Sourcify_Rest = 'Sourcify_Rest',
	Superchain_Github = 'Superchain_Github',
	Swarm_Rest = 'Swarm_Rest',
	TheGraph_Graphql = 'TheGraph_Graphql',
	TradingView_Rest = 'TradingView_Rest',
	Voltaire_JsonRpc = 'Voltaire_JsonRpc',
	X_Rest = 'X_Rest',
}

export type SourceDefinition = {
	provider: SourceProvider
	source: Source
	label: string
	env?: Type<SourcePublicEnvWire>
}
