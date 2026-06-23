import { env as publicEnv } from '$env/dynamic/public'

import { Source } from '$/sources/Source.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import {
	SourceCredentialScope,
	SourceDelivery,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	enabledSourcesFromBindings,
	indexSourceProviders,
	type SourceDefinition as SourceDefinitionTemplate,
} from '$/sources/$sources.ts'
import { validateSourceBindings } from '$/sources/validateSourceBindings.ts'

import A2a from '$/sources/A2a/index.ts'
import Acp from '$/sources/Acp/index.ts'
import Across from '$/sources/Across/index.ts'
import Algod from '$/sources/Algod/index.ts'
import AlgorandIndexer from '$/sources/AlgorandIndexer/index.ts'
import AlgorandWallet from '$/sources/AlgorandWallet/index.ts'
import Allium from '$/sources/Allium/index.ts'
import Amboss from '$/sources/Amboss/index.ts'
import Anthropic from '$/sources/Anthropic/index.ts'
import AptosAip62 from '$/sources/AptosAip62/index.ts'
import AptosFullnode from '$/sources/AptosFullnode/index.ts'
import AptosIndexer from '$/sources/AptosIndexer/index.ts'
import Arweave from '$/sources/Arweave/index.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'
import AtprotoBskySocial from '$/sources/AtprotoBskySocial/index.ts'
import AtprotoSync from '$/sources/AtprotoSync/index.ts'
import Avail from '$/sources/Avail/index.ts'
import AvailExplorer from '$/sources/AvailExplorer/index.ts'
import AvalancheInfo from '$/sources/AvalancheInfo/index.ts'
import AvalanchePlatformVm from '$/sources/AvalanchePlatformVm/index.ts'
import Avascan from '$/sources/Avascan/index.ts'
import Axelarscan from '$/sources/Axelarscan/index.ts'
import AwsBedrock from '$/sources/AwsBedrock/index.ts'
import AzureAiFoundry from '$/sources/AzureAiFoundry/index.ts'
import Beacon from '$/sources/Beacon/index.ts'
import BeaconchaIn from '$/sources/BeaconchaIn/index.ts'
import BetterCallDev from '$/sources/BetterCallDev/index.ts'
import BigDipper from '$/sources/BigDipper/index.ts'
import BinanceChainApi from '$/sources/BinanceChainApi/index.ts'
import BinanceChainExplorer from '$/sources/BinanceChainExplorer/index.ts'
import Bittensor from '$/sources/Bittensor/index.ts'
import BitcoinBips from '$/sources/BitcoinBips/index.ts'
import BitcoinCashBcmr from '$/sources/BitcoinCashBcmr/index.ts'
import BitcoinCashChips from '$/sources/BitcoinCashChips/index.ts'
import BitcoinCashNode from '$/sources/BitcoinCashNode/index.ts'
import BitcoinCore from '$/sources/BitcoinCore/index.ts'
import BitTorrent from '$/sources/BitTorrent/index.ts'
import Bithomp from '$/sources/Bithomp/index.ts'
import Blobscan from '$/sources/Blobscan/index.ts'
import Blockfrost from '$/sources/Blockfrost/index.ts'
import Blockchair from '$/sources/Blockchair/index.ts'
import Blockscout from '$/sources/Blockscout/index.ts'
import BnbBeaconArchive from '$/sources/BnbBeaconArchive/index.ts'
import BnbChainFusion from '$/sources/BnbChainFusion/index.ts'
import Caips from '$/sources/Caips/index.ts'
import CardanoBlockfrost from '$/sources/CardanoBlockfrost/index.ts'
import CardanoCip30 from '$/sources/CardanoCip30/index.ts'
import CardanoDbSync from '$/sources/CardanoDbSync/index.ts'
import CardanoKoios from '$/sources/CardanoKoios/index.ts'
import CardanoNode from '$/sources/CardanoNode/index.ts'
import Cardanoscan from '$/sources/Cardanoscan/index.ts'
import Cashu from '$/sources/Cashu/index.ts'
import Celenium from '$/sources/Celenium/index.ts'
import Celestia from '$/sources/Celestia/index.ts'
import ChainlinkDataFeeds from '$/sources/ChainlinkDataFeeds/index.ts'
import Chainlist from '$/sources/Chainlist/index.ts'
import CircleCctp from '$/sources/CircleCctp/index.ts'
import Coingecko from '$/sources/Coingecko/index.ts'
import CoinMarketCap from '$/sources/CoinMarketCap/index.ts'
import Coinpaprika from '$/sources/Coinpaprika/index.ts'
import Cohere from '$/sources/Cohere/index.ts'
import CodexNetworkPresets from '$/sources/CodexNetworkPresets/index.ts'
import CodexNode from '$/sources/CodexNode/index.ts'
import CometBft from '$/sources/CometBft/index.ts'
import Conseil from '$/sources/Conseil/index.ts'
import Constants from '$/sources/Constants/index.ts'
import CosmosAdrs from '$/sources/CosmosAdrs/index.ts'
import CosmosChainRegistry from '$/sources/CosmosChainRegistry/index.ts'
import CosmosSdk from '$/sources/CosmosSdk/index.ts'
import CronosExplorer from '$/sources/CronosExplorer/index.ts'
import CycloneDx from '$/sources/CycloneDx/index.ts'
import Defillama from '$/sources/Defillama/index.ts'
import Dexscreener from '$/sources/Dexscreener/index.ts'
import DogecoinDips from '$/sources/DogecoinDips/index.ts'
import DogecoinCore from '$/sources/DogecoinCore/index.ts'
import Dune from '$/sources/Dune/index.ts'
import Dydx from '$/sources/Dydx/index.ts'
import Eip8004Scan from '$/sources/Eip8004Scan/index.ts'
import Erigon from '$/sources/Erigon/index.ts'
import Eas from '$/sources/Eas/index.ts'
import EasScan from '$/sources/EasScan/index.ts'
import Ensips from '$/sources/Ensips/index.ts'
import Esplora from '$/sources/Esplora/index.ts'
import EthereumEips from '$/sources/EthereumEips/index.ts'
import EthereumSpecs from '$/sources/EthereumSpecs/index.ts'
import EthereumLists from '$/sources/EthereumLists/index.ts'
import Etherscan from '$/sources/Etherscan/index.ts'
import EthForks from '$/sources/EthForks/index.ts'
import EigenExplorer from '$/sources/EigenExplorer/index.ts'
import EigenLayer from '$/sources/EigenLayer/index.ts'
import EigenLayerSubgraph from '$/sources/EigenLayerSubgraph/index.ts'
import EnsMetadataService from '$/sources/EnsMetadataService/index.ts'
import FilecoinFips from '$/sources/FilecoinFips/index.ts'
import Farcaster from '$/sources/Farcaster/index.ts'
import Fedi from '$/sources/Fedi/index.ts'
import FedimintClient from '$/sources/FedimintClient/index.ts'
import FedimintGatewayd from '$/sources/FedimintGatewayd/index.ts'
import Filfox from '$/sources/Filfox/index.ts'
import Freighter from '$/sources/Freighter/index.ts'
import Forgejo from '$/sources/Forgejo/index.ts'
import FxEmbed from '$/sources/FxEmbed/index.ts'
import Git from '$/sources/Git/index.ts'
import Github from '$/sources/Github/index.ts'
import Gitlab from '$/sources/Gitlab/index.ts'
import GoogleAi from '$/sources/GoogleAi/index.ts'
import HashConnect from '$/sources/HashConnect/index.ts'
import Helius from '$/sources/Helius/index.ts'
import HederaMirrorNode from '$/sources/HederaMirrorNode/index.ts'
import HederaWalletConnect from '$/sources/HederaWalletConnect/index.ts'
import HederaSdk from '$/sources/HederaSdk/index.ts'
import HuggingFace from '$/sources/HuggingFace/index.ts'
import Hyperliquid from '$/sources/Hyperliquid/index.ts'
import HyperliquidDocs from '$/sources/HyperliquidDocs/index.ts'
import InternetComputer from '$/sources/InternetComputer/index.ts'
import InternetIdentity from '$/sources/InternetIdentity/index.ts'
import Ipfs from '$/sources/Ipfs/index.ts'
import Juno from '$/sources/Juno/index.ts'
import Kabila from '$/sources/Kabila/index.ts'
import KaspaExplorer from '$/sources/KaspaExplorer/index.ts'
import KaspaNode from '$/sources/KaspaNode/index.ts'
import KaspaWalletCli from '$/sources/KaspaWalletCli/index.ts'
import KaspaWalletSdk from '$/sources/KaspaWalletSdk/index.ts'
import KaswareWallet from '$/sources/KaswareWallet/index.ts'
import Keplr from '$/sources/Keplr/index.ts'
import LibtorrentSession from '$/sources/LibtorrentSession/index.ts'
import Koios from '$/sources/Koios/index.ts'
import L2Beat from '$/sources/L2Beat/index.ts'
import LayerZeroScan from '$/sources/LayerZeroScan/index.ts'
import LedgerFilecoin from '$/sources/LedgerFilecoin/index.ts'
import Leap from '$/sources/Leap/index.ts'
import Lens from '$/sources/Lens/index.ts'
import Lifi from '$/sources/Lifi/index.ts'
import LightningLnd from '$/sources/LightningLnd/index.ts'
import LightningMempoolSpace from '$/sources/LightningMempoolSpace/index.ts'
import LitecoinLips from '$/sources/LitecoinLips/index.ts'
import LitecoinCore from '$/sources/LitecoinCore/index.ts'
import LitecoinWalletRpc from '$/sources/LitecoinWalletRpc/index.ts'
import LogosDocs from '$/sources/LogosDocs/index.ts'
import LogosBlockchainNode from '$/sources/LogosBlockchainNode/index.ts'
import Local from '$/sources/Local/index.ts'
import Lotus from '$/sources/Lotus/index.ts'
import MempoolSpace from '$/sources/MempoolSpace/index.ts'
import MagnetUri from '$/sources/MagnetUri/index.ts'
import Mastodon from '$/sources/Mastodon/index.ts'
import Martian from '$/sources/Martian/index.ts'
import Mcp from '$/sources/Mcp/index.ts'
import Magic from '$/sources/Magic/index.ts'
import MevRelay from '$/sources/MevRelay/index.ts'
import MetadataVision from '$/sources/MetadataVision/index.ts'
import MetaplexDAS from '$/sources/MetaplexDAS/index.ts'
import Mintscan from '$/sources/Mintscan/index.ts'
import Mlflow from '$/sources/Mlflow/index.ts'
import MlCommons from '$/sources/MlCommons/index.ts'
import MoneroDaemonRpc from '$/sources/MoneroDaemonRpc/index.ts'
import MoneroWalletRpc from '$/sources/MoneroWalletRpc/index.ts'
import MistralAi from '$/sources/MistralAi/index.ts'
import NearBlocks from '$/sources/NearBlocks/index.ts'
import NearConnect from '$/sources/NearConnect/index.ts'
import NearNeps from '$/sources/NearNeps/index.ts'
import NearRpc from '$/sources/NearRpc/index.ts'
import NearWalletSelector from '$/sources/NearWalletSelector/index.ts'
import Neynar from '$/sources/Neynar/index.ts'
import Nfid from '$/sources/Nfid/index.ts'
import Nitro from '$/sources/Nitro/index.ts'
import Nodely from '$/sources/Nodely/index.ts'
import NostrBand from '$/sources/NostrBand/index.ts'
import NostrRelay from '$/sources/NostrRelay/index.ts'
import Openchain from '$/sources/Openchain/index.ts'
import OpenAI from '$/sources/OpenAI/index.ts'
import OpenSea from '$/sources/OpenSea/index.ts'
import OciRegistry from '$/sources/OciRegistry/index.ts'
import Ogmios from '$/sources/Ogmios/index.ts'
import Onnx from '$/sources/Onnx/index.ts'
import OneInchSwap from '$/sources/OneInchSwap/index.ts'
import OsmosisLCD from '$/sources/OsmosisLCD/index.ts'
import Paraswap from '$/sources/Paraswap/index.ts'
import Pathfinder from '$/sources/Pathfinder/index.ts'
import Payjoin from '$/sources/Payjoin/index.ts'
import Petra from '$/sources/Petra/index.ts'
import Piped from '$/sources/Piped/index.ts'
import PlugWallet from '$/sources/PlugWallet/index.ts'
import Polkadot from '$/sources/Polkadot/index.ts'
import PolkadotInjectedWeb3 from '$/sources/PolkadotInjectedWeb3/index.ts'
import PolkadotRfcs from '$/sources/PolkadotRfcs/index.ts'
import Pontem from '$/sources/Pontem/index.ts'
import Primal from '$/sources/Primal/index.ts'
import Pyth from '$/sources/Pyth/index.ts'
import qBittorrentWebUi from '$/sources/qBittorrentWebUi/index.ts'
import QuilibriumDocs from '$/sources/QuilibriumDocs/index.ts'
import QuilibriumNode from '$/sources/QuilibriumNode/index.ts'
import QuilibriumNodeMetrics from '$/sources/QuilibriumNodeMetrics/index.ts'
import QuilibriumNodeRpc from '$/sources/QuilibriumNodeRpc/index.ts'
import Radicle from '$/sources/Radicle/index.ts'
import RadicleCli from '$/sources/RadicleCli/index.ts'
import RadicleNode from '$/sources/RadicleNode/index.ts'
import RedditPublic from '$/sources/RedditPublic/index.ts'
import Reddit from '$/sources/Reddit/index.ts'
import Reservoir from '$/sources/Reservoir/index.ts'
import Reth from '$/sources/Reth/index.ts'
import Rss from '$/sources/Rss/index.ts'
import Rss2Json from '$/sources/Rss2Json/index.ts'
import SigstoreRekor from '$/sources/SigstoreRekor/index.ts'
import Solana from '$/sources/Solana/index.ts'
import SolanaMobileWalletAdapter from '$/sources/SolanaMobileWalletAdapter/index.ts'
import SolanaSimds from '$/sources/SolanaSimds/index.ts'
import Snapchain from '$/sources/Snapchain/index.ts'
import Sourcify from '$/sources/Sourcify/index.ts'
import Spdx from '$/sources/Spdx/index.ts'
import Starknet from '$/sources/Starknet/index.ts'
import Starkscan from '$/sources/Starkscan/index.ts'
import StoicWallet from '$/sources/StoicWallet/index.ts'
import StellarExpert from '$/sources/StellarExpert/index.ts'
import StellarHorizon from '$/sources/StellarHorizon/index.ts'
import StellarRpc from '$/sources/StellarRpc/index.ts'
import StellarToml from '$/sources/StellarToml/index.ts'
import Subscan from '$/sources/Subscan/index.ts'
import SubstrateSidecar from '$/sources/SubstrateSidecar/index.ts'
import Sui from '$/sources/Sui/index.ts'
import Superchain from '$/sources/Superchain/index.ts'
import TrustWalletAssets from '$/sources/TrustWalletAssets/index.ts'
import Swarm from '$/sources/Swarm/index.ts'
import TheGraph from '$/sources/TheGraph/index.ts'
import ThreeXpl from '$/sources/ThreeXpl/index.ts'
import TradingView from '$/sources/TradingView/index.ts'
import TonApi from '$/sources/TonApi/index.ts'
import TonCenter from '$/sources/TonCenter/index.ts'
import TonConnect from '$/sources/TonConnect/index.ts'
import Tonlib from '$/sources/Tonlib/index.ts'
import TonLiteServer from '$/sources/TonLiteServer/index.ts'
import TonVerifier from '$/sources/TonVerifier/index.ts'
import TronScan from '$/sources/TronScan/index.ts'
import TronFullNode from '$/sources/TronFullNode/index.ts'
import TronGrid from '$/sources/TronGrid/index.ts'
import TronLink from '$/sources/TronLink/index.ts'
import TronSolidityNode from '$/sources/TronSolidityNode/index.ts'
import TronTip1193 from '$/sources/TronTip1193/index.ts'
import TronTip6963 from '$/sources/TronTip6963/index.ts'
import Voltaire from '$/sources/Voltaire/index.ts'
import TezosDappetizer from '$/sources/TezosDappetizer/index.ts'
import TezosNode from '$/sources/TezosNode/index.ts'
import Transmission from '$/sources/Transmission/index.ts'
import Tzkt from '$/sources/Tzkt/index.ts'
import Voyager from '$/sources/Voyager/index.ts'
import WalletConnect from '$/sources/WalletConnect/index.ts'
import WalletStandard from '$/sources/WalletStandard/index.ts'
import WakuNode from '$/sources/WakuNode/index.ts'
import WebTorrent from '$/sources/WebTorrent/index.ts'
import Wormholescan from '$/sources/Wormholescan/index.ts'
import X402 from '$/sources/X402/index.ts'
import X from '$/sources/X/index.ts'
import Xaman from '$/sources/Xaman/index.ts'
import XrpScan from '$/sources/XrpScan/index.ts'
import Xrpl from '$/sources/Xrpl/index.ts'
import XrplClio from '$/sources/XrplClio/index.ts'
import Xmtp from '$/sources/Xmtp/index.ts'
import Youtube from '$/sources/Youtube/index.ts'
import ZcashZips from '$/sources/ZcashZips/index.ts'
import ZcashClientBackend from '$/sources/ZcashClientBackend/index.ts'
import Zcashd from '$/sources/Zcashd/index.ts'
import ZcashLightwalletd from '$/sources/ZcashLightwalletd/index.ts'
import Zebra from '$/sources/Zebra/index.ts'
import ZeroExSwap from '$/sources/ZeroExSwap/index.ts'
import ZeroG from '$/sources/ZeroG/index.ts'

