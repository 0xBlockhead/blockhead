import { env as publicEnv } from '$env/dynamic/public'
import { type as arktype, type Type } from 'arktype'

import {
	Source,
	type SourceDefinition,
	type SourcePublicEnv,
} from '$/sources/$Source.ts'

import {
	type SourceProviderDefinition,
} from '$/sources/$SourceProvider.ts'

import Allium from '$/sources/Allium/index.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'
import AtprotoBskySocial from '$/sources/AtprotoBskySocial/index.ts'
import Beacon from '$/sources/Beacon/index.ts'
import BitcoinBips from '$/sources/BitcoinBips/index.ts'
import BitcoinCashBcmr from '$/sources/BitcoinCashBcmr/index.ts'
import BitcoinCashChips from '$/sources/BitcoinCashChips/index.ts'
import BitcoinCashNode from '$/sources/BitcoinCashNode/index.ts'
import BitcoinCore from '$/sources/BitcoinCore/index.ts'
import Blobscan from '$/sources/Blobscan/index.ts'
import Blockchair from '$/sources/Blockchair/index.ts'
import Blockscout from '$/sources/Blockscout/index.ts'
import Caips from '$/sources/Caips/index.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import Coingecko from '$/sources/Coingecko/index.ts'
import CoinMarketCap from '$/sources/CoinMarketCap/index.ts'
import Coinpaprika from '$/sources/Coinpaprika/index.ts'
import CometBft from '$/sources/CometBft/index.ts'
import Constants from '$/sources/Constants/index.ts'
import CosmosChainRegistry from '$/sources/CosmosChainRegistry/index.ts'
import CosmosAdrs from '$/sources/CosmosAdrs/index.ts'
import CosmosSdk from '$/sources/CosmosSdk/index.ts'
import Defillama from '$/sources/Defillama/index.ts'
import Dexscreener from '$/sources/Dexscreener/index.ts'
import Eip8004Scan from '$/sources/Eip8004Scan/index.ts'
import Dune from '$/sources/Dune/index.ts'
import DogecoinDips from '$/sources/DogecoinDips/index.ts'
import DogecoinCore from '$/sources/DogecoinCore/index.ts'
import Ensips from '$/sources/Ensips/index.ts'
import EthereumEips from '$/sources/EthereumEips/index.ts'
import EthereumLists from '$/sources/EthereumLists/index.ts'
import EthereumSpecs from '$/sources/EthereumSpecs/index.ts'
import Esplora from '$/sources/Esplora/index.ts'
import Etherscan from '$/sources/Etherscan/index.ts'
import Farcaster from '$/sources/Farcaster/index.ts'
import Fedi from '$/sources/Fedi/index.ts'
import FilecoinFips from '$/sources/FilecoinFips/index.ts'
import Filfox from '$/sources/Filfox/index.ts'
import FxEmbed from '$/sources/FxEmbed/index.ts'
import Helius from '$/sources/Helius/index.ts'
import Hyperliquid from '$/sources/Hyperliquid/index.ts'
import HyperliquidDocs from '$/sources/HyperliquidDocs/index.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import L2Beat from '$/sources/L2Beat/index.ts'
import Lifi from '$/sources/Lifi/index.ts'
import Lens from '$/sources/Lens/index.ts'
import LensHey from '$/sources/LensHey/index.ts'
import Local from '$/sources/Local/index.ts'
import LitecoinCore from '$/sources/LitecoinCore/index.ts'
import LitecoinLips from '$/sources/LitecoinLips/index.ts'
import LightningLnd from '$/sources/LightningLnd/index.ts'
import LightningMempoolSpace from '$/sources/LightningMempoolSpace/index.ts'
import LogosDocs from '$/sources/LogosDocs/index.ts'
import Lotus from '$/sources/Lotus/index.ts'
import Mastodon from '$/sources/Mastodon/index.ts'
import MetadataVision from '$/sources/MetadataVision/index.ts'
import MevRelay from '$/sources/MevRelay/index.ts'
import MempoolSpace from '$/sources/MempoolSpace/index.ts'
import MoneroDaemonRpc from '$/sources/MoneroDaemonRpc/index.ts'
import NearRpc from '$/sources/NearRpc/index.ts'
import NearNeps from '$/sources/NearNeps/index.ts'
import Neynar from '$/sources/Neynar/index.ts'
import NostrBand from '$/sources/NostrBand/index.ts'
import Openchain from '$/sources/Openchain/index.ts'
import Polkadot from '$/sources/Polkadot/index.ts'
import PolkadotRfcs from '$/sources/PolkadotRfcs/index.ts'
import Piped from '$/sources/Piped/index.ts'
import Primal from '$/sources/Primal/index.ts'
import QuilibriumNodeRpc from '$/sources/QuilibriumNodeRpc/index.ts'
import QuilibriumDocs from '$/sources/QuilibriumDocs/index.ts'
import Reddit from '$/sources/Reddit/index.ts'
import RedditPublic from '$/sources/RedditPublic/index.ts'
import Rss from '$/sources/Rss/index.ts'
import Rss2Json from '$/sources/Rss2Json/index.ts'
import Snapchain from '$/sources/Snapchain/index.ts'
import Solana from '$/sources/Solana/index.ts'
import SolanaSimds from '$/sources/SolanaSimds/index.ts'
import Sourcify from '$/sources/Sourcify/index.ts'
import Subscan from '$/sources/Subscan/index.ts'
import SubstrateSidecar from '$/sources/SubstrateSidecar/index.ts'
import Superchain from '$/sources/Superchain/index.ts'
import Swarm from '$/sources/Swarm/index.ts'
import TheGraph from '$/sources/TheGraph/index.ts'
import ThreeXpl from '$/sources/ThreeXpl/index.ts'
import TradingView from '$/sources/TradingView/index.ts'
import TronFullNode from '$/sources/TronFullNode/index.ts'
import TronGrid from '$/sources/TronGrid/index.ts'
import TronScan from '$/sources/TronScan/index.ts'
import TronSolidityNode from '$/sources/TronSolidityNode/index.ts'
import Voltaire from '$/sources/Voltaire/index.ts'
import X from '$/sources/X/index.ts'
import Youtube from '$/sources/Youtube/index.ts'
import ZcashZips from '$/sources/ZcashZips/index.ts'
import Zcashd from '$/sources/Zcashd/index.ts'
import Zebra from '$/sources/Zebra/index.ts'
import ZeroG from '$/sources/ZeroG/index.ts'

