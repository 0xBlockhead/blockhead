import { Source } from '$/sources/$Source.ts'
import { enabledSources } from '$/sources/index.ts'

import MevRelayRestResolvers from '$/resolvers/MevRelay-Rest.ts'
import MastodonRestResolvers from '$/resolvers/Mastodon-Rest.ts'
import MetadataVisionRestResolvers from '$/resolvers/MetadataVision-Rest.ts'
import AlliumRestResolvers from '$/resolvers/Allium-Rest.ts'
import AtprotoXrpcResolvers from '$/resolvers/Atproto-Xrpc.ts'
import AtprotoBskySocialXrpcResolvers from '$/resolvers/Atproto-BskySocial-Xrpc.ts'
import BeaconRestResolvers from '$/resolvers/Beacon-Rest.ts'
import BeaconchaInRestResolvers from '$/resolvers/BeaconchaIn-Rest.ts'
import BittensorJsonRpcResolvers from '$/resolvers/Bittensor-JsonRpc.ts'
import BitcoinBipsGithubResolvers from '$/resolvers/BitcoinBips-Github.ts'
import BitcoinCashBcmrGithubResolvers from '$/resolvers/BitcoinCashBcmr-Github.ts'
import BitcoinCashChipsGitlabResolvers from '$/resolvers/BitcoinCashChips-Gitlab.ts'
import BitcoinCoreJsonRpcResolvers from '$/resolvers/BitcoinCore-JsonRpc.ts'
import BitcoinCashNodeJsonRpcResolvers from '$/resolvers/BitcoinCashNode-JsonRpc.ts'
import BlobscanRestResolvers from '$/resolvers/Blobscan-Rest.ts'
import BlockchairRestResolvers from '$/resolvers/Blockchair-Rest.ts'
import BlockscoutRestResolvers from '$/resolvers/Blockscout-Rest.ts'
import CaipsGithubResolvers from '$/resolvers/Caips-Github.ts'
import ChainlistRestResolvers from '$/resolvers/Chainlist-Rest.ts'
import CoingeckoOpenApiResolvers from '$/resolvers/Coingecko-OpenApi.ts'
import CoingeckoRestResolvers from '$/resolvers/Coingecko-Rest.ts'
import CoinMarketCapRestResolvers from '$/resolvers/CoinMarketCap-Rest.ts'
import CoinpaprikaOpenApiResolvers from '$/resolvers/Coinpaprika-OpenApi.ts'
import CometBftRestResolvers from '$/resolvers/CometBft-Rest.ts'
import ConstantsResolvers from '$/resolvers/Constants.ts'
import CosmosAdrsGithubResolvers from '$/resolvers/CosmosAdrs-Github.ts'
import CosmosChainRegistryGithubResolvers from '$/resolvers/CosmosChainRegistry-Github.ts'
import CosmosSdkRestResolvers from '$/resolvers/CosmosSdk-Rest.ts'
import DefillamaOpenApiResolvers from '$/resolvers/Defillama-OpenApi.ts'
import DefillamaRestResolvers from '$/resolvers/Defillama-Rest.ts'
import DexscreenerOpenApiResolvers from '$/resolvers/Dexscreener-OpenApi.ts'
import Eip8004ScanRestResolvers from '$/resolvers/Eip8004Scan-Rest.ts'
import DuneRestResolvers from '$/resolvers/Dune-Rest.ts'
import DogecoinDipsGithubResolvers from '$/resolvers/DogecoinDips-Github.ts'
import DogecoinCoreJsonRpcResolvers from '$/resolvers/DogecoinCore-JsonRpc.ts'
import EnsTheGraphResolvers from '$/resolvers/Ens-TheGraph.ts'
import EnsipsGithubResolvers from '$/resolvers/Ensips-Github.ts'
import EthereumEipsGithubResolvers from '$/resolvers/EthereumEips-Github.ts'
import EthereumListsChainsResolvers from '$/resolvers/EthereumLists-Chains.ts'
import EthereumSpecsGithubResolvers from '$/resolvers/EthereumSpecs-Github.ts'
import EsploraRestResolvers from '$/resolvers/Esplora-Rest.ts'
import EtherscanRestResolvers from '$/resolvers/Etherscan-Rest.ts'
import FediRestResolvers from '$/resolvers/Fedi-Rest.ts'
import FarcasterRestResolvers from '$/resolvers/Farcaster-Rest.ts'
import FilecoinFipsGithubResolvers from '$/resolvers/FilecoinFips-Github.ts'
import FilfoxRestResolvers from '$/resolvers/Filfox-Rest.ts'
import HeliusRestResolvers from '$/resolvers/Helius-Rest.ts'
import HyperliquidDocsRestResolvers from '$/resolvers/HyperliquidDocs-Rest.ts'
import HyperliquidJsonRpcResolvers from '$/resolvers/Hyperliquid-JsonRpc.ts'
import HyperliquidRestResolvers from '$/resolvers/Hyperliquid-Rest.ts'
import IpfsRestResolvers from '$/resolvers/Ipfs-Rest.ts'
import L2BeatRestResolvers from '$/resolvers/L2Beat-Rest.ts'
import LifiRestResolvers from '$/resolvers/Lifi-Rest.ts'
import LensGraphqlResolvers from '$/resolvers/Lens-Graphql.ts'
import LensHeyGraphqlResolvers from '$/resolvers/LensHey-Graphql.ts'
import LitecoinCoreJsonRpcResolvers from '$/resolvers/LitecoinCore-JsonRpc.ts'
import LitecoinLipsGithubResolvers from '$/resolvers/LitecoinLips-Github.ts'
import LightningLndRestResolvers from '$/resolvers/LightningLnd-Rest.ts'
import LightningMempoolSpaceRestResolvers from '$/resolvers/LightningMempoolSpace-Rest.ts'
import LocalResolvers from '$/resolvers/Local.ts'
import LogosDocsRestResolvers from '$/resolvers/LogosDocs-Rest.ts'
import LotusJsonRpcResolvers from '$/resolvers/Lotus-JsonRpc.ts'
import MempoolSpaceRestResolvers from '$/resolvers/MempoolSpace-Rest.ts'
import MoneroDaemonRpcJsonRpcResolvers from '$/resolvers/MoneroDaemonRpc-JsonRpc.ts'
import NearBlocksRestResolvers from '$/resolvers/NearBlocks-Rest.ts'
import NearNepsGithubResolvers from '$/resolvers/NearNeps-Github.ts'
import NearRpcJsonRpcResolvers from '$/resolvers/NearRpc-JsonRpc.ts'
import NeynarRestResolvers from '$/resolvers/Neynar-Rest.ts'
import NostrBandRestResolvers from '$/resolvers/NostrBand-Rest.ts'
import OpenchainRestResolvers from '$/resolvers/Openchain-Rest.ts'
import PolkadotJsonRpcResolvers from '$/resolvers/Polkadot-JsonRpc.ts'
import PolkadotRfcsGithubResolvers from '$/resolvers/PolkadotRfcs-Github.ts'
import PipedRestResolvers from '$/resolvers/Piped-Rest.ts'
import PrimalRestResolvers from '$/resolvers/Primal-Rest.ts'
import QuilibriumNodeRpcGrpcResolvers from '$/resolvers/QuilibriumNodeRpc-Grpc.ts'
import QuilibriumDocsRestResolvers from '$/resolvers/QuilibriumDocs-Rest.ts'
import RedditPublicJsonResolvers from '$/resolvers/Reddit-PublicJson.ts'
import RedditRestResolvers from '$/resolvers/Reddit-Rest.ts'
import RssRestResolvers from '$/resolvers/Rss-Rest.ts'
import Rss2JsonRestResolvers from '$/resolvers/Rss2Json-Rest.ts'
import SnapchainRestResolvers from '$/resolvers/Snapchain-Rest.ts'
import SolanaJsonRpcResolvers from '$/resolvers/Solana-JsonRpc.ts'
import SolanaSimdsGithubResolvers from '$/resolvers/SolanaSimds-Github.ts'
import SourcifyRestResolvers from '$/resolvers/Sourcify-Rest.ts'
import SubscanRestResolvers from '$/resolvers/Subscan-Rest.ts'
import SubstrateSidecarRestResolvers from '$/resolvers/SubstrateSidecar-Rest.ts'
import SuperchainGithubResolvers from '$/resolvers/Superchain-Github.ts'
import SwarmRestResolvers from '$/resolvers/Swarm-Rest.ts'
import TradingViewRestResolvers from '$/resolvers/TradingView-Rest.ts'
import ThreeXplRestResolvers from '$/resolvers/ThreeXpl-Rest.ts'
import TronFullNodeRestResolvers from '$/resolvers/TronFullNode-Rest.ts'
import TronGridRestResolvers from '$/resolvers/TronGrid-Rest.ts'
import TronScanRestResolvers from '$/resolvers/TronScan-Rest.ts'
import TronSolidityNodeRestResolvers from '$/resolvers/TronSolidityNode-Rest.ts'
import VoltaireJsonRpcResolvers from '$/resolvers/Voltaire-JsonRpc.ts'
import XFxEmbedRestResolvers from '$/resolvers/X-FxEmbed-Rest.ts'
import XRestResolvers from '$/resolvers/X-Rest.ts'
import YoutubeRestResolvers from '$/resolvers/Youtube-Rest.ts'
import ZcashZipsGithubResolvers from '$/resolvers/ZcashZips-Github.ts'
import ZcashdJsonRpcResolvers from '$/resolvers/Zcashd-JsonRpc.ts'
import ZebraJsonRpcResolvers from '$/resolvers/Zebra-JsonRpc.ts'
import ZeroGChainJsonRpcResolvers from '$/resolvers/ZeroGChain-JsonRpc.ts'
import ZeroGChainScanRestResolvers from '$/resolvers/ZeroGChainScan-Rest.ts'
import ZeroGDaNodeGrpcResolvers from '$/resolvers/ZeroGDaNode-Grpc.ts'
import ZeroGDocsRestResolvers from '$/resolvers/ZeroGDocs-Rest.ts'
import ZeroGStorageNodeJsonRpcResolvers from '$/resolvers/ZeroGStorageNode-JsonRpc.ts'
import ZeroGStorageScanRestResolvers from '$/resolvers/ZeroGStorageScan-Rest.ts'

