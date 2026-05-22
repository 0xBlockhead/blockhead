import { Source } from '$/sources/$Source.ts'
import { enabledSources } from '$/sources/index.ts'

import MevRelayRestResolvers from '$/resolvers/MevRelay-Rest.ts'
import MastodonRestResolvers from '$/resolvers/Mastodon-Rest.ts'
import MetadataVisionRestResolvers from '$/resolvers/MetadataVision-Rest.ts'
import AlliumRestResolvers from '$/resolvers/Allium-Rest.ts'
import AtprotoXrpcResolvers from '$/resolvers/Atproto-Xrpc.ts'
import AtprotoBskySocialXrpcResolvers from '$/resolvers/Atproto-BskySocial-Xrpc.ts'
import BeaconRestResolvers from '$/resolvers/Beacon-Rest.ts'
import BlobscanRestResolvers from '$/resolvers/Blobscan-Rest.ts'
import BlockscoutRestResolvers from '$/resolvers/Blockscout-Rest.ts'
import CaipsGithubResolvers from '$/resolvers/Caips-Github.ts'
import ChainlistRestResolvers from '$/resolvers/Chainlist-Rest.ts'
import CoingeckoOpenApiResolvers from '$/resolvers/Coingecko-OpenApi.ts'
import CoingeckoRestResolvers from '$/resolvers/Coingecko-Rest.ts'
import CoinMarketCapRestResolvers from '$/resolvers/CoinMarketCap-Rest.ts'
import CoinpaprikaOpenApiResolvers from '$/resolvers/Coinpaprika-OpenApi.ts'
import ConstantsResolvers from '$/resolvers/Constants.ts'
import DefillamaOpenApiResolvers from '$/resolvers/Defillama-OpenApi.ts'
import DefillamaRestResolvers from '$/resolvers/Defillama-Rest.ts'
import DexscreenerOpenApiResolvers from '$/resolvers/Dexscreener-OpenApi.ts'
import DuneRestResolvers from '$/resolvers/Dune-Rest.ts'
import EnsTheGraphResolvers from '$/resolvers/Ens-TheGraph.ts'
import EnsipsGithubResolvers from '$/resolvers/Ensips-Github.ts'
import EthereumEipsGithubResolvers from '$/resolvers/EthereumEips-Github.ts'
import EthereumListsChainsResolvers from '$/resolvers/EthereumLists-Chains.ts'
import EthereumSpecsGithubResolvers from '$/resolvers/EthereumSpecs-Github.ts'
import EtherscanRestResolvers from '$/resolvers/Etherscan-Rest.ts'
import FediRestResolvers from '$/resolvers/Fedi-Rest.ts'
import FarcasterRestResolvers from '$/resolvers/Farcaster-Rest.ts'
import IpfsRestResolvers from '$/resolvers/Ipfs-Rest.ts'
import L2BeatRestResolvers from '$/resolvers/L2Beat-Rest.ts'
import LifiRestResolvers from '$/resolvers/Lifi-Rest.ts'
import LensGraphqlResolvers from '$/resolvers/Lens-Graphql.ts'
import LensHeyGraphqlResolvers from '$/resolvers/LensHey-Graphql.ts'
import LocalResolvers from '$/resolvers/Local.ts'
import NeynarRestResolvers from '$/resolvers/Neynar-Rest.ts'
import NostrBandRestResolvers from '$/resolvers/NostrBand-Rest.ts'
import OpenchainRestResolvers from '$/resolvers/Openchain-Rest.ts'
import PipedRestResolvers from '$/resolvers/Piped-Rest.ts'
import PrimalRestResolvers from '$/resolvers/Primal-Rest.ts'
import RedditPublicJsonResolvers from '$/resolvers/Reddit-PublicJson.ts'
import RedditRestResolvers from '$/resolvers/Reddit-Rest.ts'
import RssRestResolvers from '$/resolvers/Rss-Rest.ts'
import Rss2JsonRestResolvers from '$/resolvers/Rss2Json-Rest.ts'
import SnapchainRestResolvers from '$/resolvers/Snapchain-Rest.ts'
import SourcifyRestResolvers from '$/resolvers/Sourcify-Rest.ts'
import SuperchainGithubResolvers from '$/resolvers/Superchain-Github.ts'
import SwarmRestResolvers from '$/resolvers/Swarm-Rest.ts'
import TradingViewRestResolvers from '$/resolvers/TradingView-Rest.ts'
import VoltaireJsonRpcResolvers from '$/resolvers/Voltaire-JsonRpc.ts'
import XFxEmbedRestResolvers from '$/resolvers/X-FxEmbed-Rest.ts'
import XRestResolvers from '$/resolvers/X-Rest.ts'
import YoutubeRestResolvers from '$/resolvers/Youtube-Rest.ts'