export { Source }

const sourceProviderDefinitions = [
	Allium,
	AtprotoBsky,
	AtprotoBskySocial,
	Beacon,
	BitcoinBips,
	BitcoinCashBcmr,
	BitcoinCashChips,
	BitcoinCashNode,
	BitcoinCore,
	Blobscan,
	Blockchair,
	Blockscout,
	Caips,
	Chainlist,
	Coingecko,
	CoinMarketCap,
	Coinpaprika,
	CometBft,
	Constants,
	CosmosChainRegistry,
	CosmosAdrs,
	CosmosSdk,
	Defillama,
	Dexscreener,
	Eip8004Scan,
	Dune,
	DogecoinDips,
	DogecoinCore,
	Ensips,
	EthereumEips,
	EthereumLists,
	EthereumSpecs,
	Esplora,
	Etherscan,
	Farcaster,
	Fedi,
	FilecoinFips,
	Filfox,
	FxEmbed,
	Helius,
	Hyperliquid,
	HyperliquidDocs,
	Ipfs,
	L2Beat,
	Lens,
	LensHey,
	Lifi,
	LitecoinCore,
	LitecoinLips,
	LightningLnd,
	LightningMempoolSpace,
	Local,
	LogosDocs,
	Lotus,
	Mastodon,
	MetadataVision,
	MevRelay,
	MempoolSpace,
	MoneroDaemonRpc,
	NearRpc,
	NearNeps,
	Neynar,
	NostrBand,
	Openchain,
	Polkadot,
	PolkadotRfcs,
	Piped,
	Primal,
	QuilibriumNodeRpc,
	QuilibriumDocs,
	Reddit,
	RedditPublic,
	Rss,
	Rss2Json,
	Snapchain,
	Solana,
	SolanaSimds,
	Sourcify,
	Subscan,
	SubstrateSidecar,
	Superchain,
	Swarm,
	TheGraph,
	ThreeXpl,
	TradingView,
	TronFullNode,
	TronGrid,
	TronScan,
	TronSolidityNode,
	Voltaire,
	X,
	Youtube,
	ZcashZips,
	Zcashd,
	Zebra,
	ZeroG,
] as const satisfies readonly SourceProviderDefinition[]

export const sourceProviders: readonly SourceProviderDefinition[] = sourceProviderDefinitions

type SchemaEnv<_EnvSchema> = (
	_EnvSchema extends Type<infer _Env> ?
		_Env
	:
		{}
)

/**
 * Public env object shape for a `Source` (from that source’s `env` arktype schema in
 * `src/sources/**`). Sources not listed here use `{}` for typing.
 */
