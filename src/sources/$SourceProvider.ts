import type { Type } from 'arktype'

import type { SourceDefinition, SourcePublicEnv } from '$/sources/$Source.ts'

export type SourceOrigin = {
	origin: string
	/** Expected cross-origin `fetch` works without `/api-proxy` — must match what that provider’s HTTP client passes to `$/lib/http.ts` (`corsEnabled`). Also used for `/api-proxy` allow-list in `hooks.server.ts`. */
	corsEnabled: boolean
}

export type SourceProviderDefinition = {
	provider: SourceProvider
	label: string
	env?: Type<SourcePublicEnv>
	origins?: readonly SourceOrigin[]
	sources: readonly SourceDefinition[]
}

export enum SourceProvider {
	_Constants = '_Constants',
	Allium = 'Allium',
	AtprotoBsky = 'AtprotoBsky',
	AtprotoBskySocial = 'AtprotoBskySocial',
	Beacon = 'Beacon',
	Blobscan = 'Blobscan',
	Blockscout = 'Blockscout',
	Caips = 'Caips',
	Chainlist = 'Chainlist',
	Coingecko = 'Coingecko',
	CoinMarketCap = 'CoinMarketCap',
	Coinpaprika = 'Coinpaprika',
	Defillama = 'Defillama',
	Dexscreener = 'Dexscreener',
	Eip8004Scan = 'Eip8004Scan',
	Dune = 'Dune',
	Ensips = 'Ensips',
	EthereumEips = 'EthereumEips',
	EthereumLists = 'EthereumLists',
	EthereumSpecs = 'EthereumSpecs',
	Etherscan = 'Etherscan',
	Farcaster = 'Farcaster',
	Fedi = 'Fedi',
	FxEmbed = 'FxEmbed',
	Ipfs = 'Ipfs',
	L2Beat = 'L2Beat',
	Lens = 'Lens',
	LensHey = 'LensHey',
	Lifi = 'Lifi',
	Local = 'Local',
	Mastodon = 'Mastodon',
	MetadataVision = 'MetadataVision',
	MevRelay = 'MevRelay',
	Neynar = 'Neynar',
	NostrBand = 'NostrBand',
	Openchain = 'Openchain',
	Piped = 'Piped',
	Primal = 'Primal',
	Reddit = 'Reddit',
	RedditPublic = 'RedditPublic',
	Rss = 'Rss',
	Rss2Json = 'Rss2Json',
	Snapchain = 'Snapchain',
	Sourcify = 'Sourcify',
	Superchain = 'Superchain',
	Swarm = 'Swarm',
	TheGraph = 'TheGraph',
	TradingView = 'TradingView',
	Voltaire = 'Voltaire',
	X = 'X',
	Youtube = 'Youtube',
}