const enabledResolverModulesAfterSourceGate = (
	[
		MastodonRestResolvers,
		MetadataVisionRestResolvers,
		MevRelayRestResolvers,
		AlliumRestResolvers,
		AtprotoXrpcResolvers,
		AtprotoBskySocialXrpcResolvers,
		BeaconRestResolvers,
		BlobscanRestResolvers,
		BlockscoutRestResolvers,
		CaipsGithubResolvers,
		L2BeatRestResolvers,
		ChainlistRestResolvers,
		CoingeckoRestResolvers,
		CoingeckoOpenApiResolvers,
		CoinMarketCapRestResolvers,
		CoinpaprikaOpenApiResolvers,
		ConstantsResolvers,
		DefillamaOpenApiResolvers,
		DefillamaRestResolvers,
		DexscreenerOpenApiResolvers,
		DuneRestResolvers,
		EnsTheGraphResolvers,
		EnsipsGithubResolvers,
		EthereumEipsGithubResolvers,
		EthereumListsChainsResolvers,
		EthereumSpecsGithubResolvers,
		EtherscanRestResolvers,
		FediRestResolvers,
		FarcasterRestResolvers,
		IpfsRestResolvers,
		LifiRestResolvers,
		LensGraphqlResolvers,
		LensHeyGraphqlResolvers,
		LocalResolvers,
		NeynarRestResolvers,
		NostrBandRestResolvers,
		OpenchainRestResolvers,
		PipedRestResolvers,
		PrimalRestResolvers,
		RedditPublicJsonResolvers,
		RedditRestResolvers,
		RssRestResolvers,
		Rss2JsonRestResolvers,
		SnapchainRestResolvers,
		SourcifyRestResolvers,
		SuperchainGithubResolvers,
		SwarmRestResolvers,
		TradingViewRestResolvers,
		VoltaireJsonRpcResolvers,
		XFxEmbedRestResolvers,
		XRestResolvers,
		YoutubeRestResolvers,
	] satisfies readonly { source: Source }[]
).filter((module) => enabledSources.has(module.source))

export const entityResolvers = (
	enabledResolverModulesAfterSourceGate.flatMap((module) => (
		module.entityResolvers.map((entityResolver) => ({
			...entityResolver,
			source: module.source,
		}))
	))
)

export const entityFieldResolvers = (
	enabledResolverModulesAfterSourceGate.flatMap((module) => (
		module.entityFieldResolvers.map((entityFieldResolver) => ({
			...entityFieldResolver,
			source: module.source,
		}))
	))
)

export const entityLiveResolvers = (
	enabledResolverModulesAfterSourceGate.flatMap((module) => (
		'entityLiveResolvers' in module ?
			module.entityLiveResolvers.map((entityLiveResolver) => ({
				...entityLiveResolver,
				source: module.source,
			}))
		:
			[]
	))
)

export const entityResolversByEntityType = Object.groupBy(
	entityResolvers,
	(entityResolver) => entityResolver.entityType,
)

export const entityFieldResolversByEntityType = Object.groupBy(
	entityFieldResolvers,
	(fieldResolver) => fieldResolver.entityType,
)

export const entityLiveResolversByEntityType = Object.groupBy(
	entityLiveResolvers,
	(entityLiveResolver) => entityLiveResolver.entityType,
)

export const entityFieldResolversByEntityTypeAndFieldName: Partial<
	Record<string, Partial<Record<string, typeof entityFieldResolvers>>>
> = Object.fromEntries(
	Object.entries(entityFieldResolversByEntityType)
		.map(([entityType, resolversForEntity]) => [
			entityType,
			Object.groupBy(
				resolversForEntity,
				(fieldResolver) => fieldResolver.fieldName,
			),
		]),
)

export const entityFieldNamesWithResolveLiveByEntityType: Partial<
	Record<string, string[]>
> = Object.fromEntries(
	Object.entries(entityFieldResolversByEntityType)
		.map(([entityType, resolversForEntity]) => [
			entityType,
			[
				...new Set(
					resolversForEntity
						.filter((r) => r.resolveLive != null)
						.map((r) => r.fieldName),
				),
			],
		]),
)