const enabledResolverModulesAfterSourceGate = (
	[
		MastodonRestResolvers,
		MetadataVisionRestResolvers,
		MevRelayRestResolvers,
		AlliumRestResolvers,
		AtprotoXrpcResolvers,
		AtprotoBskySocialXrpcResolvers,
		BeaconRestResolvers,
		BeaconchaInRestResolvers,
		BittensorJsonRpcResolvers,
		BitcoinBipsGithubResolvers,
		BitcoinCashBcmrGithubResolvers,
		BitcoinCashChipsGitlabResolvers,
		BitcoinCoreJsonRpcResolvers,
		BitcoinCashNodeJsonRpcResolvers,
		BlobscanRestResolvers,
		BlockchairRestResolvers,
		BlockscoutRestResolvers,
		CaipsGithubResolvers,
		L2BeatRestResolvers,
		ChainlistRestResolvers,
		CoingeckoRestResolvers,
		CoingeckoOpenApiResolvers,
		CoinMarketCapRestResolvers,
		CoinpaprikaOpenApiResolvers,
		CometBftRestResolvers,
		ConstantsResolvers,
		CosmosAdrsGithubResolvers,
		CosmosChainRegistryGithubResolvers,
		CosmosSdkRestResolvers,
		DefillamaOpenApiResolvers,
		DefillamaRestResolvers,
		DexscreenerOpenApiResolvers,
		Eip8004ScanRestResolvers,
		DuneRestResolvers,
		DogecoinDipsGithubResolvers,
		DogecoinCoreJsonRpcResolvers,
		EnsTheGraphResolvers,
		EnsipsGithubResolvers,
		EthereumEipsGithubResolvers,
		EthereumListsChainsResolvers,
		EthereumSpecsGithubResolvers,
		EsploraRestResolvers,
		EtherscanRestResolvers,
		FediRestResolvers,
		FarcasterRestResolvers,
		FilecoinFipsGithubResolvers,
		FilfoxRestResolvers,
		HeliusRestResolvers,
		HyperliquidDocsRestResolvers,
		HyperliquidJsonRpcResolvers,
		HyperliquidRestResolvers,
		IpfsRestResolvers,
		LifiRestResolvers,
		LensGraphqlResolvers,
		LensHeyGraphqlResolvers,
		LitecoinCoreJsonRpcResolvers,
		LitecoinLipsGithubResolvers,
		LightningLndRestResolvers,
		LightningMempoolSpaceRestResolvers,
		LocalResolvers,
		LogosDocsRestResolvers,
		LotusJsonRpcResolvers,
		MempoolSpaceRestResolvers,
		MoneroDaemonRpcJsonRpcResolvers,
		NearBlocksRestResolvers,
		NearNepsGithubResolvers,
		NearRpcJsonRpcResolvers,
		NeynarRestResolvers,
		NostrBandRestResolvers,
		OpenchainRestResolvers,
		PolkadotJsonRpcResolvers,
		PolkadotRfcsGithubResolvers,
		PipedRestResolvers,
		PrimalRestResolvers,
		QuilibriumNodeRpcGrpcResolvers,
		QuilibriumDocsRestResolvers,
		RedditPublicJsonResolvers,
		RedditRestResolvers,
		RssRestResolvers,
		Rss2JsonRestResolvers,
		SnapchainRestResolvers,
		SolanaJsonRpcResolvers,
		SolanaSimdsGithubResolvers,
		SourcifyRestResolvers,
		SubscanRestResolvers,
		SubstrateSidecarRestResolvers,
		SuperchainGithubResolvers,
		SwarmRestResolvers,
		TradingViewRestResolvers,
		ThreeXplRestResolvers,
		TronFullNodeRestResolvers,
		TronGridRestResolvers,
		TronScanRestResolvers,
		TronSolidityNodeRestResolvers,
		VoltaireJsonRpcResolvers,
		XFxEmbedRestResolvers,
		XRestResolvers,
		YoutubeRestResolvers,
		ZcashZipsGithubResolvers,
		ZcashdJsonRpcResolvers,
		ZebraJsonRpcResolvers,
		ZeroGChainJsonRpcResolvers,
		ZeroGChainScanRestResolvers,
		ZeroGDaNodeGrpcResolvers,
		ZeroGDocsRestResolvers,
		ZeroGStorageNodeJsonRpcResolvers,
		ZeroGStorageScanRestResolvers,
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
