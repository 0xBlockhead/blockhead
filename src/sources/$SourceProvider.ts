import type { Type } from 'arktype'

import type { SourceDefinition, SourcePublicEnvWire } from '$/sources/$Source.ts'

export type SourceOrigin = {
	origin: string
	/** Expected cross-origin `fetch` works without `/api-proxy` — must match what that provider’s HTTP client passes to `$/lib/http.ts` (`corsEnabled`). Also used for `/api-proxy` allow-list in `hooks.server.ts`. */
	corsEnabled: boolean
}

export type SourceProviderDefinition = {
	provider: SourceProvider
	label: string
	env?: Type<SourcePublicEnvWire>
	origins?: readonly SourceOrigin[]
	sources: readonly SourceDefinition[]
}

export enum SourceProvider {
	_Constants = '_Constants',
	Allium = 'Allium',
	AtprotoBsky = 'AtprotoBsky',
	Beacon = 'Beacon',
	Blockscout = 'Blockscout',
	Caips = 'Caips',
	Chainlist = 'Chainlist',
	Coingecko = 'Coingecko',
	CoinMarketCap = 'CoinMarketCap',
	Coinpaprika = 'Coinpaprika',
	Defillama = 'Defillama',
	Dexscreener = 'Dexscreener',
	Dune = 'Dune',
	Ensips = 'Ensips',
	EthereumEips = 'EthereumEips',
	EthereumLists = 'EthereumLists',
	Etherscan = 'Etherscan',
	Evm = 'Evm',
	Explorer = 'Explorer',
	Farcaster = 'Farcaster',
	Github = 'Github',
	Hypersnap = 'Hypersnap',
	Ipfs = 'Ipfs',
	Lens = 'Lens',
	Lifi = 'Lifi',
	Local = 'Local',
	Mastodon = 'Mastodon',
	Neynar = 'Neynar',
	Openchain = 'Openchain',
	Reddit = 'Reddit',
	Snapchain = 'Snapchain',
	Sourcify = 'Sourcify',
	TheGraph = 'TheGraph',
	Voltaire = 'Voltaire',
	X = 'X',
}