export { Source }

export type SourceDefinition = SourceDefinitionTemplate<SourceProviderDefinition['provider'], Source>

export type { SourcePublicEnv } from '$/sources/$sources.ts'

const sourceProviderDefinitions: readonly SourceProviderDefinition[] = [
	A2a,
	Acp,
	Across,
	Algod,
	AlgorandIndexer,
	AlgorandWallet,
	Allium,
	Amboss,
	Anthropic,
	AptosAip62,
	AptosFullnode,
	AptosIndexer,
	Arweave,
	AtprotoBsky,
	AtprotoBskySocial,
	AtprotoSync,
	Avail,
	AvailExplorer,
	AvalancheInfo,
	AvalanchePlatformVm,
	Avascan,
	Axelarscan,
	AwsBedrock,
	AzureAiFoundry,
	Beacon,
	BeaconchaIn,
	BetterCallDev,
	BigDipper,
	BinanceChainApi,
	BinanceChainExplorer,
	Bittensor,
	BitcoinBips,
	BitcoinCashBcmr,
	BitcoinCashChips,
	BitcoinCashNode,
	BitcoinCore,
	BitTorrent,
	Bithomp,
	Blobscan,
	Blockfrost,
	Blockchair,
	Blockscout,
	BnbBeaconArchive,
	BnbChainFusion,
	Caips,
	CardanoBlockfrost,
	CardanoCip30,
	CardanoDbSync,
	CardanoKoios,
	CardanoNode,
	Cardanoscan,
	Cashu,
	Celenium,
	Celestia,
	ChainlinkDataFeeds,
	Chainlist,
	CircleCctp,
	Coingecko,
	CoinMarketCap,
	Coinpaprika,
	Cohere,
	CodexNetworkPresets,
	CodexNode,
	CometBft,
	Conseil,
	Constants,
	CosmosAdrs,
	CosmosChainRegistry,
	CosmosSdk,
	CronosExplorer,
	CycloneDx,
	Defillama,
	Dexscreener,
	DogecoinDips,
	DogecoinCore,
	Dune,
	Dydx,
	Eip8004Scan,
	Erigon,
	Eas,
	EasScan,
	Ensips,
	Esplora,
	EthereumEips,
	EthereumSpecs,
	EthereumLists,
	Etherscan,
	EthForks,
	EigenExplorer,
	EigenLayer,
	EigenLayerSubgraph,
	EnsMetadataService,
	FilecoinFips,
	Farcaster,
	Fedi,
	FedimintClient,
	FedimintGatewayd,
	Filfox,
	Freighter,
	Forgejo,
	FxEmbed,
	Git,
	Github,
	Gitlab,
	GoogleAi,
	HashConnect,
	Helius,
	HederaMirrorNode,
	HederaWalletConnect,
	HederaSdk,
	HuggingFace,
	Hyperliquid,
	HyperliquidDocs,
	InternetComputer,
	InternetIdentity,
	Ipfs,
	Juno,
	Kabila,
	KaspaExplorer,
	KaspaNode,
	KaspaWalletCli,
	KaspaWalletSdk,
	KaswareWallet,
	Keplr,
	LibtorrentSession,
	Koios,
	L2Beat,
	LayerZeroScan,
	LedgerFilecoin,
	Leap,
	Lens,
	Lifi,
	LightningLnd,
	LightningMempoolSpace,
	LitecoinLips,
	LitecoinCore,
	LitecoinWalletRpc,
	Local,
	LogosBlockchainNode,
	LogosDocs,
	Lotus,
	MagnetUri,
	MempoolSpace,
	Mastodon,
	Martian,
	Mcp,
	Magic,
	MevRelay,
	MetadataVision,
	MetaplexDAS,
	Mintscan,
	Mlflow,
	MlCommons,
	MoneroDaemonRpc,
	MoneroWalletRpc,
	MistralAi,
	NearBlocks,
	NearConnect,
	NearNeps,
	NearRpc,
	NearWalletSelector,
	Neynar,
	Nfid,
	Nitro,
	Nodely,
	NostrBand,
	NostrRelay,
	Openchain,
	OpenAI,
	OpenSea,
	OciRegistry,
	Ogmios,
	Onnx,
	OneInchSwap,
	OsmosisLCD,
	Paraswap,
	Pathfinder,
	Payjoin,
	Petra,
	Piped,
	PlugWallet,
	Polkadot,
	PolkadotInjectedWeb3,
	PolkadotRfcs,
	Pontem,
	Primal,
	Pyth,
	qBittorrentWebUi,
	QuilibriumDocs,
	QuilibriumNode,
	QuilibriumNodeMetrics,
	QuilibriumNodeRpc,
	Radicle,
	RadicleCli,
	RadicleNode,
	RedditPublic,
	Reddit,
	Reservoir,
	Reth,
	Rss,
	Rss2Json,
	SigstoreRekor,
	Solana,
	SolanaMobileWalletAdapter,
	SolanaSimds,
	Snapchain,
	Sourcify,
	Spdx,
	Starknet,
	Starkscan,
	StoicWallet,
	StellarExpert,
	StellarHorizon,
	StellarRpc,
	StellarToml,
	Subscan,
	SubstrateSidecar,
	Sui,
	Superchain,
	TrustWalletAssets,
	Swarm,
	TheGraph,
	ThreeXpl,
	TradingView,
	TonApi,
	TonCenter,
	TonConnect,
	Tonlib,
	TonLiteServer,
	TonVerifier,
	TronScan,
	TronFullNode,
	TronGrid,
	TronLink,
	TronSolidityNode,
	TronTip1193,
	TronTip6963,
	TezosDappetizer,
	TezosNode,
	Transmission,
	Tzkt,
	Voltaire,
	Voyager,
	WalletConnect,
	WalletStandard,
	WakuNode,
	WebTorrent,
	Wormholescan,
	X402,
	X,
	Xaman,
	XrpScan,
	Xrpl,
	XrplClio,
	Xmtp,
	Youtube,
	ZcashZips,
	ZcashClientBackend,
	Zcashd,
	ZcashLightwalletd,
	Zebra,
	ZeroExSwap,
	ZeroG,
]

export const sourceProviders: readonly SourceProviderDefinition[] = sourceProviderDefinitions

const browserDeliveries = new Set([
	SourceDelivery.BrowserDirect,
	SourceDelivery.HttpProxy,
	SourceDelivery.RemoteQuery,
	SourceDelivery.RemoteLive,
])

export const sourceBindings = validateSourceBindings(
	sourceProviderDefinitions.flatMap((provider) => provider.bindings)
		.filter((binding) => (
			browserDeliveries.has(binding.delivery)
			&& binding.credentials.every((credential) => (
				credential.scope === SourceCredentialScope.None
				|| credential.scope === SourceCredentialScope.PublicConfig
				|| credential.scope === SourceCredentialScope.UserDelegated
			))
		))
) satisfies readonly SourceBinding[]

export const sources = sourceProviderDefinitions.flatMap((provider) => provider.sources)

export const enabledSources = enabledSourcesFromBindings<Source>(sourceBindings)

export const {
	resolverPublicEnvBySource,
} = indexSourceProviders(sourceProviders, publicEnv)