export type SourcePublicEnvFor<_Source extends Source> = (
	_Source extends Source.Allium_Rest ?
		SchemaEnv<typeof Allium.env>
	: _Source extends Source.CoinMarketCap_Rest ?
		SchemaEnv<typeof CoinMarketCap.env>
	: _Source extends Source.Coingecko_OpenApi | Source.Coingecko_Rest ?
		SchemaEnv<typeof Coingecko.env>
	: _Source extends Source.Defillama_Rest ?
		SchemaEnv<typeof Defillama.env>
	: _Source extends Source.Coinpaprika_OpenApi ?
		SchemaEnv<typeof Coinpaprika.env>
	: _Source extends Source.Dune_Rest ?
		SchemaEnv<typeof Dune.env>
	: _Source extends Source.Fedi_Rest ?
		SchemaEnv<typeof Fedi.env>
	: _Source extends Source.Helius_Rest ?
		SchemaEnv<typeof Helius.env>
	: _Source extends Source.Mastodon_Rest ?
		SchemaEnv<typeof Mastodon.env>
	: _Source extends Source.Lens_Graphql ?
		SchemaEnv<typeof Lens.env>
	: _Source extends Source.Lens_HeyGraphql ?
		SchemaEnv<typeof LensHey.env>
	: _Source extends Source.LightningLnd_Rest ?
		SchemaEnv<typeof LightningLnd.env>
	: _Source extends Source.Reddit_Rest ?
		SchemaEnv<typeof Reddit.env>
	: _Source extends Source.Etherscan_Rest ?
		SchemaEnv<typeof Etherscan.env>
	: _Source extends Source.Neynar_Rest ?
		SchemaEnv<typeof Neynar.env>
	: _Source extends Source.TheGraph_Graphql ?
		SchemaEnv<typeof TheGraph.env>
	: _Source extends Source.Piped_Rest ?
		SchemaEnv<typeof Piped.env>
	: _Source extends Source.Subscan_Rest ?
		SchemaEnv<typeof Subscan.env>
	: _Source extends Source.X_Rest ?
		SchemaEnv<typeof X.env>
	: _Source extends Source.Youtube_Rest ?
		SchemaEnv<typeof Youtube.env>
	:
		{}
)

/** Flattened `$env/dynamic/public` for gating and resolver `context.publicEnv`. */
export const resolverPublicEnv = (
	Object.fromEntries(
		Object.entries(publicEnv).map(([key, value]) => [
			key,
			value ?? '',
		]),
	)
) satisfies SourcePublicEnv

const envSubsetFromSchema = (
	envSchema: SourceProviderDefinition['env']  ,
): SourcePublicEnv | null => {
	if (envSchema == null) return {}
	const out = envSchema(resolverPublicEnv)
	if (out instanceof arktype.errors || typeof out !== 'object' || out == null) return null
	const subsetEntries: [string, string][] = []
	for (const [key, value] of Object.entries(out)) {
		if (value == null) continue
		if (typeof value !== 'string' || value.trim() === '') return null
		subsetEntries.push([key, value])
	}
	return Object.fromEntries(subsetEntries)
}

const enabledSourceEntries = sourceProviders.flatMap((sourceProvider) => {
	const providerSubset = envSubsetFromSchema(
		'env' in sourceProvider ?
			sourceProvider.env
		:
			undefined,
	)
	if (providerSubset == null) return []
	return sourceProvider.sources.flatMap((sourceDefinition) => {
		const sourceSubset = envSubsetFromSchema(
			'env' in sourceDefinition ?
				sourceDefinition.env
			:
				undefined,
		)
		if (sourceSubset == null) return []
		const merged = {
			...providerSubset,
			...sourceSubset,
		}
		return [[
			sourceDefinition,
			(
				Object.keys(merged).length === 0 ?
					resolverPublicEnv
				:	merged
			),
		] as const]
	})
})

export const sources = (
	enabledSourceEntries.map(([sourceDefinition]) => sourceDefinition)
) satisfies readonly SourceDefinition[]

/** Per-source public env passed to resolvers: validated subset when provider/source declare `env`; otherwise full {@link resolverPublicEnv}. */
export const resolverPublicEnvBySource: ReadonlyMap<Source, SourcePublicEnv> = new Map(
	enabledSourceEntries.map(([sourceDefinition, sourcePublicEnv]) => ([
		sourceDefinition.source,
		sourcePublicEnv,
	])),
)

export const enabledSources = new Set(
	sources.map((sourceDefinition) => sourceDefinition.source),
)
