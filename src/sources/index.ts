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
import Beacon from '$/sources/Beacon/index.ts'
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
import Etherscan from '$/sources/Etherscan/index.ts'
import Evm from '$/sources/Evm/index.ts'
import Explorer from '$/sources/Explorer/index.ts'
import Farcaster from '$/sources/Farcaster/index.ts'
import Github from '$/sources/Github/index.ts'
import Hypersnap from '$/sources/Hypersnap/index.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import L2Beat from '$/sources/L2Beat/index.ts'
import Lifi from '$/sources/Lifi/index.ts'
import Lens from '$/sources/Lens/index.ts'
import Local from '$/sources/Local/index.ts'
import Mastodon from '$/sources/Mastodon/index.ts'
import MetadataVision from '$/sources/MetadataVision/index.ts'
import MevRelay from '$/sources/MevRelay/index.ts'
import Neynar from '$/sources/Neynar/index.ts'
import Openchain from '$/sources/Openchain/index.ts'
import Reddit from '$/sources/Reddit/index.ts'
import Snapchain from '$/sources/Snapchain/index.ts'
import Sourcify from '$/sources/Sourcify/index.ts'
import Superchain from '$/sources/Superchain/index.ts'
import Swarm from '$/sources/Swarm/index.ts'
import TheGraph from '$/sources/TheGraph/index.ts'
import TradingView from '$/sources/TradingView/index.ts'
import Voltaire from '$/sources/Voltaire/index.ts'
import X from '$/sources/X/index.ts'

export { Source }

const sourceProviderDefinitions = [
	Allium,
	AtprotoBsky,
	Beacon,
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
	Etherscan,
	Evm,
	Explorer,
	Farcaster,
	Github,
	Hypersnap,
	Ipfs,
	L2Beat,
	Lens,
	Lifi,
	Local,
	Mastodon,
	MetadataVision,
	MevRelay,
	Neynar,
	Openchain,
	Reddit,
	Snapchain,
	Sourcify,
	Superchain,
	Swarm,
	TheGraph,
	TradingView,
	Voltaire,
	X,
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
	: _Source extends Source.Coingecko_Rest ?
		SchemaEnv<typeof Coingecko.env>
	: _Source extends Source.Coinpaprika_OpenApi ?
		SchemaEnv<typeof Coinpaprika.env>
	: _Source extends Source.Dune_Rest ?
		SchemaEnv<typeof Dune.env>
	: _Source extends Source.Lens_Graphql ?
		SchemaEnv<typeof Lens.env>
	: _Source extends Source.Reddit_Rest ?
		SchemaEnv<typeof Reddit.env>
	: _Source extends Source.Etherscan_Rest ?
		SchemaEnv<typeof Etherscan.env>
	: _Source extends Source.Neynar_Rest ?
		SchemaEnv<typeof Neynar.env>
	: _Source extends Source.TheGraph_Graphql ?
		SchemaEnv<typeof TheGraph.env>
	: _Source extends Source.X_Rest ?
		SchemaEnv<typeof X.env>
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
		return [[
			sourceDefinition,
			{
				...providerSubset,
				...sourceSubset,
			},
		] as const]
	})
})

export const sources = (
	enabledSourceEntries.map(([sourceDefinition]) => sourceDefinition)
) satisfies readonly SourceDefinition[]

/** Per-source validated env subset from provider+source schemas (empty object when no env schema exists). */
export const resolverPublicEnvBySource: ReadonlyMap<Source, SourcePublicEnvWire> = new Map(
	enabledSourceEntries.map(([sourceDefinition, sourcePublicEnv]) => ([
		sourceDefinition.source,
		sourcePublicEnv,
	])),
)

export const enabledSources = new Set(
	sources.map((sourceDefinition) => sourceDefinition.source),
)
