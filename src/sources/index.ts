import { env as publicEnv } from '$env/dynamic/public'
import { type as arktype, type Type } from 'arktype'

import {
	Source,
	type SourceDefinition,
	type SourcePublicEnvWire,
} from '$/sources/$Source.ts'

import {
	type SourceProviderDefinition,
} from '$/sources/$SourceProvider.ts'

import Allium from '$/sources/Allium/index.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'
import AtprotoBskySocial from '$/sources/AtprotoBskySocial/index.ts'
import Beacon from '$/sources/Beacon/index.ts'
import Blobscan from '$/sources/Blobscan/index.ts'
import Blockscout from '$/sources/Blockscout/index.ts'
import Caips from '$/sources/Caips/index.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import Coingecko from '$/sources/Coingecko/index.ts'
import CoinMarketCap from '$/sources/CoinMarketCap/index.ts'
import Coinpaprika from '$/sources/Coinpaprika/index.ts'
import Constants from '$/sources/Constants/index.ts'
import Defillama from '$/sources/Defillama/index.ts'
import Dexscreener from '$/sources/Dexscreener/index.ts'
import Dune from '$/sources/Dune/index.ts'
import Ensips from '$/sources/Ensips/index.ts'
import EthereumEips from '$/sources/EthereumEips/index.ts'
import EthereumLists from '$/sources/EthereumLists/index.ts'
import EthereumSpecs from '$/sources/EthereumSpecs/index.ts'
import Etherscan from '$/sources/Etherscan/index.ts'
import Farcaster from '$/sources/Farcaster/index.ts'
import Fedi from '$/sources/Fedi/index.ts'
import FxEmbed from '$/sources/FxEmbed/index.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import L2Beat from '$/sources/L2Beat/index.ts'
import Lifi from '$/sources/Lifi/index.ts'
import Lens from '$/sources/Lens/index.ts'
import LensHey from '$/sources/LensHey/index.ts'
import Local from '$/sources/Local/index.ts'
import Mastodon from '$/sources/Mastodon/index.ts'
import MetadataVision from '$/sources/MetadataVision/index.ts'
import MevRelay from '$/sources/MevRelay/index.ts'
import Neynar from '$/sources/Neynar/index.ts'
import NostrBand from '$/sources/NostrBand/index.ts'
import Openchain from '$/sources/Openchain/index.ts'
import Piped from '$/sources/Piped/index.ts'
import Primal from '$/sources/Primal/index.ts'
import Reddit from '$/sources/Reddit/index.ts'
import RedditPublic from '$/sources/RedditPublic/index.ts'
import Rss from '$/sources/Rss/index.ts'
import Rss2Json from '$/sources/Rss2Json/index.ts'
import Snapchain from '$/sources/Snapchain/index.ts'
import Sourcify from '$/sources/Sourcify/index.ts'
import Superchain from '$/sources/Superchain/index.ts'
import Swarm from '$/sources/Swarm/index.ts'
import TheGraph from '$/sources/TheGraph/index.ts'
import TradingView from '$/sources/TradingView/index.ts'
import Voltaire from '$/sources/Voltaire/index.ts'
import X from '$/sources/X/index.ts'
import Youtube from '$/sources/Youtube/index.ts'

export { Source }

const sourceProviderDefinitions = [
	Allium,
	AtprotoBsky,
	AtprotoBskySocial,
	Beacon,
	Blobscan,
	Blockscout,
	Caips,
	Chainlist,
	Coingecko,
	CoinMarketCap,
	Coinpaprika,
	Constants,
	Defillama,
	Dexscreener,
	Dune,
	Ensips,
	EthereumEips,
	EthereumLists,
	EthereumSpecs,
	Etherscan,
	Farcaster,
	Fedi,
	FxEmbed,
	Ipfs,
	L2Beat,
	Lens,
	LensHey,
	Lifi,
	Local,
	Mastodon,
	MetadataVision,
	MevRelay,
	Neynar,
	NostrBand,
	Openchain,
	Piped,
	Primal,
	Reddit,
	RedditPublic,
	Rss,
	Rss2Json,
	Snapchain,
	Sourcify,
	Superchain,
	Swarm,
	TheGraph,
	TradingView,
	Voltaire,
	X,
	Youtube,
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
		SourcePublicEnvWire
	: _Source extends Source.Coinpaprika_OpenApi ?
		SchemaEnv<typeof Coinpaprika.env>
	: _Source extends Source.Dune_Rest ?
		SchemaEnv<typeof Dune.env>
	: _Source extends Source.Lens_Graphql ?
		SchemaEnv<typeof Lens.env>
	: _Source extends Source.Lens_HeyGraphql ?
		SchemaEnv<typeof LensHey.env>
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
) satisfies SourcePublicEnvWire

const envSubsetFromSchema = (
	envSchema: SourceProviderDefinition['env']  ,
): SourcePublicEnvWire | null => {
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
export const resolverPublicEnvBySource: ReadonlyMap<Source, SourcePublicEnvWire> = new Map(
	enabledSourceEntries.map(([sourceDefinition, sourcePublicEnv]) => ([
		sourceDefinition.source,
		sourcePublicEnv,
	])),
)

export const enabledSources = new Set(
	sources.map((sourceDefinition) => sourceDefinition.source),
)
