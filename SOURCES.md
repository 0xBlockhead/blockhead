# Blockhead Mock Sources

```ts
export enum SourceBinding {
	Across_Rest = 'Across_Rest',
	Algod_Rest = 'Algod_Rest',
	AlgorandIndexer_Rest = 'AlgorandIndexer_Rest',
	AlgorandWallet_WalletApi = 'AlgorandWallet_WalletApi',
	Allium_Rest = 'Allium_Rest',
	Amboss_Graphql = 'Amboss_Graphql',
	A2aService_Http = 'A2aService_Http',
	A2aWellKnown_Http = 'A2aWellKnown_Http',
	AcpLocal_JsonRpc = 'AcpLocal_JsonRpc',
	AcpRegistry_Rest = 'AcpRegistry_Rest',
	Anthropic_Rest = 'Anthropic_Rest',
	AwsBedrock_Rest = 'AwsBedrock_Rest',
	AzureAiFoundry_Rest = 'AzureAiFoundry_Rest',
	Cohere_Rest = 'Cohere_Rest',
	CroissantDocument_Local = 'CroissantDocument_Local',
	CycloneDxDocument_Local = 'CycloneDxDocument_Local',
	GoogleAi_Rest = 'GoogleAi_Rest',
	HuggingFaceHub_Rest = 'HuggingFaceHub_Rest',
	McpConfigured_Protocol = 'McpConfigured_Protocol',
	McpPackageRegistry_Rest = 'McpPackageRegistry_Rest',
	MistralAi_Rest = 'MistralAi_Rest',
	Mlflow_Rest = 'Mlflow_Rest',
	OciRegistry_Distribution = 'OciRegistry_Distribution',
	OnnxArtifact_Local = 'OnnxArtifact_Local',
	OpenAI_Rest = 'OpenAI_Rest',
	SpdxDocument_Local = 'SpdxDocument_Local',
	X402_Http = 'X402_Http',
	AptosAip62_WalletApi = 'AptosAip62_WalletApi',
	AptosFullnode_Rest = 'AptosFullnode_Rest',
	AptosIndexer_Graphql = 'AptosIndexer_Graphql',
	Arweave_Graphql = 'Arweave_Graphql',
	Arweave_Rest = 'Arweave_Rest',
	Atproto_BskySocial_Xrpc = 'Atproto_BskySocial_Xrpc',
	Atproto_Xrpc = 'Atproto_Xrpc',
	AtprotoSync_Xrpc = 'AtprotoSync_Xrpc',
	Avail_JsonRpc = 'Avail_JsonRpc',
	AvailExplorer_Rest = 'AvailExplorer_Rest',
	AvalancheInfo_JsonRpc = 'AvalancheInfo_JsonRpc',
	AvalanchePlatformVm_JsonRpc = 'AvalanchePlatformVm_JsonRpc',
	Avascan_Rest = 'Avascan_Rest',
	Axelarscan_Rest = 'Axelarscan_Rest',
	Beacon_Rest = 'Beacon_Rest',
	BeaconchaIn_Rest = 'BeaconchaIn_Rest',
	BetterCallDev_Rest = 'BetterCallDev_Rest',
	BigDipper_Rest = 'BigDipper_Rest',
	BinanceChainApi_Rest = 'BinanceChainApi_Rest',
	BinanceChainExplorer_Rest = 'BinanceChainExplorer_Rest',
	BitcoinBips_Github = 'BitcoinBips_Github',
	BitcoinCashBcmr_Github = 'BitcoinCashBcmr_Github',
	BitcoinCashChips_Gitlab = 'BitcoinCashChips_Gitlab',
	BitcoinCashNode_JsonRpc = 'BitcoinCashNode_JsonRpc',
	BitcoinCore_JsonRpc = 'BitcoinCore_JsonRpc',
	Bithomp_Rest = 'Bithomp_Rest',
	Bittensor_JsonRpc = 'Bittensor_JsonRpc',
	BitTorrent_HttpTracker = 'BitTorrent_HttpTracker',
	BitTorrent_MainlineDht = 'BitTorrent_MainlineDht',
	BitTorrent_MetadataExchange = 'BitTorrent_MetadataExchange',
	BitTorrent_PeerWire = 'BitTorrent_PeerWire',
	BitTorrent_UdpTracker = 'BitTorrent_UdpTracker',
	BitTorrentMetainfo_File = 'BitTorrentMetainfo_File',
	Blobscan_Rest = 'Blobscan_Rest',
	Blockchair_Rest = 'Blockchair_Rest',
	Blockfrost_Rest = 'Blockfrost_Rest',
	Blockscout_Rest = 'Blockscout_Rest',
	BnbBeaconArchive_Rest = 'BnbBeaconArchive_Rest',
	BnbChainFusion_Rest = 'BnbChainFusion_Rest',
	CaipNamespaces_Github = 'CaipNamespaces_Github',
	Caips_Github = 'Caips_Github',
	CardanoBlockfrost_Rest = 'CardanoBlockfrost_Rest',
	CardanoCip30_WalletApi = 'CardanoCip30_WalletApi',
	CardanoDbSync_Postgres = 'CardanoDbSync_Postgres',
	CardanoKoios_Rest = 'CardanoKoios_Rest',
	CardanoNode_LocalStateQuery = 'CardanoNode_LocalStateQuery',
	Cardanoscan_Rest = 'Cardanoscan_Rest',
	CashuMint_Rest = 'CashuMint_Rest',
	Celenium_Rest = 'Celenium_Rest',
	Celestia_JsonRpc = 'Celestia_JsonRpc',
	ChainlinkDataFeeds_AddressCatalog = 'ChainlinkDataFeeds_AddressCatalog',
	ChainlinkDataFeeds_Contracts = 'ChainlinkDataFeeds_Contracts',
	Chainlist_Rest = 'Chainlist_Rest',
	CircleCctp_IrisApi = 'CircleCctp_IrisApi',
	CircleCctpContracts_Evm = 'CircleCctpContracts_Evm',
	CircleCctpContracts_Solana = 'CircleCctpContracts_Solana',
	CircleCctpContracts_Stellar = 'CircleCctpContracts_Stellar',
	CodexNetworkPresets_Github = 'CodexNetworkPresets_Github',
	CodexNode_Rest = 'CodexNode_Rest',
	Coingecko_OpenApi = 'Coingecko_OpenApi',
	Coingecko_Rest = 'Coingecko_Rest',
	CoinMarketCap_Rest = 'CoinMarketCap_Rest',
	Coinpaprika_OpenApi = 'Coinpaprika_OpenApi',
	CometBft_Rest = 'CometBft_Rest',
	Conseil_Postgres = 'Conseil_Postgres',
	Constants_Internal = 'Constants_Internal',
	CosmosAdrs_Github = 'CosmosAdrs_Github',
	CosmosChainRegistry_Github = 'CosmosChainRegistry_Github',
	CosmosSdk_Rest = 'CosmosSdk_Rest',
	CronosExplorer_Rest = 'CronosExplorer_Rest',
	Defillama_OpenApi = 'Defillama_OpenApi',
	Defillama_Rest = 'Defillama_Rest',
	Dexscreener_OpenApi = 'Dexscreener_OpenApi',
	DogecoinCore_JsonRpc = 'DogecoinCore_JsonRpc',
	DogecoinDips_Github = 'DogecoinDips_Github',
	Dune_Rest = 'Dune_Rest',
	DydxIndexer_Rest = 'DydxIndexer_Rest',
	DydxValidator_Rest = 'DydxValidator_Rest',
	EasContracts_Evm = 'EasContracts_Evm',
	EasScan_Graphql = 'EasScan_Graphql',
	EigenExplorer_Rest = 'EigenExplorer_Rest',
	EigenLayerContracts_Evm = 'EigenLayerContracts_Evm',
	EigenLayerSubgraph_Graphql = 'EigenLayerSubgraph_Graphql',
	Ensips_Github = 'Ensips_Github',
	EnsMetadataService_Rest = 'EnsMetadataService_Rest',
	Erigon_JsonRpc = 'Erigon_JsonRpc',
	Esplora_Rest = 'Esplora_Rest',
	EthereumEips_Github = 'EthereumEips_Github',
	EthereumLists_Rest = 'EthereumLists_Rest',
	EthereumSpecs_Github = 'EthereumSpecs_Github',
	Etherscan_Rest = 'Etherscan_Rest',
	Eip8004Scan_Rest = 'Eip8004Scan_Rest',
	EthForks_Rest = 'EthForks_Rest',
	Farcaster_Rest = 'Farcaster_Rest',
	Fedi_Rest = 'Fedi_Rest',
	FedimintClient_Rpc = 'FedimintClient_Rpc',
	FedimintGatewayd_Rest = 'FedimintGatewayd_Rest',
	FilecoinFips_Github = 'FilecoinFips_Github',
	Filfox_Rest = 'Filfox_Rest',
	ForgejoIssues_Rest = 'ForgejoIssues_Rest',
	ForgejoPulls_Rest = 'ForgejoPulls_Rest',
	ForgejoReleases_Rest = 'ForgejoReleases_Rest',
	ForgejoRepos_Rest = 'ForgejoRepos_Rest',
	Freighter_WalletApi = 'Freighter_WalletApi',
	Git_Local = 'Git_Local',
	Git_Remote = 'Git_Remote',
	Github_Git = 'Github_Git',
	Github_Rest = 'Github_Rest',
	Gitlab_Rest = 'Gitlab_Rest',
	HashConnect_WalletApi = 'HashConnect_WalletApi',
	HederaMirrorNode_Rest = 'HederaMirrorNode_Rest',
	HederaSdk_Grpc = 'HederaSdk_Grpc',
	HederaWalletConnect_SignClient = 'HederaWalletConnect_SignClient',
	Helius_Rest = 'Helius_Rest',
	HyperliquidDocs_Rest = 'HyperliquidDocs_Rest',
	Hyperliquid_JsonRpc = 'Hyperliquid_JsonRpc',
	Hyperliquid_Rest = 'Hyperliquid_Rest',
	IcDashboard_Canister = 'IcDashboard_Canister',
	InternetComputer_Canister = 'InternetComputer_Canister',
	InternetComputer_Http = 'InternetComputer_Http',
	InternetComputer_RosettaApi = 'InternetComputer_RosettaApi',
	InternetComputer_WalletApi = 'InternetComputer_WalletApi',
	InternetIdentity_Delegation = 'InternetIdentity_Delegation',
	Ipfs_Rest = 'Ipfs_Rest',
	Juno_JsonRpc = 'Juno_JsonRpc',
	Kabila_WalletConnect = 'Kabila_WalletConnect',
	KaspaExplorer_Rest = 'KaspaExplorer_Rest',
	KaspaNode_Grpc = 'KaspaNode_Grpc',
	KaspaNode_Rest = 'KaspaNode_Rest',
	KaspaNode_Wrpc = 'KaspaNode_Wrpc',
	KaspaWalletCli_WalletApi = 'KaspaWalletCli_WalletApi',
	KaspaWalletSdk_WalletApi = 'KaspaWalletSdk_WalletApi',
	KaswareWallet_WalletApi = 'KaswareWallet_WalletApi',
	Keplr_WalletApi = 'Keplr_WalletApi',
	Koios_Rest = 'Koios_Rest',
	L2Beat_Rest = 'L2Beat_Rest',
	LayerZeroScan_Rest = 'LayerZeroScan_Rest',
	Leap_WalletApi = 'Leap_WalletApi',
	LedgerFilecoin_WalletApi = 'LedgerFilecoin_WalletApi',
	Lens_Graphql = 'Lens_Graphql',
	LibtorrentSession_Rest = 'LibtorrentSession_Rest',
	Lifi_Rest = 'Lifi_Rest',
	LifiStatus_Rest = 'LifiStatus_Rest',
	LightningLnd_Grpc = 'LightningLnd_Grpc',
	LightningLnd_Rest = 'LightningLnd_Rest',
	LightningMempoolSpace_Rest = 'LightningMempoolSpace_Rest',
	LitecoinCore_JsonRpc = 'LitecoinCore_JsonRpc',
	LitecoinLips_Github = 'LitecoinLips_Github',
	LitecoinWalletRpc_JsonRpc = 'LitecoinWalletRpc_JsonRpc',
	Local_Internal = 'Local_Internal',
	LogosBlockchainNode_Rest = 'LogosBlockchainNode_Rest',
	LogosDocs_Rest = 'LogosDocs_Rest',
	Lotus_JsonRpc = 'Lotus_JsonRpc',
	Magic_HederaWalletApi = 'Magic_HederaWalletApi',
	MagnetUri_Uri = 'MagnetUri_Uri',
	Martian_WalletApi = 'Martian_WalletApi',
	Mastodon_Rest = 'Mastodon_Rest',
	MempoolSpace_Rest = 'MempoolSpace_Rest',
	MetadataVision_Rest = 'MetadataVision_Rest',
	MetaplexDAS_Rest = 'MetaplexDAS_Rest',
	MevRelay_Rest = 'MevRelay_Rest',
	Mintscan_Rest = 'Mintscan_Rest',
	MoneroDaemonRpc_JsonRpc = 'MoneroDaemonRpc_JsonRpc',
	MoneroWalletRpc_JsonRpc = 'MoneroWalletRpc_JsonRpc',
	NearBlocks_Rest = 'NearBlocks_Rest',
	NearConnect_WalletApi = 'NearConnect_WalletApi',
	NearNeps_Github = 'NearNeps_Github',
	NearRpc_JsonRpc = 'NearRpc_JsonRpc',
	NearWalletSelector_WalletApi = 'NearWalletSelector_WalletApi',
	Neynar_Rest = 'Neynar_Rest',
	Nfid_WalletApi = 'Nfid_WalletApi',
	Nitro_ClientStore = 'Nitro_ClientStore',
	Nitro_NodeRpc = 'Nitro_NodeRpc',
	Nodely_Algod_Rest = 'Nodely_Algod_Rest',
	Nodely_AlgorandIndexer_Rest = 'Nodely_AlgorandIndexer_Rest',
	NostrBand_Rest = 'NostrBand_Rest',
	NostrRelay_Nip11_Http = 'NostrRelay_Nip11_Http',
	NostrRelay_WebSocket = 'NostrRelay_WebSocket',
	Ogmios_JsonRpc = 'Ogmios_JsonRpc',
	OneInchSwap_Rest = 'OneInchSwap_Rest',
	Openchain_Rest = 'Openchain_Rest',
	OpenSea_Rest = 'OpenSea_Rest',
	Osmosis_LCD_Rest = 'Osmosis_LCD_Rest',
	Paraswap_Rest = 'Paraswap_Rest',
	Pathfinder_JsonRpc = 'Pathfinder_JsonRpc',
	PayjoinDirectory_Rest = 'PayjoinDirectory_Rest',
	PayjoinOhttpRelay_Http = 'PayjoinOhttpRelay_Http',
	PayjoinReceiver_Http = 'PayjoinReceiver_Http',
	Petra_WalletApi = 'Petra_WalletApi',
	Piped_Rest = 'Piped_Rest',
	PlugWallet_WalletApi = 'PlugWallet_WalletApi',
	Polkadot_JsonRpc = 'Polkadot_JsonRpc',
	PolkadotInjectedWeb3_WalletApi = 'PolkadotInjectedWeb3_WalletApi',
	PolkadotRfcs_Github = 'PolkadotRfcs_Github',
	Pontem_WalletApi = 'Pontem_WalletApi',
	Primal_Rest = 'Primal_Rest',
	Pyth_EvmContract = 'Pyth_EvmContract',
	Pyth_SolanaProgram = 'Pyth_SolanaProgram',
	PythBenchmarks_Rest = 'PythBenchmarks_Rest',
	PythHermes_Rest = 'PythHermes_Rest',
	PythPriceFeedsCatalog_Rest = 'PythPriceFeedsCatalog_Rest',
	qBittorrentWebUi_Rest = 'qBittorrentWebUi_Rest',
	QuilibriumDocs_Rest = 'QuilibriumDocs_Rest',
	QuilibriumNode_Grpc = 'QuilibriumNode_Grpc',
	QuilibriumNodeRpc_Grpc = 'QuilibriumNodeRpc_Grpc',
	QuilibriumNodeMetrics_Prometheus = 'QuilibriumNodeMetrics_Prometheus',
	Radicle_Local = 'Radicle_Local',
	Radicle_Remote = 'Radicle_Remote',
	RadicleCli_Local = 'RadicleCli_Local',
	RadicleNode_Control = 'RadicleNode_Control',
	Reddit_PublicJson = 'Reddit_PublicJson',
	Reddit_Rest = 'Reddit_Rest',
	Reservoir_Rest = 'Reservoir_Rest',
	Reth_JsonRpc = 'Reth_JsonRpc',
	Rss_Rest = 'Rss_Rest',
	Rss2Json_Rest = 'Rss2Json_Rest',
	SigstoreRekor_Rest = 'SigstoreRekor_Rest',
	Snapchain_Rest = 'Snapchain_Rest',
	Solana_JsonRpc = 'Solana_JsonRpc',
	SolanaMobileWalletAdapter_WalletApi = 'SolanaMobileWalletAdapter_WalletApi',
	SolanaSimds_Github = 'SolanaSimds_Github',
	Sourcify_Rest = 'Sourcify_Rest',
	Starknet_JsonRpc = 'Starknet_JsonRpc',
	Starkscan_Rest = 'Starkscan_Rest',
	StellarExpert_Rest = 'StellarExpert_Rest',
	StellarHorizon_Rest = 'StellarHorizon_Rest',
	StellarRpc_JsonRpc = 'StellarRpc_JsonRpc',
	StellarToml_Rest = 'StellarToml_Rest',
	StoicWallet_WalletApi = 'StoicWallet_WalletApi',
	Subscan_Rest = 'Subscan_Rest',
	SubstrateSidecar_Rest = 'SubstrateSidecar_Rest',
	Sui_Graphql = 'Sui_Graphql',
	Sui_Grpc = 'Sui_Grpc',
	Sui_JsonRpc = 'Sui_JsonRpc',
	Superchain_Github = 'Superchain_Github',
	Swarm_Rest = 'Swarm_Rest',
	TezosDappetizer_Postgres = 'TezosDappetizer_Postgres',
	TezosNode_Rpc = 'TezosNode_Rpc',
	TheGraph_Graphql = 'TheGraph_Graphql',
	ThreeXpl_Rest = 'ThreeXpl_Rest',
	TonApi_Rest = 'TonApi_Rest',
	TonCenter_V2_Rest = 'TonCenter_V2_Rest',
	TonCenter_V3_Rest = 'TonCenter_V3_Rest',
	TonConnect_WalletApi = 'TonConnect_WalletApi',
	Tonlib_JsonRpc = 'Tonlib_JsonRpc',
	TonLiteServer_Adnl = 'TonLiteServer_Adnl',
	TonVerifier_Rest = 'TonVerifier_Rest',
	TradingView_Rest = 'TradingView_Rest',
	TransmissionRpc_JsonRpc = 'TransmissionRpc_JsonRpc',
	TronFullNode_Rest = 'TronFullNode_Rest',
	TronGrid_Rest = 'TronGrid_Rest',
	TronLink_WalletApi = 'TronLink_WalletApi',
	TronScan_Rest = 'TronScan_Rest',
	TronSolidityNode_Rest = 'TronSolidityNode_Rest',
	TronTip1193_WalletApi = 'TronTip1193_WalletApi',
	TronTip6963_WalletApi = 'TronTip6963_WalletApi',
	TrustWalletAssets_Github = 'TrustWalletAssets_Github',
	Tzkt_Rest = 'Tzkt_Rest',
	Voltaire_JsonRpc = 'Voltaire_JsonRpc',
	Voyager_Rest = 'Voyager_Rest',
	WakuNode_Rest = 'WakuNode_Rest',
	WalletConnect_SignClient = 'WalletConnect_SignClient',
	WalletStandard_WalletApi = 'WalletStandard_WalletApi',
	WebTorrent_Client = 'WebTorrent_Client',
	WebTorrent_Dht = 'WebTorrent_Dht',
	WebTorrent_Tracker = 'WebTorrent_Tracker',
	Wormholescan_Rest = 'Wormholescan_Rest',
	X_FxEmbed_Rest = 'X_FxEmbed_Rest',
	X_Rest = 'X_Rest',
	Xaman_Api = 'Xaman_Api',
	Xmtp_BrowserSdk = 'Xmtp_BrowserSdk',
	Xmtp_NodeSdk = 'Xmtp_NodeSdk',
	Xrpl_Rippled = 'Xrpl_Rippled',
	XrplClio_JsonRpc = 'XrplClio_JsonRpc',
	XrpScan_Rest = 'XrpScan_Rest',
	Youtube_Rest = 'Youtube_Rest',
	ZcashClientBackend_Local = 'ZcashClientBackend_Local',
	Zcashd_JsonRpc = 'Zcashd_JsonRpc',
	ZcashdWallet_JsonRpc = 'ZcashdWallet_JsonRpc',
	ZcashLightwalletd_Grpc = 'ZcashLightwalletd_Grpc',
	ZcashZips_Github = 'ZcashZips_Github',
	Zebra_JsonRpc = 'Zebra_JsonRpc',
	ZeroExSwap_Rest = 'ZeroExSwap_Rest',
	ZeroGChain_JsonRpc = 'ZeroGChain_JsonRpc',
	ZeroGChainScan_Rest = 'ZeroGChainScan_Rest',
	ZeroGStorageNode_JsonRpc = 'ZeroGStorageNode_JsonRpc',
	ZeroGStorageScan_Rest = 'ZeroGStorageScan_Rest',
}

export const sourceBindings = {
	[SourceBinding.Across_Rest]: { provider: SourceProvider.Across, source: Source.Across_Rest, target: { kind: SourceTargetKind.Global, key: 'bridge-route-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AcrossApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Algod_Rest]: { provider: SourceProvider.Algod, source: Source.Algod_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'algorand' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AlgodApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AlgorandIndexer_Rest]: { provider: SourceProvider.AlgorandIndexer, source: Source.AlgorandIndexer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'algorand' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AlgorandIndexerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AlgorandWallet_WalletApi]: { provider: SourceProvider.AlgorandWallet, source: Source.AlgorandWallet_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Allium_Rest]: { provider: SourceProvider.Allium, source: Source.Allium_Rest, target: { kind: SourceTargetKind.SqlDataset, key: 'allium-dataset' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-query-api' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AlliumQueryApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Amboss_Graphql]: { provider: SourceProvider.Amboss, source: Source.Amboss_Graphql, target: { kind: SourceTargetKind.Global, key: 'lightning-node-directory' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.AptosAip62_WalletApi]: { provider: SourceProvider.AptosAip62, source: Source.AptosAip62_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.AptosFullnode_Rest]: { provider: SourceProvider.AptosFullnode, source: Source.AptosFullnode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'aptos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AptosFullnodeApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AptosIndexer_Graphql]: { provider: SourceProvider.AptosIndexer, source: Source.AptosIndexer_Graphql, target: { kind: SourceTargetKind.Caip2Network, key: 'aptos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Arweave_Graphql]: { provider: SourceProvider.Arweave, source: Source.Arweave_Graphql, target: { kind: SourceTargetKind.ContentAddressScheme, key: 'arweave' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-graphql' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Arweave_Rest]: { provider: SourceProvider.Arweave, source: Source.Arweave_Rest, target: { kind: SourceTargetKind.ContentAddressScheme, key: 'arweave' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-gateway' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ArweaveGateway, operationGroups: [SourceOperationGroup.ContentGatewayRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Atproto_BskySocial_Xrpc]: { provider: SourceProvider.AtprotoBskySocial, source: Source.Atproto_BskySocial_Xrpc, target: { kind: SourceTargetKind.Feed, key: 'atproto' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Xrpc, apiFamily: ApiFamily.AtprotoXrpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Atproto_Xrpc]: { provider: SourceProvider.AtprotoBsky, source: Source.Atproto_Xrpc, target: { kind: SourceTargetKind.Feed, key: 'atproto' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Xrpc, apiFamily: ApiFamily.AtprotoXrpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AtprotoSync_Xrpc]: { provider: SourceProvider.AtprotoSync, source: Source.AtprotoSync_Xrpc, target: { kind: SourceTargetKind.Feed, key: 'atproto-repo-sync' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-pds-or-relay-xrpc' }, { endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'configured-pds-or-relay-firehose' }], wireProtocol: WireProtocol.Xrpc, apiFamily: ApiFamily.AtprotoXrpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.JsonSchema, path: 'lexicons/com/atproto/sync/*.json', generated: false }] },
	[SourceBinding.Avail_JsonRpc]: { provider: SourceProvider.Avail, source: Source.Avail_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'avail' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.SubstrateJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AvailExplorer_Rest]: { provider: SourceProvider.AvailExplorer, source: Source.AvailExplorer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'avail' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AvailExplorerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AvalancheInfo_JsonRpc]: { provider: SourceProvider.AvalancheInfo, source: Source.AvalancheInfo_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'avalanche-p-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.AvalanchePlatformVm_JsonRpc]: { provider: SourceProvider.AvalanchePlatformVm, source: Source.AvalanchePlatformVm_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'avalanche-p-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Avascan_Rest]: { provider: SourceProvider.Avascan, source: Source.Avascan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'avalanche' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AvascanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Axelarscan_Rest]: { provider: SourceProvider.Axelarscan, source: Source.Axelarscan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'axelar' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AxelarscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Beacon_Rest]: { provider: SourceProvider.Beacon, source: Source.Beacon_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EthereumBeaconRestApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BeaconchaIn_Rest]: { provider: SourceProvider.BeaconchaIn, source: Source.BeaconchaIn_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BeaconchaInApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BetterCallDev_Rest]: { provider: SourceProvider.BetterCallDev, source: Source.BetterCallDev_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tezos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BetterCallDevApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BigDipper_Rest]: { provider: SourceProvider.BigDipper, source: Source.BigDipper_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cosmos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BigDipperApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BinanceChainApi_Rest]: { provider: SourceProvider.BinanceChainApi, source: Source.BinanceChainApi_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'bnb-beacon-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BinanceChainApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BinanceChainExplorer_Rest]: { provider: SourceProvider.BinanceChainExplorer, source: Source.BinanceChainExplorer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'bnb-beacon-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BinanceChainExplorerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitcoinBips_Github]: { provider: SourceProvider.BitcoinBips, source: Source.BitcoinBips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitcoinCashBcmr_Github]: { provider: SourceProvider.BitcoinCashBcmr, source: Source.BitcoinCashBcmr_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitcoinCashChips_Gitlab]: { provider: SourceProvider.BitcoinCashChips, source: Source.BitcoinCashChips_Gitlab, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'gitlab-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GitlabRest, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitcoinCashNode_JsonRpc]: { provider: SourceProvider.BitcoinCashNode, source: Source.BitcoinCashNode_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'bitcoin-cash' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitcoinCore_JsonRpc]: { provider: SourceProvider.BitcoinCore, source: Source.BitcoinCore_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'bitcoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Bithomp_Rest]: { provider: SourceProvider.Bithomp, source: Source.Bithomp_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'xrpl' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BithompApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Bittensor_JsonRpc]: { provider: SourceProvider.Bittensor, source: Source.Bittensor_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'bittensor' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrent_HttpTracker]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrent_HttpTracker, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-tracker' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BitTorrentTracker, operationGroups: [SourceOperationGroup.BitTorrentAnnounce], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrent_MainlineDht]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrent_MainlineDht, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.UdpAddress, locator: 'configured-dht-bootstrap' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrentDht, operationGroups: [SourceOperationGroup.BitTorrentDhtLookup], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrent_MetadataExchange]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrent_MetadataExchange, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-peer' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrent_MetadataExchange, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrent_PeerWire]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrent_PeerWire, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-peer' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrent_PeerWire, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrent_UdpTracker]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrent_UdpTracker, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.UdpAddress, locator: 'configured-tracker' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrentTracker, operationGroups: [SourceOperationGroup.BitTorrentAnnounce], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BitTorrentMetainfo_File]: { provider: SourceProvider.BitTorrent, source: Source.BitTorrentMetainfo_File, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-torrent-file' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrentMetainfo, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Blobscan_Rest]: { provider: SourceProvider.Blobscan, source: Source.Blobscan_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BlobscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Blockchair_Rest]: { provider: SourceProvider.Blockchair, source: Source.Blockchair_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'configured-network' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BlockchairApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Blockfrost_Rest]: { provider: SourceProvider.Blockfrost, source: Source.Blockfrost_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BlockfrostApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Blockscout_Rest]: { provider: SourceProvider.Blockscout, source: Source.Blockscout_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BlockscoutApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BnbBeaconArchive_Rest]: { provider: SourceProvider.BnbBeaconArchive, source: Source.BnbBeaconArchive_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'bnb-beacon-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BnbBeaconArchiveApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.BnbChainFusion_Rest]: { provider: SourceProvider.BnbChainFusion, source: Source.BnbChainFusion_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'bnb-beacon-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BnbChainFusionApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CaipNamespaces_Github]: { provider: SourceProvider.Caips, source: Source.CaipNamespaces_Github, target: { kind: SourceTargetKind.GitRepository, key: 'ChainAgnostic/namespaces@main:namespaces' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Caips_Github]: { provider: SourceProvider.Caips, source: Source.Caips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CardanoBlockfrost_Rest]: { provider: SourceProvider.CardanoBlockfrost, source: Source.CardanoBlockfrost_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BlockfrostApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CardanoCip30_WalletApi]: { provider: SourceProvider.CardanoCip30, source: Source.CardanoCip30_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.CardanoDbSync_Postgres]: { provider: SourceProvider.CardanoDbSync, source: Source.CardanoDbSync_Postgres, target: { kind: SourceTargetKind.SqlDataset, key: 'configured-dataset' }, endpoints: [{ endpointKind: SourceEndpointKind.PostgresDsn, locator: 'configured-postgres-dsn' }], wireProtocol: WireProtocol.Sql, apiFamily: ApiFamily.Postgres, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.RuntimeSecret }] },
	[SourceBinding.CardanoKoios_Rest]: { provider: SourceProvider.CardanoKoios, source: Source.CardanoKoios_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.KoiosApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CardanoNode_LocalStateQuery]: { provider: SourceProvider.CardanoNode, source: Source.CardanoNode_LocalStateQuery, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-cardano-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CardanoLocalStateQuery, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Cardanoscan_Rest]: { provider: SourceProvider.Cardanoscan, source: Source.Cardanoscan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CardanoscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CashuMint_Rest]: { provider: SourceProvider.Cashu, source: Source.CashuMint_Rest, target: { kind: SourceTargetKind.Global, key: 'configured-cashu-mint' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CashuNutHttpApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Celenium_Rest]: { provider: SourceProvider.Celenium, source: Source.Celenium_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'celestia' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CeleniumApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Celestia_JsonRpc]: { provider: SourceProvider.Celestia, source: Source.Celestia_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'celestia' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.CelestiaNodeJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ChainlinkDataFeeds_AddressCatalog]: { provider: SourceProvider.ChainlinkDataFeeds, source: Source.ChainlinkDataFeeds_AddressCatalog, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ChainlinkDataFeedsAddressCatalog, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ChainlinkDataFeeds_Contracts]: { provider: SourceProvider.ChainlinkDataFeeds, source: Source.ChainlinkDataFeeds_Contracts, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ChainlinkDataFeedsContracts, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Chainlist_Rest]: { provider: SourceProvider.Chainlist, source: Source.Chainlist_Rest, target: { kind: SourceTargetKind.Global, key: 'network-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ChainlistApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CircleCctp_IrisApi]: { provider: SourceProvider.CircleCctp, source: Source.CircleCctp_IrisApi, target: { kind: SourceTargetKind.Global, key: 'cctp-iris-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CircleIrisApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CircleCctpContracts_Evm]: { provider: SourceProvider.CircleCctp, source: Source.CircleCctpContracts_Evm, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'contract-catalog' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CircleCctpContracts_Solana]: { provider: SourceProvider.CircleCctp, source: Source.CircleCctpContracts_Solana, target: { kind: SourceTargetKind.Caip2Network, key: 'solana' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'program-catalog' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.SolanaJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CircleCctpContracts_Stellar]: { provider: SourceProvider.CircleCctp, source: Source.CircleCctpContracts_Stellar, target: { kind: SourceTargetKind.Caip2Network, key: 'stellar' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'contract-catalog' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StellarHorizonOrRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CodexNetworkPresets_Github]: { provider: SourceProvider.CodexNetworkPresets, source: Source.CodexNetworkPresets_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CodexNode_Rest]: { provider: SourceProvider.CodexNode, source: Source.CodexNode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'codex' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CodexNodeApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Coingecko_OpenApi]: { provider: SourceProvider.Coingecko, source: Source.Coingecko_OpenApi, target: { kind: SourceTargetKind.Global, key: 'market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenApiHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.OpenApiSpec, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.OpenApiTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Coingecko_Rest]: { provider: SourceProvider.Coingecko, source: Source.Coingecko_Rest, target: { kind: SourceTargetKind.Global, key: 'market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CoingeckoApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CoinMarketCap_Rest]: { provider: SourceProvider.CoinMarketCap, source: Source.CoinMarketCap_Rest, target: { kind: SourceTargetKind.Global, key: 'market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CoinMarketCapApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Coinpaprika_OpenApi]: { provider: SourceProvider.Coinpaprika, source: Source.Coinpaprika_OpenApi, target: { kind: SourceTargetKind.Global, key: 'market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenApiHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.OpenApiSpec, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.OpenApiTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.CometBft_Rest]: { provider: SourceProvider.CometBft, source: Source.CometBft_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cosmos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CometBftRestApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Conseil_Postgres]: { provider: SourceProvider.Conseil, source: Source.Conseil_Postgres, target: { kind: SourceTargetKind.SqlDataset, key: 'configured-dataset' }, endpoints: [{ endpointKind: SourceEndpointKind.PostgresDsn, locator: 'configured-postgres-dsn' }], wireProtocol: WireProtocol.Sql, apiFamily: ApiFamily.Postgres, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.RuntimeSecret }] },
	[SourceBinding.Constants_Internal]: { provider: SourceProvider._Constants, source: Source.Constants_Internal, target: { kind: SourceTargetKind.Global, key: 'checked-in-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'src/constants/**' }], wireProtocol: WireProtocol.InProcess, apiFamily: ApiFamily.CatalogRows, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CosmosAdrs_Github]: { provider: SourceProvider.CosmosAdrs, source: Source.CosmosAdrs_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CosmosChainRegistry_Github]: { provider: SourceProvider.CosmosChainRegistry, source: Source.CosmosChainRegistry_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CosmosSdk_Rest]: { provider: SourceProvider.CosmosSdk, source: Source.CosmosSdk_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cosmos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CosmosSdkRest, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.CronosExplorer_Rest]: { provider: SourceProvider.CronosExplorer, source: Source.CronosExplorer_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CronosExplorerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Defillama_OpenApi]: { provider: SourceProvider.Defillama, source: Source.Defillama_OpenApi, target: { kind: SourceTargetKind.Global, key: 'defi-market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenApiHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.OpenApiSpec, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.OpenApiTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Defillama_Rest]: { provider: SourceProvider.Defillama, source: Source.Defillama_Rest, target: { kind: SourceTargetKind.Global, key: 'defi-market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.DefillamaApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Dexscreener_OpenApi]: { provider: SourceProvider.Dexscreener, source: Source.Dexscreener_OpenApi, target: { kind: SourceTargetKind.Global, key: 'dex-market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenApiHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.OpenApiSpec, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.OpenApiTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.DogecoinCore_JsonRpc]: { provider: SourceProvider.DogecoinCore, source: Source.DogecoinCore_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'dogecoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.DogecoinDips_Github]: { provider: SourceProvider.DogecoinDips, source: Source.DogecoinDips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Dune_Rest]: { provider: SourceProvider.Dune, source: Source.Dune_Rest, target: { kind: SourceTargetKind.SqlDataset, key: 'dune-dataset' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-query-api' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.DuneApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.DydxIndexer_Rest]: { provider: SourceProvider.Dydx, source: Source.DydxIndexer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'dydx-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.DydxIndexerRest, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.DydxValidator_Rest]: { provider: SourceProvider.Dydx, source: Source.DydxValidator_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'dydx-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CosmosSdkRest, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EasContracts_Evm]: { provider: SourceProvider.Eas, source: Source.EasContracts_Evm, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'contract-catalog' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EasScan_Graphql]: { provider: SourceProvider.Eas, source: Source.EasScan_Graphql, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.EigenExplorer_Rest]: { provider: SourceProvider.EigenExplorer, source: Source.EigenExplorer_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'eigenlayer' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EigenExplorerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EigenLayerContracts_Evm]: { provider: SourceProvider.EigenLayer, source: Source.EigenLayerContracts_Evm, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'contract-catalog' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EigenLayerSubgraph_Graphql]: { provider: SourceProvider.EigenLayer, source: Source.EigenLayerSubgraph_Graphql, target: { kind: SourceTargetKind.Eip155Chain, key: 'eigenlayer' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-subgraph' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Ensips_Github]: { provider: SourceProvider.Ensips, source: Source.Ensips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EnsMetadataService_Rest]: { provider: SourceProvider.EnsMetadataService, source: Source.EnsMetadataService_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EnsMetadataServiceApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Erigon_JsonRpc]: { provider: SourceProvider.Erigon, source: Source.Erigon_JsonRpc, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore, SourceOperationGroup.EvmRpcTrace, SourceOperationGroup.EvmRpcTxpool], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Esplora_Rest]: { provider: SourceProvider.Esplora, source: Source.Esplora_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'utxo-network' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EsploraApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EthereumEips_Github]: { provider: SourceProvider.EthereumEips, source: Source.EthereumEips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EthereumLists_Rest]: { provider: SourceProvider.EthereumLists, source: Source.EthereumLists_Rest, target: { kind: SourceTargetKind.Global, key: 'asset-network-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EthereumListsApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EthereumSpecs_Github]: { provider: SourceProvider.EthereumSpecs, source: Source.EthereumSpecs_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Etherscan_Rest]: { provider: SourceProvider.Etherscan, source: Source.Etherscan_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EtherscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.EthForks_Rest]: { provider: SourceProvider.EthForks, source: Source.EthForks_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.EthForksApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Farcaster_Rest]: { provider: SourceProvider.Farcaster, source: Source.Farcaster_Rest, target: { kind: SourceTargetKind.Feed, key: 'farcaster' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.FarcasterHubHttpApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Fedi_Rest]: { provider: SourceProvider.Fedi, source: Source.Fedi_Rest, target: { kind: SourceTargetKind.Feed, key: 'activitypub' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.FediApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.FedimintClient_Rpc]: { provider: SourceProvider.FedimintClient, source: Source.FedimintClient_Rpc, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-fedimint-client' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.FedimintGatewayd_Rest]: { provider: SourceProvider.FedimintGatewayd, source: Source.FedimintGatewayd_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-fedimint-gatewayd' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.FedimintGatewaydApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.FilecoinFips_Github]: { provider: SourceProvider.FilecoinFips, source: Source.FilecoinFips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Filfox_Rest]: { provider: SourceProvider.Filfox, source: Source.Filfox_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'filecoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.FilfoxApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ForgejoIssues_Rest]: { provider: SourceProvider.Forgejo, source: Source.ForgejoIssues_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ForgejoIssuesApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ForgejoPulls_Rest]: { provider: SourceProvider.Forgejo, source: Source.ForgejoPulls_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ForgejoPullsApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ForgejoReleases_Rest]: { provider: SourceProvider.Forgejo, source: Source.ForgejoReleases_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ForgejoReleasesApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ForgejoRepos_Rest]: { provider: SourceProvider.Forgejo, source: Source.ForgejoRepos_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ForgejoReposApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Freighter_WalletApi]: { provider: SourceProvider.Freighter, source: Source.Freighter_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Git_Local]: { provider: SourceProvider.Git, source: Source.Git_Local, target: { kind: SourceTargetKind.LocalDevice, key: 'workspace' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-local-path' }], wireProtocol: WireProtocol.LocalFiles, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Git_Remote]: { provider: SourceProvider.Git, source: Source.Git_Remote, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GitRemote, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Github_Git]: { provider: SourceProvider.Github, source: Source.Github_Git, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.Git, apiFamily: ApiFamily.GitObject, operationGroups: [SourceOperationGroup.GitObject], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Github_Rest]: { provider: SourceProvider.Github, source: Source.Github_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Gitlab_Rest]: { provider: SourceProvider.Gitlab, source: Source.Gitlab_Rest, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'gitlab-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GitlabRest, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.HashConnect_WalletApi]: { provider: SourceProvider.HashConnect, source: Source.HashConnect_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.HederaMirrorNode_Rest]: { provider: SourceProvider.HederaMirrorNode, source: Source.HederaMirrorNode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'hedera' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.HederaMirrorNodeApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.HederaSdk_Grpc]: { provider: SourceProvider.HederaSdk, source: Source.HederaSdk_Grpc, target: { kind: SourceTargetKind.Caip2Network, key: 'hedera' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.HederaWalletConnect_SignClient]: { provider: SourceProvider.HederaWalletConnect, source: Source.HederaWalletConnect_SignClient, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Helius_Rest]: { provider: SourceProvider.Helius, source: Source.Helius_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'solana' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.HeliusApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.HyperliquidDocs_Rest]: { provider: SourceProvider.HyperliquidDocs, source: Source.HyperliquidDocs_Rest, target: { kind: SourceTargetKind.Global, key: 'hyperliquid-docs' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://hyperliquid.gitbook.io' }], wireProtocol: WireProtocol.RawHttp, apiFamily: ApiFamily.StaticWebsite, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Hyperliquid_JsonRpc]: { provider: SourceProvider.Hyperliquid, source: Source.Hyperliquid_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'hyperliquid' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Hyperliquid_Rest]: { provider: SourceProvider.Hyperliquid, source: Source.Hyperliquid_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'hyperliquid' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.HyperliquidRestApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.IcDashboard_Canister]: { provider: SourceProvider.InternetComputer, source: Source.IcDashboard_Canister, target: { kind: SourceTargetKind.Canister, key: 'configured-canister' }, endpoints: [{ endpointKind: SourceEndpointKind.CanisterId, locator: 'configured-canister-id' }], wireProtocol: WireProtocol.Canister, apiFamily: ApiFamily.IcCanister, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.RemoteQuery, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.Candid, path: '$source-artifact', generated: false }] },
	[SourceBinding.InternetComputer_Canister]: { provider: SourceProvider.InternetComputer, source: Source.InternetComputer_Canister, target: { kind: SourceTargetKind.Canister, key: 'configured-canister' }, endpoints: [{ endpointKind: SourceEndpointKind.CanisterId, locator: 'configured-canister-id' }], wireProtocol: WireProtocol.Canister, apiFamily: ApiFamily.IcCanister, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.RemoteQuery, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.Candid, path: '$source-artifact', generated: false }] },
	[SourceBinding.InternetComputer_Http]: { provider: SourceProvider.InternetComputer, source: Source.InternetComputer_Http, target: { kind: SourceTargetKind.Global, key: 'internet-computer' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-ic-boundary' }], wireProtocol: WireProtocol.RawHttp, apiFamily: ApiFamily.CertifiedHttpGateway, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.RemoteQuery, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.Candid, path: '$source-artifact', generated: false }] },
	[SourceBinding.InternetComputer_RosettaApi]: { provider: SourceProvider.InternetComputer, source: Source.InternetComputer_RosettaApi, target: { kind: SourceTargetKind.Canister, key: 'configured-canister' }, endpoints: [{ endpointKind: SourceEndpointKind.CanisterId, locator: 'configured-canister-id' }], wireProtocol: WireProtocol.Canister, apiFamily: ApiFamily.IcCanister, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.RemoteQuery, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.Candid, path: '$source-artifact', generated: false }] },
	[SourceBinding.InternetComputer_WalletApi]: { provider: SourceProvider.InternetComputer, source: Source.InternetComputer_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.InternetIdentity_Delegation]: { provider: SourceProvider.InternetIdentity, source: Source.InternetIdentity_Delegation, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Ipfs_Rest]: { provider: SourceProvider.Ipfs, source: Source.Ipfs_Rest, target: { kind: SourceTargetKind.ContentAddressScheme, key: 'ipfs' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-gateway' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.IpfsGateway, operationGroups: [SourceOperationGroup.ContentGatewayRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Juno_JsonRpc]: { provider: SourceProvider.Juno, source: Source.Juno_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'starknet' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.StarknetJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Kabila_WalletConnect]: { provider: SourceProvider.Kabila, source: Source.Kabila_WalletConnect, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.KaspaExplorer_Rest]: { provider: SourceProvider.KaspaExplorer, source: Source.KaspaExplorer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'kaspa' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.KaspaExplorerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.KaspaNode_Grpc]: { provider: SourceProvider.KaspaNode, source: Source.KaspaNode_Grpc, target: { kind: SourceTargetKind.Caip2Network, key: 'kaspa' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.KaspaNode_Rest]: { provider: SourceProvider.KaspaNode, source: Source.KaspaNode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'kaspa' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-rest-endpoint' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.KaspaRestApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.KaspaNode_Wrpc]: { provider: SourceProvider.KaspaNode, source: Source.KaspaNode_Wrpc, target: { kind: SourceTargetKind.Caip2Network, key: 'kaspa' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Wrpc, apiFamily: ApiFamily.KaspaWrpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.KaspaWalletCli_WalletApi]: { provider: SourceProvider.KaspaWalletCli, source: Source.KaspaWalletCli_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.KaspaWalletSdk_WalletApi]: { provider: SourceProvider.KaspaWalletSdk, source: Source.KaspaWalletSdk_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.KaswareWallet_WalletApi]: { provider: SourceProvider.KaswareWallet, source: Source.KaswareWallet_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Keplr_WalletApi]: { provider: SourceProvider.Keplr, source: Source.Keplr_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Koios_Rest]: { provider: SourceProvider.Koios, source: Source.Koios_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.KoiosApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.L2Beat_Rest]: { provider: SourceProvider.L2Beat, source: Source.L2Beat_Rest, target: { kind: SourceTargetKind.Global, key: 'scaling-project-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.L2BeatScalingApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LayerZeroScan_Rest]: { provider: SourceProvider.LayerZeroScan, source: Source.LayerZeroScan_Rest, target: { kind: SourceTargetKind.Global, key: 'bridge-message-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LayerZeroScanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Leap_WalletApi]: { provider: SourceProvider.Leap, source: Source.Leap_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.LedgerFilecoin_WalletApi]: { provider: SourceProvider.LedgerFilecoin, source: Source.LedgerFilecoin_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Lens_Graphql]: { provider: SourceProvider.Lens, source: Source.Lens_Graphql, target: { kind: SourceTargetKind.Feed, key: 'lens' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.LibtorrentSession_Rest]: { provider: SourceProvider.LibtorrentSession, source: Source.LibtorrentSession_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-libtorrent-session' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-session-api' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BitTorrentClient, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Lifi_Rest]: { provider: SourceProvider.Lifi, source: Source.Lifi_Rest, target: { kind: SourceTargetKind.Global, key: 'bridge-route-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LifiQuoteApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LifiStatus_Rest]: { provider: SourceProvider.Lifi, source: Source.LifiStatus_Rest, target: { kind: SourceTargetKind.Global, key: 'bridge-status-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LifiStatusApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LightningLnd_Grpc]: { provider: SourceProvider.LightningLnd, source: Source.LightningLnd_Grpc, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-lnd-node' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead, SourceOperationGroup.WalletAccountRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.LightningLnd_Rest]: { provider: SourceProvider.LightningLnd, source: Source.LightningLnd_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-lnd-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LndRestApi, operationGroups: [SourceOperationGroup.GenericRead, SourceOperationGroup.WalletAccountRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.LightningMempoolSpace_Rest]: { provider: SourceProvider.LightningMempoolSpace, source: Source.LightningMempoolSpace_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'lightning-network' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MempoolSpaceLightningApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LitecoinCore_JsonRpc]: { provider: SourceProvider.LitecoinCore, source: Source.LitecoinCore_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'litecoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LitecoinLips_Github]: { provider: SourceProvider.LitecoinLips, source: Source.LitecoinLips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.LitecoinWalletRpc_JsonRpc]: { provider: SourceProvider.LitecoinWalletRpc, source: Source.LitecoinWalletRpc_JsonRpc, target: { kind: SourceTargetKind.LocalDevice, key: 'wallet-rpc' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-rpc' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Local_Internal]: { provider: SourceProvider.Local, source: Source.Local_Internal, target: { kind: SourceTargetKind.LocalDevice, key: 'workspace' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-local-path' }], wireProtocol: WireProtocol.LocalFiles, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.LogosBlockchainNode_Rest]: { provider: SourceProvider.LogosBlockchainNode, source: Source.LogosBlockchainNode_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-logos-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-rest-api' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LogosBlockchainNodeApi, operationGroups: [SourceOperationGroup.GenericRead, SourceOperationGroup.WalletAccountRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.LogosDocs_Rest]: { provider: SourceProvider.LogosDocs, source: Source.LogosDocs_Rest, target: { kind: SourceTargetKind.Global, key: 'docs' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://docs.logoslabs.io' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RestJson, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Lotus_JsonRpc]: { provider: SourceProvider.Lotus, source: Source.Lotus_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'filecoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Magic_HederaWalletApi]: { provider: SourceProvider.Magic, source: Source.Magic_HederaWalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.MagnetUri_Uri]: { provider: SourceProvider.MagnetUri, source: Source.MagnetUri_Uri, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'magnet-uri-parser' }], wireProtocol: WireProtocol.Uri, apiFamily: ApiFamily.Uri, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Martian_WalletApi]: { provider: SourceProvider.Martian, source: Source.Martian_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Mastodon_Rest]: { provider: SourceProvider.Mastodon, source: Source.Mastodon_Rest, target: { kind: SourceTargetKind.Feed, key: 'activitypub' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MastodonApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MempoolSpace_Rest]: { provider: SourceProvider.MempoolSpace, source: Source.MempoolSpace_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'bitcoin' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MempoolSpaceApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MetadataVision_Rest]: { provider: SourceProvider.MetadataVision, source: Source.MetadataVision_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MetadataVisionApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MetaplexDAS_Rest]: { provider: SourceProvider.MetaplexDAS, source: Source.MetaplexDAS_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'solana' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MetaplexDasApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MevRelay_Rest]: { provider: SourceProvider.MevRelay, source: Source.MevRelay_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MevRelayApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Mintscan_Rest]: { provider: SourceProvider.Mintscan, source: Source.Mintscan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cosmos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.MintscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MoneroDaemonRpc_JsonRpc]: { provider: SourceProvider.MoneroDaemonRpc, source: Source.MoneroDaemonRpc_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'monero' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.MoneroWalletRpc_JsonRpc]: { provider: SourceProvider.MoneroWalletRpc, source: Source.MoneroWalletRpc_JsonRpc, target: { kind: SourceTargetKind.LocalDevice, key: 'wallet-rpc' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-rpc' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.NearBlocks_Rest]: { provider: SourceProvider.NearBlocks, source: Source.NearBlocks_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'near' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.NearBlocksApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NearConnect_WalletApi]: { provider: SourceProvider.NearConnect, source: Source.NearConnect_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.NearNeps_Github]: { provider: SourceProvider.NearNeps, source: Source.NearNeps_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NearRpc_JsonRpc]: { provider: SourceProvider.NearRpc, source: Source.NearRpc_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'near' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-rpc-endpoint' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NearWalletSelector_WalletApi]: { provider: SourceProvider.NearWalletSelector, source: Source.NearWalletSelector_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Neynar_Rest]: { provider: SourceProvider.Neynar, source: Source.Neynar_Rest, target: { kind: SourceTargetKind.Feed, key: 'farcaster' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.NeynarApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Nfid_WalletApi]: { provider: SourceProvider.Nfid, source: Source.Nfid_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Nitro_ClientStore]: { provider: SourceProvider.Nitro, source: Source.Nitro_ClientStore, target: { kind: SourceTargetKind.LocalDevice, key: 'state-channel-client-store' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Nitro_NodeRpc]: { provider: SourceProvider.Nitro, source: Source.Nitro_NodeRpc, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-state-channel-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.NitroNodeRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Nodely_Algod_Rest]: { provider: SourceProvider.Nodely, source: Source.Nodely_Algod_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'algorand' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AlgodApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Nodely_AlgorandIndexer_Rest]: { provider: SourceProvider.Nodely, source: Source.Nodely_AlgorandIndexer_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'algorand' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.AlgorandIndexerApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NostrBand_Rest]: { provider: SourceProvider.NostrBand, source: Source.NostrBand_Rest, target: { kind: SourceTargetKind.Feed, key: 'nostr' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.NostrBandApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NostrRelay_Nip11_Http]: { provider: SourceProvider.NostrRelay, source: Source.NostrRelay_Nip11_Http, target: { kind: SourceTargetKind.Feed, key: 'configured-feed' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-nostr-relay' }], wireProtocol: WireProtocol.RawHttp, apiFamily: ApiFamily.NostrNip11, operationGroups: [SourceOperationGroup.NostrRelayRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.NostrRelay_WebSocket]: { provider: SourceProvider.NostrRelay, source: Source.NostrRelay_WebSocket, target: { kind: SourceTargetKind.Feed, key: 'configured-feed' }, endpoints: [{ endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'configured-nostr-relay' }], wireProtocol: WireProtocol.JsonMessages, apiFamily: ApiFamily.NostrRelay, operationGroups: [SourceOperationGroup.NostrRelayRead], delivery: SourceDelivery.RemoteLive, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Ogmios_JsonRpc]: { provider: SourceProvider.Ogmios, source: Source.Ogmios_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'cardano' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.OneInchSwap_Rest]: { provider: SourceProvider.OneInchSwap, source: Source.OneInchSwap_Rest, target: { kind: SourceTargetKind.Global, key: 'swap-route-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OneInchSwapApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Openchain_Rest]: { provider: SourceProvider.Openchain, source: Source.Openchain_Rest, target: { kind: SourceTargetKind.Global, key: 'evm-labels-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenchainApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.OpenSea_Rest]: { provider: SourceProvider.OpenSea, source: Source.OpenSea_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.OpenSeaApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Osmosis_LCD_Rest]: { provider: SourceProvider.OsmosisLCD, source: Source.Osmosis_LCD_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'cosmos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.CosmosLcdApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Paraswap_Rest]: { provider: SourceProvider.Paraswap, source: Source.Paraswap_Rest, target: { kind: SourceTargetKind.Global, key: 'swap-route-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ParaswapApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Pathfinder_JsonRpc]: { provider: SourceProvider.Pathfinder, source: Source.Pathfinder_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'starknet' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.StarknetJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PayjoinDirectory_Rest]: { provider: SourceProvider.Payjoin, source: Source.PayjoinDirectory_Rest, target: { kind: SourceTargetKind.Global, key: 'payjoin-directory' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PayjoinDirectoryApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PayjoinOhttpRelay_Http]: { provider: SourceProvider.Payjoin, source: Source.PayjoinOhttpRelay_Http, target: { kind: SourceTargetKind.Global, key: 'payjoin-ohttp-relay' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.RawHttp, apiFamily: ApiFamily.RawHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PayjoinReceiver_Http]: { provider: SourceProvider.Payjoin, source: Source.PayjoinReceiver_Http, target: { kind: SourceTargetKind.Global, key: 'payjoin-receiver' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.RawHttp, apiFamily: ApiFamily.RawHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Petra_WalletApi]: { provider: SourceProvider.Petra, source: Source.Petra_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Piped_Rest]: { provider: SourceProvider.Piped, source: Source.Piped_Rest, target: { kind: SourceTargetKind.Feed, key: 'youtube' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PipedApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PlugWallet_WalletApi]: { provider: SourceProvider.PlugWallet, source: Source.PlugWallet_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Polkadot_JsonRpc]: { provider: SourceProvider.Polkadot, source: Source.Polkadot_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'substrate' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PolkadotInjectedWeb3_WalletApi]: { provider: SourceProvider.PolkadotInjectedWeb3, source: Source.PolkadotInjectedWeb3_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.PolkadotRfcs_Github]: { provider: SourceProvider.PolkadotRfcs, source: Source.PolkadotRfcs_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Pontem_WalletApi]: { provider: SourceProvider.Pontem, source: Source.Pontem_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Primal_Rest]: { provider: SourceProvider.Primal, source: Source.Primal_Rest, target: { kind: SourceTargetKind.Feed, key: 'nostr' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PrimalApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Pyth_EvmContract]: { provider: SourceProvider.Pyth, source: Source.Pyth_EvmContract, target: { kind: SourceTargetKind.Global, key: 'pyth-contract-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'contract-catalog' }], wireProtocol: WireProtocol.InProcess, apiFamily: ApiFamily.CatalogRows, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Pyth_SolanaProgram]: { provider: SourceProvider.Pyth, source: Source.Pyth_SolanaProgram, target: { kind: SourceTargetKind.Global, key: 'pyth-program-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'program-catalog' }], wireProtocol: WireProtocol.InProcess, apiFamily: ApiFamily.CatalogRows, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PythBenchmarks_Rest]: { provider: SourceProvider.Pyth, source: Source.PythBenchmarks_Rest, target: { kind: SourceTargetKind.Global, key: 'oracle-feed-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PythBenchmarksApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PythHermes_Rest]: { provider: SourceProvider.Pyth, source: Source.PythHermes_Rest, target: { kind: SourceTargetKind.Global, key: 'oracle-feed-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PythHermesApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.PythPriceFeedsCatalog_Rest]: { provider: SourceProvider.Pyth, source: Source.PythPriceFeedsCatalog_Rest, target: { kind: SourceTargetKind.Global, key: 'oracle-feed-catalog' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PythPriceFeedsCatalogApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.qBittorrentWebUi_Rest]: { provider: SourceProvider.qBittorrentWebUi, source: Source.qBittorrentWebUi_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-qbittorrent-client' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-qbittorrent-webui' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.BitTorrentClient, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.QuilibriumDocs_Rest]: { provider: SourceProvider.QuilibriumDocs, source: Source.QuilibriumDocs_Rest, target: { kind: SourceTargetKind.Global, key: 'docs' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://docs.quilibrium.com' }, { endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://quilibrium.com' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RestJson, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.QuilibriumNode_Grpc]: { provider: SourceProvider.QuilibriumNode, source: Source.QuilibriumNode_Grpc, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-quilibrium-node' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.QuilibriumNodeRpc_Grpc]: { provider: SourceProvider.QuilibriumNodeRpc, source: Source.QuilibriumNodeRpc_Grpc, target: { kind: SourceTargetKind.Caip2Network, key: 'quilibrium' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.QuilibriumNodeMetrics_Prometheus]: { provider: SourceProvider.QuilibriumNodeMetrics, source: Source.QuilibriumNodeMetrics_Prometheus, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-quilibrium-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.PrometheusText, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Radicle_Local]: { provider: SourceProvider.Radicle, source: Source.Radicle_Local, target: { kind: SourceTargetKind.LocalDevice, key: 'workspace' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-local-path' }], wireProtocol: WireProtocol.LocalFiles, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Radicle_Remote]: { provider: SourceProvider.Radicle, source: Source.Radicle_Remote, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RadicleRemoteApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.RadicleCli_Local]: { provider: SourceProvider.RadicleCli, source: Source.RadicleCli_Local, target: { kind: SourceTargetKind.LocalDevice, key: 'workspace' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-local-path' }], wireProtocol: WireProtocol.LocalFiles, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.RadicleNode_Control]: { provider: SourceProvider.RadicleNode, source: Source.RadicleNode_Control, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-radicle-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RadicleNodeControlApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Reddit_PublicJson]: { provider: SourceProvider.Reddit, source: Source.Reddit_PublicJson, target: { kind: SourceTargetKind.Feed, key: 'reddit' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RedditPublicJson, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Reddit_Rest]: { provider: SourceProvider.Reddit, source: Source.Reddit_Rest, target: { kind: SourceTargetKind.Feed, key: 'reddit' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RedditApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Reservoir_Rest]: { provider: SourceProvider.Reservoir, source: Source.Reservoir_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ReservoirApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Reth_JsonRpc]: { provider: SourceProvider.Reth, source: Source.Reth_JsonRpc, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore, SourceOperationGroup.EvmRpcTrace, SourceOperationGroup.EvmRpcTxpool], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Rss_Rest]: { provider: SourceProvider.Rss, source: Source.Rss_Rest, target: { kind: SourceTargetKind.Feed, key: 'configured-feed' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SyndicationXml, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Rss2Json_Rest]: { provider: SourceProvider.Rss2Json, source: Source.Rss2Json_Rest, target: { kind: SourceTargetKind.Feed, key: 'configured-feed' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.Rss2JsonApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.SigstoreRekor_Rest]: { provider: SourceProvider.SigstoreRekor, source: Source.SigstoreRekor_Rest, target: { kind: SourceTargetKind.Global, key: 'transparency-log' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SigstoreRekorApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Snapchain_Rest]: { provider: SourceProvider.Snapchain, source: Source.Snapchain_Rest, target: { kind: SourceTargetKind.Feed, key: 'farcaster' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SnapchainApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Solana_JsonRpc]: { provider: SourceProvider.Solana, source: Source.Solana_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'solana' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.SolanaMobileWalletAdapter_WalletApi]: { provider: SourceProvider.SolanaMobileWalletAdapter, source: Source.SolanaMobileWalletAdapter_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.SolanaSimds_Github]: { provider: SourceProvider.SolanaSimds, source: Source.SolanaSimds_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Sourcify_Rest]: { provider: SourceProvider.Sourcify, source: Source.Sourcify_Rest, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SourcifyApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Starknet_JsonRpc]: { provider: SourceProvider.Starknet, source: Source.Starknet_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'starknet' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.StarknetJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Starkscan_Rest]: { provider: SourceProvider.Starkscan, source: Source.Starkscan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'starknet' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StarknetExplorerRest, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.StellarExpert_Rest]: { provider: SourceProvider.StellarExpert, source: Source.StellarExpert_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'stellar' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StellarExpertApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.StellarHorizon_Rest]: { provider: SourceProvider.StellarHorizon, source: Source.StellarHorizon_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'stellar' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StellarHorizonApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.StellarRpc_JsonRpc]: { provider: SourceProvider.StellarRpc, source: Source.StellarRpc_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'stellar' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-rpc-endpoint' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.StellarToml_Rest]: { provider: SourceProvider.StellarToml, source: Source.StellarToml_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'stellar' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StellarToml, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.StoicWallet_WalletApi]: { provider: SourceProvider.StoicWallet, source: Source.StoicWallet_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Subscan_Rest]: { provider: SourceProvider.Subscan, source: Source.Subscan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'substrate' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SubscanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.SubstrateSidecar_Rest]: { provider: SourceProvider.SubstrateSidecar, source: Source.SubstrateSidecar_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'substrate' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SubstrateSidecarApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Sui_Graphql]: { provider: SourceProvider.Sui, source: Source.Sui_Graphql, target: { kind: SourceTargetKind.Caip2Network, key: 'sui' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.Sui_Grpc]: { provider: SourceProvider.Sui, source: Source.Sui_Grpc, target: { kind: SourceTargetKind.Caip2Network, key: 'sui' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Sui_JsonRpc]: { provider: SourceProvider.Sui, source: Source.Sui_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'sui' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Superchain_Github]: { provider: SourceProvider.Superchain, source: Source.Superchain_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Swarm_Rest]: { provider: SourceProvider.Swarm, source: Source.Swarm_Rest, target: { kind: SourceTargetKind.ContentAddressScheme, key: 'swarm' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-gateway' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.SwarmGateway, operationGroups: [SourceOperationGroup.ContentGatewayRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TezosDappetizer_Postgres]: { provider: SourceProvider.TezosDappetizer, source: Source.TezosDappetizer_Postgres, target: { kind: SourceTargetKind.SqlDataset, key: 'configured-dataset' }, endpoints: [{ endpointKind: SourceEndpointKind.PostgresDsn, locator: 'configured-postgres-dsn' }], wireProtocol: WireProtocol.Sql, apiFamily: ApiFamily.Postgres, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.RuntimeSecret }] },
	[SourceBinding.TezosNode_Rpc]: { provider: SourceProvider.TezosNode, source: Source.TezosNode_Rpc, target: { kind: SourceTargetKind.Caip2Network, key: 'tezos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-rpc-endpoint' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TezosNodeRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.OpenApiSpec, path: '$source-artifact', generated: false }] },
	[SourceBinding.TheGraph_Graphql]: { provider: SourceProvider.TheGraph, source: Source.TheGraph_Graphql, target: { kind: SourceTargetKind.Global, key: 'configured-subgraph' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.Graphql, apiFamily: ApiFamily.GraphqlHttp, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }], artifacts: [{ kind: SourceArtifactKind.GraphqlSchema, path: '$source-artifact', generated: false }, { kind: SourceArtifactKind.GraphqlTypes, path: '$source-artifact', generated: false }] },
	[SourceBinding.ThreeXpl_Rest]: { provider: SourceProvider.ThreeXpl, source: Source.ThreeXpl_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'configured-network' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ThreeXplApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonApi_Rest]: { provider: SourceProvider.TonApi, source: Source.TonApi_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TonApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonCenter_V2_Rest]: { provider: SourceProvider.TonCenter, source: Source.TonCenter_V2_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TonCenterV2Api, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonCenter_V3_Rest]: { provider: SourceProvider.TonCenter, source: Source.TonCenter_V3_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TonCenterV3Api, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonConnect_WalletApi]: { provider: SourceProvider.TonConnect, source: Source.TonConnect_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Tonlib_JsonRpc]: { provider: SourceProvider.Tonlib, source: Source.Tonlib_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonLiteServer_Adnl]: { provider: SourceProvider.TonLiteServer, source: Source.TonLiteServer_Adnl, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-lite-server' }], wireProtocol: WireProtocol.Adnl, apiFamily: ApiFamily.TonLiteServer, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TonVerifier_Rest]: { provider: SourceProvider.TonVerifier, source: Source.TonVerifier_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'ton' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TonVerifierApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TradingView_Rest]: { provider: SourceProvider.TradingView, source: Source.TradingView_Rest, target: { kind: SourceTargetKind.Global, key: 'market-data' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TradingViewApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TransmissionRpc_JsonRpc]: { provider: SourceProvider.Transmission, source: Source.TransmissionRpc_JsonRpc, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-transmission-client' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-transmission-rpc' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.BitTorrentClient, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.TronFullNode_Rest]: { provider: SourceProvider.TronFullNode, source: Source.TronFullNode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tron' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TronFullNodeApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TronGrid_Rest]: { provider: SourceProvider.TronGrid, source: Source.TronGrid_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tron' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TronGridApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TronLink_WalletApi]: { provider: SourceProvider.TronLink, source: Source.TronLink_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.TronScan_Rest]: { provider: SourceProvider.TronScan, source: Source.TronScan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tron' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TronScanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TronSolidityNode_Rest]: { provider: SourceProvider.TronSolidityNode, source: Source.TronSolidityNode_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tron' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TronSolidityNodeApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.TronTip1193_WalletApi]: { provider: SourceProvider.TronTip1193, source: Source.TronTip1193_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.TronTip6963_WalletApi]: { provider: SourceProvider.TronTip6963, source: Source.TronTip6963_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.TrustWalletAssets_Github]: { provider: SourceProvider.TrustWalletAssets, source: Source.TrustWalletAssets_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Tzkt_Rest]: { provider: SourceProvider.Tzkt, source: Source.Tzkt_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'tezos' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.TzktApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Voltaire_JsonRpc]: { provider: SourceProvider.Voltaire, source: Source.Voltaire_JsonRpc, target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.EvmExecutionJsonRpc, operationGroups: [SourceOperationGroup.EvmRpcCore, SourceOperationGroup.EvmRpcTrace, SourceOperationGroup.EvmRpcTxpool], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Voyager_Rest]: { provider: SourceProvider.Voyager, source: Source.Voyager_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'starknet' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.StarknetExplorerRest, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.WakuNode_Rest]: { provider: SourceProvider.WakuNode, source: Source.WakuNode_Rest, target: { kind: SourceTargetKind.LocalDevice, key: 'configured-waku-node' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-rest-api' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.WakuNodeRestApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.WalletConnect_SignClient]: { provider: SourceProvider.WalletConnect, source: Source.WalletConnect_SignClient, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.WalletStandard_WalletApi]: { provider: SourceProvider.WalletStandard, source: Source.WalletStandard_WalletApi, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.WebTorrent_Client]: { provider: SourceProvider.WebTorrent, source: Source.WebTorrent_Client, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.InProcess, locator: 'webtorrent-client' }], wireProtocol: WireProtocol.InProcess, apiFamily: ApiFamily.BitTorrentClient, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.WebTorrent_Dht]: { provider: SourceProvider.WebTorrent, source: Source.WebTorrent_Dht, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'configured-webtorrent-dht' }], wireProtocol: WireProtocol.Bencode, apiFamily: ApiFamily.BitTorrentDht, operationGroups: [SourceOperationGroup.BitTorrentDhtLookup], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.WebTorrent_Tracker]: { provider: SourceProvider.WebTorrent, source: Source.WebTorrent_Tracker, target: { kind: SourceTargetKind.TorrentSwarm, key: 'configured-infohash' }, endpoints: [{ endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'configured-webtorrent-tracker' }], wireProtocol: WireProtocol.WebSocketMessages, apiFamily: ApiFamily.BitTorrentTracker, operationGroups: [SourceOperationGroup.BitTorrentAnnounce], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Wormholescan_Rest]: { provider: SourceProvider.Wormholescan, source: Source.Wormholescan_Rest, target: { kind: SourceTargetKind.Global, key: 'bridge-message-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.WormholescanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.X_FxEmbed_Rest]: { provider: SourceProvider.FxEmbed, source: Source.X_FxEmbed_Rest, target: { kind: SourceTargetKind.Feed, key: 'x' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.FxEmbedApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.X_Rest]: { provider: SourceProvider.X, source: Source.X_Rest, target: { kind: SourceTargetKind.Feed, key: 'x' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.XApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Xaman_Api]: { provider: SourceProvider.Xaman, source: Source.Xaman_Api, target: { kind: SourceTargetKind.LocalDevice, key: 'user-session' }, endpoints: [{ endpointKind: SourceEndpointKind.BrowserWalletProvider, locator: 'injected-or-session-provider' }], wireProtocol: WireProtocol.WalletProvider, apiFamily: ApiFamily.WalletApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.UserDelegated }] },
	[SourceBinding.Xmtp_BrowserSdk]: { provider: SourceProvider.Xmtp, source: Source.Xmtp_BrowserSdk, target: { kind: SourceTargetKind.Feed, key: 'xmtp' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RestJson, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Xmtp_NodeSdk]: { provider: SourceProvider.Xmtp, source: Source.Xmtp_NodeSdk, target: { kind: SourceTargetKind.Feed, key: 'xmtp' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.RestJson, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Xrpl_Rippled]: { provider: SourceProvider.Xrpl, source: Source.Xrpl_Rippled, target: { kind: SourceTargetKind.Caip2Network, key: 'xrpl' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.XrplClio_JsonRpc]: { provider: SourceProvider.XrplClio, source: Source.XrplClio_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'xrpl' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }, { endpointKind: SourceEndpointKind.WebSocketUrl, locator: 'configured-websocket-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.XrpScan_Rest]: { provider: SourceProvider.XrpScan, source: Source.XrpScan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: 'xrpl' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.XrpScanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Youtube_Rest]: { provider: SourceProvider.Youtube, source: Source.Youtube_Rest, target: { kind: SourceTargetKind.Feed, key: 'youtube' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.YouTubeDataApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZcashClientBackend_Local]: { provider: SourceProvider.ZcashClientBackend, source: Source.ZcashClientBackend_Local, target: { kind: SourceTargetKind.LocalDevice, key: 'workspace' }, endpoints: [{ endpointKind: SourceEndpointKind.LocalFilePath, locator: 'configured-local-path' }], wireProtocol: WireProtocol.LocalFiles, apiFamily: ApiFamily.LocalState, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.Zcashd_JsonRpc]: { provider: SourceProvider.Zcashd, source: Source.Zcashd_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'zcash' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZcashdWallet_JsonRpc]: { provider: SourceProvider.Zcashd, source: Source.ZcashdWallet_JsonRpc, target: { kind: SourceTargetKind.LocalDevice, key: 'wallet-rpc' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-local-rpc' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.ZcashLightwalletd_Grpc]: { provider: SourceProvider.ZcashLightwalletd, source: Source.ZcashLightwalletd_Grpc, target: { kind: SourceTargetKind.Caip2Network, key: 'zcash' }, endpoints: [{ endpointKind: SourceEndpointKind.TcpAddress, locator: 'configured-grpc-endpoint' }], wireProtocol: WireProtocol.Grpc, apiFamily: ApiFamily.GrpcService, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.ServerOnly, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZcashZips_Github]: { provider: SourceProvider.ZcashZips, source: Source.ZcashZips_Github, target: { kind: SourceTargetKind.GitRepository, key: 'configured-repository' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'github-api-and-raw' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.GithubContentsApi, operationGroups: [SourceOperationGroup.GithubRepositoryContents], delivery: SourceDelivery.BrowserDirect, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.Zebra_JsonRpc]: { provider: SourceProvider.Zebra, source: Source.Zebra_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: 'bip122:00040fe8ec8471911baa1db1266ea15d' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'http://127.0.0.1:8232' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.BitcoinJsonRpc, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.LocalOnly, credentials: [{ scope: SourceCredentialScope.LocalSecret }] },
	[SourceBinding.ZeroExSwap_Rest]: { provider: SourceProvider.ZeroExSwap, source: Source.ZeroExSwap_Rest, target: { kind: SourceTargetKind.Global, key: 'swap-route-api' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ZeroExSwapApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZeroGChain_JsonRpc]: { provider: SourceProvider.ZeroG, source: Source.ZeroGChain_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: '0g' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZeroGChainScan_Rest]: { provider: SourceProvider.ZeroG, source: Source.ZeroGChainScan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: '0g' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ZeroGChainScanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZeroGStorageNode_JsonRpc]: { provider: SourceProvider.ZeroG, source: Source.ZeroGStorageNode_JsonRpc, target: { kind: SourceTargetKind.Caip2Network, key: '0g' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.JsonRpc2, apiFamily: ApiFamily.JsonRpcApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.ZeroGStorageScan_Rest]: { provider: SourceProvider.ZeroG, source: Source.ZeroGStorageScan_Rest, target: { kind: SourceTargetKind.Caip2Network, key: '0g' }, endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }], wireProtocol: WireProtocol.HttpRest, apiFamily: ApiFamily.ZeroGStorageScanApi, operationGroups: [SourceOperationGroup.GenericRead], delivery: SourceDelivery.HttpProxy, credentials: [{ scope: SourceCredentialScope.None }] },
	[SourceBinding.A2aService_Http]: {
		provider: SourceProvider.A2a,
		source: Source.A2aService_Http,
		target: { kind: SourceTargetKind.HttpOrigin, key: 'configured-agent-origin' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'agent-card-interface-url' }],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.A2a,
		operationGroups: [
			SourceOperationGroup.AgentTask,
			SourceOperationGroup.AgentMessage,
			SourceOperationGroup.AgentArtifact,
			SourceOperationGroup.AgentCapabilityCatalog,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.SourceDefined }],
	},

	[SourceBinding.A2aWellKnown_Http]: {
		provider: SourceProvider.A2a,
		source: Source.A2aWellKnown_Http,
		target: { kind: SourceTargetKind.HttpOrigin, key: 'configured-agent-origin' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: '/.well-known/agent-card.json' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.A2a,
		operationGroups: [
			SourceOperationGroup.AgentDiscovery,
			SourceOperationGroup.AgentCapabilityCatalog,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.AcpLocal_JsonRpc]: {
		provider: SourceProvider.Acp,
		source: Source.AcpLocal_JsonRpc,
		target: { kind: SourceTargetKind.LocalRuntime, key: 'configured-acp-agent' },
		endpoints: [{ endpointKind: SourceEndpointKind.LocalProcess, locator: 'configured-command' }],
		wireProtocol: WireProtocol.JsonRpc,
		apiFamily: ApiFamily.Acp,
		operationGroups: [
			SourceOperationGroup.AgentRuntime,
			SourceOperationGroup.AgentSession,
			SourceOperationGroup.LocalToolExecution,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [{ scope: SourceCredentialScope.LocalConfig }],
	},

	[SourceBinding.AcpRegistry_Rest]: {
		provider: SourceProvider.Acp,
		source: Source.AcpRegistry_Rest,
		target: { kind: SourceTargetKind.Global, key: 'acp-registry' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.Anthropic_Rest]: {
		provider: SourceProvider.Anthropic,
		source: Source.Anthropic_Rest,
		target: { kind: SourceTargetKind.Global, key: 'anthropic-api' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://api.anthropic.com' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.AwsBedrock_Rest]: {
		provider: SourceProvider.AwsBedrock,
		source: Source.AwsBedrock_Rest,
		target: { kind: SourceTargetKind.Global, key: 'aws-bedrock' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-bedrock-runtime-and-control-plane' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.AzureAiFoundry_Rest]: {
		provider: SourceProvider.AzureAiFoundry,
		source: Source.AzureAiFoundry_Rest,
		target: { kind: SourceTargetKind.Global, key: 'azure-ai-foundry' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-ai-foundry-endpoint' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.Cohere_Rest]: {
		provider: SourceProvider.Cohere,
		source: Source.Cohere_Rest,
		target: { kind: SourceTargetKind.Global, key: 'cohere-api' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://api.cohere.com' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.CroissantDocument_Local]: {
		provider: SourceProvider.MlCommons,
		source: Source.CroissantDocument_Local,
		target: { kind: SourceTargetKind.LocalFile, key: 'croissant-document' },
		endpoints: [{ endpointKind: SourceEndpointKind.LocalFile, locator: 'selected-file-or-artifact' }],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.AiDatasetMetadata,
			SourceOperationGroup.DocumentClaimExtraction,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.CycloneDxDocument_Local]: {
		provider: SourceProvider.CycloneDx,
		source: Source.CycloneDxDocument_Local,
		target: { kind: SourceTargetKind.LocalFile, key: 'cyclonedx-document' },
		endpoints: [{ endpointKind: SourceEndpointKind.LocalFile, locator: 'selected-file-or-artifact' }],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.DocumentClaimExtraction,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.GoogleAi_Rest]: {
		provider: SourceProvider.GoogleAi,
		source: Source.GoogleAi_Rest,
		target: { kind: SourceTargetKind.Global, key: 'google-ai-api' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://generativelanguage.googleapis.com' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.HuggingFaceHub_Rest]: {
		provider: SourceProvider.HuggingFace,
		source: Source.HuggingFaceHub_Rest,
		target: { kind: SourceTargetKind.Global, key: 'huggingface-hub' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://huggingface.co/api' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.RepositoryMetadata,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.OptionalApiKey }],
	},

	[SourceBinding.McpConfigured_Protocol]: {
		provider: SourceProvider.Mcp,
		source: Source.McpConfigured_Protocol,
		target: { kind: SourceTargetKind.LocalOrRemoteService, key: 'configured-mcp-server' },
		endpoints: [{ endpointKind: SourceEndpointKind.SourceDefined, locator: 'stdio|streamable-http|legacy-http-sse|custom' }],
		wireProtocol: WireProtocol.JsonRpc,
		apiFamily: ApiFamily.Mcp,
		operationGroups: [
			SourceOperationGroup.PromptCatalog,
			SourceOperationGroup.ResourceCatalog,
			SourceOperationGroup.ToolCall,
			SourceOperationGroup.ToolCatalog,
		],
		delivery: SourceDelivery.SourceDefined,
		credentials: [{ scope: SourceCredentialScope.SourceDefined }],
	},

	[SourceBinding.McpPackageRegistry_Rest]: {
		provider: SourceProvider.Mcp,
		source: Source.McpPackageRegistry_Rest,
		target: { kind: SourceTargetKind.Global, key: 'mcp-package-registry' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://registry.modelcontextprotocol.io/v0.1/servers' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.OptionalApiKey }],
	},

	[SourceBinding.MistralAi_Rest]: {
		provider: SourceProvider.MistralAi,
		source: Source.MistralAi_Rest,
		target: { kind: SourceTargetKind.Global, key: 'mistral-api' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://api.mistral.ai' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.Mlflow_Rest]: {
		provider: SourceProvider.Mlflow,
		source: Source.Mlflow_Rest,
		target: { kind: SourceTargetKind.Global, key: 'configured-mlflow-tracking-server' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-tracking-server' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.DocumentClaimExtraction,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.OptionalApiKey }],
	},

	[SourceBinding.OciRegistry_Distribution]: {
		provider: SourceProvider.OciRegistry,
		source: Source.OciRegistry_Distribution,
		target: { kind: SourceTargetKind.Global, key: 'configured-oci-registry' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-registry' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OciDistribution,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.OptionalApiKey }],
	},

	[SourceBinding.OnnxArtifact_Local]: {
		provider: SourceProvider.Onnx,
		source: Source.OnnxArtifact_Local,
		target: { kind: SourceTargetKind.LocalFile, key: 'onnx-artifact' },
		endpoints: [{ endpointKind: SourceEndpointKind.LocalFile, locator: 'selected-file-or-artifact' }],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.DocumentClaimExtraction,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.OpenAI_Rest]: {
		provider: SourceProvider.OpenAI,
		source: Source.OpenAI_Rest,
		target: { kind: SourceTargetKind.Global, key: 'openai-api' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'https://api.openai.com' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.ApiKey }],
	},

	[SourceBinding.SpdxDocument_Local]: {
		provider: SourceProvider.Spdx,
		source: Source.SpdxDocument_Local,
		target: { kind: SourceTargetKind.LocalFile, key: 'spdx-document' },
		endpoints: [{ endpointKind: SourceEndpointKind.LocalFile, locator: 'selected-file-or-artifact' }],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.DocumentClaimExtraction,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.Eip8004Scan_Rest]: {
		provider: SourceProvider.Eip8004Scan,
		source: Source.Eip8004Scan_Rest,
		target: { kind: SourceTargetKind.Eip155Chain, key: 'configured-chain' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-indexer-api' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AgentRegistryRead,
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.None }],
	},

	[SourceBinding.X402_Http]: {
		provider: SourceProvider.X402,
		source: Source.X402_Http,
		target: { kind: SourceTargetKind.HttpOrigin, key: 'configured-paid-endpoint' },
		endpoints: [{ endpointKind: SourceEndpointKind.HttpUrl, locator: 'configured-url' }],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [SourceOperationGroup.PaymentRequirementProbe],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{ scope: SourceCredentialScope.OptionalWallet }],
	},
} as const satisfies Record<SourceBinding, SourceBindingDefinition>
```

## Wallet Connection Source Rows

The rows below are the canonical wallet-source modeling notes for wallet and wallet-connection schema work. They intentionally do not define a second enum namespace; promote names into the top-level `SourceBinding` enum and source-definition map above only when the binding is executable, constants-backed, or otherwise part of the product source catalog.

## Source Rows

Source status labels:

- `Implemented connection`: current runtime can create connected `BlockheadWalletConnection` and `BlockheadWalletAccount` rows.
- `Implemented discovery`: current runtime can create `BlockheadWallet` candidates, but another source row describes the account API.
- `Runtime discovery-only`: current runtime can discover `BlockheadWallet` candidates, but `connect()` returns a disconnected/error placeholder.
- `Constants-backed target`: represented in `src/constants/Wallet.ts`, but no runtime adapter currently mounts it.
- `Research target`: documented source candidate with external protocol/source grounding, but not yet constants-backed or runtime-backed.

Only entries listed below as `Source ...` rows are modeled wallet sources. Enum bindings without a `Source ...` row are evidence handles or backlog candidates only; they must not be referenced from schema rows, resolver rows, runtime adapters, or constants-backed wallet methods until promoted into this section with status, evidence, API surface, produced rows, and persistence semantics.

`Produces ::` describes the source's modeled output surface. For `Implemented discovery` and `Runtime discovery-only` rows, current runtime output is only `BlockheadWallet`; connection, account, request, session, grant, or authentication rows must be explicitly marked target-only in the same row until a mounted adapter writes them. `BlockheadWalletRequest`, `BlockheadWalletTransportSession`, `BlockheadWalletCapabilityGrant`, and `BlockheadWalletAuthentication` describe target rows unless the source status says an implemented runtime currently writes them. Current implemented wallet adapters write only wallet candidates, connections, accounts, and connection account counts.

Capability language in source rows describes the source/protocol surface unless a row explicitly says current runtime. Do not infer runtime `connect`, `sign`, `send`, `switch`, or `watch` support from a `WalletConnectionMethod.capabilities` list when status is `Implemented discovery`, `Runtime discovery-only`, `Constants-backed target`, or `Research target`. Current `BlockheadWallet.capabilities` rows written by discovery-only adapters must contain only `discover`.

Constants-backed method rows map to source rows as follows:

```text
  eip6963 -> Eip6963_BrowserEvent, Eip1193_InjectedProvider
  eip1193-legacy -> Eip1193_InjectedProvider
  tron-tip1193 -> TronTip1193_WalletApi
  wallet-standard -> WalletStandard_BrowserRegistry
  aptos-aip62 -> AptosAip62_WalletApi
  aptos-injected-globals -> AptosInjected_WalletApi
  cardano-cip30 -> CardanoCip30_WalletApi
  cosmos-offline-signer -> CosmosOfflineSigner_WalletApi
  polkadot-injected-web3 -> PolkadotInjectedWeb3_WalletApi
  walletconnect-v2 -> WalletConnect_SignClient
  ton-connect -> TonConnect_Bridge
  near-wallet-selector -> NearWalletSelector_Sdk
  icrc-signer -> IcrcSigner_PostMessage
  starknet-wallet-api -> StarknetWalletApi_WalletApi
  sats-connect -> BitcoinSatsConnect_WalletApi
  bitcoin-injected-globals -> BitcoinInjected_WalletApi
  trezor-connect -> TrezorConnect_Bridge
  direct-hardware-transport -> LedgerJs_WebHid
```

```text
  Source WalletConnect_SignClient
    Status :: Constants-backed target
    Source evidence :: WalletConnect Wallet SDK docs describe WalletKit session proposals, namespace approval, active sessions, session topics, and session request handling with `respondSessionRequest`: https://docs.walletconnect.network/wallet-sdk/web/usage
    Provider :: WalletConnect
    Kind :: wallet-transport
    Transport :: relay
    API surface :: Sign Client JSON-RPC session API
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: topic
    Connect means :: dapp proposes required/optional namespaces; wallet approves a session containing namespaces, methods, events, and accounts
    Account shape :: CAIP-10 strings in session namespaces
    Scope shape :: CAIP namespace + chains + methods + events
    Runtime handles :: SignClient instance, proposal promise, relay subscription
    Persistence :: topic/session metadata only
    Notes :: Best broad remote/mobile/hardware bridge. Use Sign Client directly for protocol control; QR/modal is presentation only.

  Source Eip6963_BrowserEvent
    Status :: Implemented discovery
    Source evidence :: EIP-6963 defines multi injected provider discovery through browser window events carrying provider info and an EIP-1193 provider: https://eips.ethereum.org/EIPS/eip-6963
    Provider :: Browser wallet extensions
    Kind :: wallet-discovery
    Transport :: injected event
    API surface :: browser CustomEvent carrying EIP-1193 provider metadata
    Produces :: current BlockheadWallet
    Session identity :: none
    Connect means :: not a connection; it only announces an EIP-1193 provider candidate
    Account shape :: none until EIP-1193 request
    Scope shape :: none until EIP-1193 request
    Runtime handles :: provider object
    Persistence :: discovered wallet metadata only if desired
    Notes :: Discovery only. Pair with Eip1193_InjectedProvider for actual account access.

  Source Eip1193_InjectedProvider
    Status :: Constants-backed target
    Source evidence :: EIP-1193 defines the Ethereum Provider JavaScript API, including `request`, provider events, and connectivity semantics: https://eips.ethereum.org/EIPS/eip-1193
    Provider :: EVM browser wallets
    Kind :: wallet-api
    Transport :: injected provider
    API surface :: `provider.request({ method, params })`, `accountsChanged`, `chainChanged`, `connect`, `disconnect`
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: wallet id or provider id; no standard durable topic
    Connect means :: `eth_requestAccounts` or `wallet_requestPermissions` grants account access
    Account shape :: EVM address on active chain, normalized to `eip155:<chainId>:<address>`
    Scope shape :: active chain and EVM JSON-RPC methods/events inferred from provider and permissions
    Runtime handles :: provider object
    Persistence :: serializable wallet id, exposed accounts, selected state, timestamps
    Notes :: Highest EVM browser baseline. Current runtime reaches legacy `window.ethereum` through the EIP-6963 adapter fallback and emits EIP-6963-normalized connection rows. Legacy `send`/`sendAsync` can be adapter fallback, not schema.

  Source WalletStandard_BrowserRegistry
    Status :: Runtime discovery-only
    Source evidence :: The Wallet Standard repository describes interfaces and conventions for wallets and apps for any blockchain, including Wallet/WalletAccount interfaces, global window events, wallet registration, `getWallets`, and chain-specific extensions: https://github.com/wallet-standard/wallet-standard
    Provider :: Wallet Standard wallets
    Kind :: wallet-discovery-and-api
    Transport :: injected event/registry
    API surface :: `getWallets()`, `standard:connect`, chain feature methods
    Produces :: current BlockheadWallet; target BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: wallet name/id plus account set; usually no durable topic
    Connect means :: `standard:connect` returns accounts and authorizes feature calls
    Account shape :: wallet-standard account objects, normalized by adapter to CAIP-like account rows
    Scope shape :: features and chains advertised by wallet/account
    Runtime handles :: wallet object and feature methods
    Persistence :: wallet id, account ids, feature/capability snapshot
    Notes :: Strong for Solana and Sui today. Keep Bitcoin-specific role-address behavior under explicit Bitcoin sources until a primary Bitcoin Wallet Standard spec/source is attached.

  Source AptosAip62_WalletApi
    Status :: Constants-backed target
    Source evidence :: Aptos wallet adapter docs describe dapp wallet connection, `connect(walletName)`, `disconnect()`, account state, signing/submitting transactions, message signing, and wallet grouping for Aptos Connect, available, installable, and not-detected wallets: https://aptos.dev/build/sdks/wallet-adapter/dapp
    Provider :: Aptos wallets
    Kind :: wallet-discovery-and-api
    Transport :: Aptos wallet adapter / AIP-62-compatible wallet surface
    API surface :: Aptos wallet adapter methods such as `connect`, `disconnect`, account state, message signing, transaction signing, and transaction submission
    Produces :: target BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: wallet id plus account
    Connect means :: `connect(walletName)` authorizes a selected wallet and exposes an Aptos account
    Account shape :: Aptos account address/public key, normalized to Aptos namespace rows
    Scope shape :: Aptos network plus available feature methods
    Runtime handles :: Aptos wallet adapter wallet object
    Persistence :: serializable account/scope snapshot
    Notes :: Source-grounded target. The current runtime does not use the Aptos wallet adapter/AIP-62 connection surface.

  Source AptosInjected_WalletApi
    Status :: Runtime discovery-only
    Source evidence :: Current runtime adapter observes legacy Aptos wallet globals. Treat this as adapter-grounded discovery, not a universal Aptos connection protocol.
    Provider :: Aptos browser wallets
    Kind :: wallet-discovery
    Transport :: injected globals
    API surface :: legacy wallet-specific globals such as `window.aptos`, `window.martian`, and `window.pontem`
    Produces :: current BlockheadWallet
    Session identity :: none
    Connect means :: not implemented; current runtime only discovers candidate globals
    Account shape :: none until a wallet-specific connect adapter is implemented
    Scope shape :: none until a wallet-specific connect adapter is implemented
    Runtime handles :: wallet-specific global object
    Persistence :: discovered wallet metadata only
    Notes :: Do not label legacy Aptos globals as AIP-62. Each global needs source-specific API mapping before it can produce connections or account rows.

  Source CardanoCip30_WalletApi
    Status :: Implemented connection
    Source evidence :: CIP-30 defines the Cardano dApp-wallet web bridge with `cardano.{walletName}.enable()`, used/unused/change/reward address APIs, `signTx`, `signData`, and `submitTx`: https://cips.cardano.org/cip/CIP-30
    Provider :: Cardano browser wallets
    Kind :: wallet-api
    Transport :: namespaced injected global
    API surface :: `window.cardano.<wallet>.enable()` returns wallet API with address/signing methods
    Produces :: current BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount; target BlockheadWalletRequest
    Session identity :: wallet global key
    Connect means :: `enable()` grants API access for address, UTXO, balance, signing, and submit APIs
    Account shape :: role address set, not a single account; CIP-30 distinguishes used, unused, change, and reward addresses
    Scope shape :: Cardano network id plus CIP-30 methods
    Runtime handles :: CIP-30 wallet API object
    Persistence :: current runtime writes wallet id, used/unused address rows, network id, and methods; change/reward addresses and address roles are target fields until local account selectors support them
    Notes :: UTXO/address semantics differ from EVM. Do not infer wallet balance from public address list alone. Current implementation does not persist CIP-30 UTXOs, balance, collateral, change address, reward addresses, or request rows.

  Source PolkadotInjectedWeb3_WalletApi
    Status :: Implemented connection
    Source evidence :: Polkadot extension docs describe `@polkadot/extension-dapp` as an extractor over `window.injectedWeb3`, with `web3Enable`, `web3Accounts`, account `meta.source`, `web3AccountsSubscribe`, and `web3FromAddress` / `web3FromSource` for signer access: https://polkadot.js.org/docs/extension/ and https://polkadot.js.org/docs/extension/usage/
    Provider :: Substrate extensions
    Kind :: wallet-api
    Transport :: namespaced injected global
    API surface :: `window.injectedWeb3[name].enable(app)` exposes accounts and signer
    Produces :: current BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount; target BlockheadWalletRequest
    Session identity :: extension key/source
    Connect means :: extension authorizes app and returns accounts/signer
    Account shape :: Substrate address/account id plus extension source; chain/genesis-specific CAIP reference requires chain context not supplied by the current runtime
    Scope shape :: current runtime uses generic Polkadot scope reference `0`; chain/genesis-specific scopes are target-only until a chain context is passed into the adapter
    Runtime handles :: injected extension/signer object
    Persistence :: current runtime writes extension key, exposed addresses, generic reference `0`, and methods; account names and source metadata are not yet persisted
    Notes :: `@polkadot/extension-dapp` is the documented wrapper over `window.injectedWeb3`. Current implementation uses raw injectedWeb3 and should not be treated as resolving chain-specific Substrate account identity.

  Source CosmosOfflineSigner_WalletApi
    Status :: Runtime discovery-only
    Source evidence :: Keplr docs describe chain-scoped wallet access with `getKey(chainId)` returning account/public key data and signing methods such as `signAmino(chainId, signer, ...)` and `signDirect(chainId, signer, ...)` requiring a chain id: https://docs.keplr.app/api/guide/get-key and https://docs.keplr.app/api/guide/sign-a-message
    Provider :: Keplr/Leap/Cosmos wallets
    Kind :: wallet-api
    Transport :: injected global
    API surface :: `enable(chainId)`, `getKey(chainId)`, `getOfflineSigner(chainId)`, `signAmino`, `signDirect`, account/signer methods
    Produces :: current BlockheadWallet; target BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: wallet key + chain id
    Connect means :: target behavior is enabling a concrete chain id and exposing key/account plus signer methods; current runtime only discovers globals
    Account shape :: bech32 address scoped by Cosmos chain id
    Scope shape :: Cosmos chain id plus account/key/signing methods
    Runtime handles :: OfflineSigner object
    Persistence :: target connection rows need wallet id, chain id, exposed account/key rows, and capabilities; current runtime writes no connection/account rows
    Notes :: Strong convention, not a universal formal browser discovery standard. Leap often mirrors Keplr. Do not create account rows without a concrete chain id and returned key/account evidence.

  Source TronTip1193_WalletApi
    Status :: Runtime discovery-only
    Source evidence :: Current runtime adapter observes TRON injected globals. Treat this as adapter-grounded discovery until a primary TIP/provider document is attached.
    Provider :: TronLink/TRON wallets
    Kind :: wallet-api
    Transport :: injected provider
    API surface :: `window.tron.request({ method: 'eth_requestAccounts' })`, TIP-6963 events, legacy `tronLink.request`
    Produces :: current BlockheadWallet; target BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: injected wallet id
    Connect means :: account request grants Tron address exposure
    Account shape :: Tron address, normalized to Tron namespace
    Scope shape :: TRON chain scope and signing/send methods
    Runtime handles :: injected provider/tronWeb object
    Persistence :: account/scope snapshot
    Notes :: Close to EIP-1193/EIP-6963 conceptually but not identical.

  Source StarknetWalletApi_WalletApi
    Status :: Runtime discovery-only
    Source evidence :: The `starknet-io/get-starknet` repository describes a Starknet wallet-dApp bridge with built-in connection UI, `getAvailableWallets`, `getPreAuthorizedWallets`, `getDiscoveryWallets`, `getLastConnectedWallet`, `enable`, and `disconnect`: https://github.com/starknet-io/get-starknet
    Provider :: Starknet wallets
    Kind :: wallet-discovery-and-api
    Transport :: injected window object / wallet-dApp bridge
    API surface :: get-starknet discovery helpers and Starknet wallet object enable/disconnect flow
    Produces :: current BlockheadWallet; target BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: selected Starknet wallet object plus connected account when enabled
    Connect means :: `enable(wallet)` connects a selected Starknet window object and exposes a connected wallet object
    Account shape :: Starknet account address scoped by Starknet chain
    Scope shape :: Starknet chain and wallet object methods
    Runtime handles :: Starknet window object or get-starknet connected wallet object
    Persistence :: discovered wallet id and, when implemented, connected account/scope snapshot
    Notes :: Current runtime only discovers `window.starknet`, `window.starknet_argentX`, and `window.starknet_braavos`; it does not call `enable`.

  Source TonConnect_Bridge
    Status :: Constants-backed target
    Source evidence :: TON Connect SDK docs define manifest metadata, wallet lists with universal/deep links and bridge URLs, remote/injected connection sources, `sendTransaction`, `signData`, status-change subscriptions, and connection restoration: https://ton-connect.github.io/sdk/modules/_tonconnect_sdk.html
    Provider :: TON Connect wallets
    Kind :: wallet-transport
    Transport :: HTTP bridge with universal-link/deep-link and injected connection variants
    API surface :: TON Connect protocol/SDK with manifest URL, bridge URL, universal link, transaction request messages
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: TON Connect session
    Connect means :: wallet approves dapp manifest/session and exposes account
    Account shape :: TON address plus wallet state/init metadata when available
    Scope shape :: TON network and transaction/message methods
    Runtime handles :: TonConnect connector
    Persistence :: manifest URL, bridge URL, session metadata, account
    Notes :: Requires public HTTPS manifest. The constants row uses `http-bridge` as the primary transport; universal links, deep links, and injected sources are adapter-level connection variants, not wallet identity.

  Source TezosBeacon_Sdk
    Status :: Research target
    Source evidence :: Beacon docs describe Beacon as the TZIP-10 wallet/dApp interaction implementation, using `beacon-sdk` to build peer-to-peer channels, send dApp requests to wallets, and track connections/accounts: https://docs.walletbeacon.io/
    Provider :: Tezos Beacon wallets
    Kind :: wallet-transport
    Transport :: extension/postMessage/P2P/deep-link
    API surface :: Beacon `DAppClient.requestPermissions`, operation/signature requests, peer messaging
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: peer/account permission
    Connect means :: permission request creates account/network authorization
    Account shape :: Tezos address/public key scoped by network
    Scope shape :: network type and Beacon permissions
    Runtime handles :: DAppClient/transport
    Persistence :: peer/session/account metadata
    Notes :: Beacon is a true protocol layer, not only a wallet-specific API.

  Source IcrcSigner_PostMessage
    Status :: Constants-backed target
    Source evidence :: DFINITY's ICRC repository is the proposal repository, and ICRC-49 is an open draft issue for a call-canister extension to ICRC-25. Treat this as draft source grounding, not a finalized wallet standard: https://github.com/dfinity/ICRC and https://github.com/dfinity/ICRC/issues/49
    Provider :: Internet Computer signers
    Kind :: wallet-transport
    Transport :: popup/postMessage/injected discovery
    API surface :: draft ICRC signer/call-canister proposal surface for supported standards, permissions, accounts, signing, and delegation
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest, BlockheadWalletCapabilityGrant
    Session identity :: signer/session id when supplied
    Connect means :: signer grants origin/app access to principals/accounts and methods
    Account shape :: principal and optional subaccount
    Scope shape :: ICRC standards/methods/canisters
    Runtime handles :: popup/window port/message channel
    Persistence :: signer id, principal/subaccount rows, permissions
    Notes :: Model as remote signer transport only while explicitly marked modeled/draft. Principal/subaccount semantics are not CAIP-10-clean in all cases.

  Source NearWalletSelector_Sdk
    Status :: Constants-backed target
    Source evidence :: NEAR Wallet Selector docs describe a JS/TS wallet selector abstraction, wallet modules, sign-in/sign-out, signed accounts, account querying, NEP-413 message signing, and sign-and-send transaction methods: https://docs.near.org/tools/wallet-selector
    Provider :: NEAR Wallet Selector
    Kind :: wallet-sdk
    Transport :: wallet module abstraction over extension/redirect/popup/injected/ledger/mobile transports
    API surface :: selector setup, wallet module selection, `signIn`/`signOut`, `getAccounts`, NEP-413 signing, sign-and-send transaction methods
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: selected wallet id plus signed account session when supplied by module
    Connect means :: selected wallet module signs in and exposes signed account ids plus transaction/signing methods
    Account shape :: NEAR account id/public key
    Scope shape :: network, contract ids, methods, transaction capabilities
    Runtime handles :: wallet selector instance and selected wallet module
    Persistence :: selected wallet id, signed account ids, network, and module/session metadata when serializable
    Notes :: The selector is the sourceable abstraction. Individual wallet modules determine the concrete transport, so do not model this as iframe-only.

  Source BitcoinSatsConnect_WalletApi
    Status :: Constants-backed target
    Source evidence :: The Sats Connect repository describes a JavaScript library for connecting apps to Bitcoin, Spark, Starknet, Stacks, and Bitcoin L2 wallets, with `request('getAccounts')`, address purposes, message signatures, PSBT signing, transfers, and wallet-disconnect flows: https://github.com/secretkeylabs/sats-connect
    Provider :: Sats Connect wallets
    Kind :: wallet-api
    Transport :: injected/deep-link/provider bridge through Sats Connect request API
    API surface :: `request('getAccounts')`, message signing, PSBT signing, transfer/send methods, disconnect
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: wallet id plus account/address set
    Connect means :: `getAccounts` exposes requested address purposes after wallet approval
    Account shape :: role address set: payment, ordinals, Stacks, and other supported purposes
    Scope shape :: requested address purposes, networks, chains, and request methods
    Runtime handles :: Sats Connect provider/adapter
    Persistence :: exposed addresses and purposes
    Notes :: Source-grounded target. The current runtime does not discover Sats Connect separately and does not call Sats Connect request methods. Current Bitcoin browser discovery is represented by `BitcoinInjected_WalletApi`.

  Source BitcoinInjected_WalletApi
    Status :: Runtime discovery-only
    Source evidence :: Current runtime adapter observes wallet-specific Bitcoin globals. Treat this as adapter-grounded discovery, not a shared Bitcoin wallet standard.
    Provider :: Bitcoin browser wallets
    Kind :: wallet-discovery
    Transport :: injected globals
    API surface :: wallet-specific globals such as `LeatherProvider`, `XverseProviders`, `unisat`, and `magicEden.bitcoin`
    Produces :: current BlockheadWallet
    Session identity :: none
    Connect means :: not implemented; current runtime only discovers candidate globals
    Account shape :: none until a wallet-specific connect adapter is implemented
    Scope shape :: none until a wallet-specific connect adapter is implemented
    Runtime handles :: wallet-specific global object
    Persistence :: discovered wallet metadata only
    Notes :: Do not label every Bitcoin global as Sats Connect. Each wallet/global needs source-specific API mapping before it can produce connections or account rows.

  Source StellarWalletConnect_WalletApi
    Status :: Research target
    Source evidence :: Stellar SEP-0043 defines a standard web wallet API with `getAddress` and `signTransaction` for wallet/dapp interactions: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md
    Provider :: Stellar wallets
    Kind :: wallet-transport
    Transport :: WalletConnect relay or extension API
    API surface :: Stellar WalletConnect methods such as signing XDR/message plus Freighter extension API
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: WalletConnect topic or extension wallet id
    Connect means :: wallet approves Stellar account and signing methods
    Account shape :: Stellar public key scoped by pubnet/testnet
    Scope shape :: `stellar:*` namespace methods/events
    Runtime handles :: WalletConnect client or extension API
    Persistence :: topic/account/scope
    Notes :: Freighter extension and WalletConnect mobile paths are distinct transports normalized to the same entities.

  Source HederaWalletConnect_WalletApi
    Status :: Research target
    Source evidence :: HIP-820 specifies WalletConnect 2.0 methods for Hedera, including `hedera_signTransaction`, `hedera_signAndExecuteTransaction`, `hedera_executeTransaction`, query execution, message signing, and Hedera CAIP identifiers: https://hips.hedera.com/hip/hip-820
    Provider :: Hedera wallets
    Kind :: wallet-transport
    Transport :: WalletConnect relay
    API surface :: HIP-820-style WalletConnect namespace/methods
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: WalletConnect topic
    Connect means :: wallet approves Hedera account and transaction/signing methods
    Account shape :: Hedera account id or EVM alias depending namespace
    Scope shape :: Hedera namespace or EVM `eip155` namespace for EVM-compatible flows
    Runtime handles :: WalletConnect client
    Persistence :: topic/account/scope
    Notes :: HashConnect is legacy/sunset direction; model WalletConnect as preferred transport.

  Source AlgorandWalletConnect_WalletApi
    Status :: Research target
    Source evidence :: ARC-25 specifies Algorand WalletConnect v1 session creation and JSON-RPC request/response handling, with `algo_signTxn` as the transaction signing method: https://dev.algorand.co/arc-standards/arc-0025/
    Provider :: Algorand wallets
    Kind :: wallet-transport
    Transport :: WalletConnect relay or wallet SDK bridge
    API surface :: ARC-25/WalletConnect signing methods, Pera/Defly connectors
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: WalletConnect topic or connector session
    Connect means :: wallet approves Algorand account and signing requests
    Account shape :: Algorand address scoped by network
    Scope shape :: Algorand network and signing methods
    Runtime handles :: connector/client object
    Persistence :: session/account/scope
    Notes :: Practical integrations often use wallet SDKs over WalletConnect; keep schema protocol-neutral.

  Source FlowFcl_Discovery
    Status :: Research target
    Source evidence :: Flow FCL docs describe FCL as a standardized dapp/wallet client with authentication, wallet discovery, authorization, transaction mutation, front-channel wallet communication, and back-channel HTTP: https://developers.flow.com/build/tools/clients/fcl-js
    Provider :: Flow wallets
    Kind :: wallet-transport
    Transport :: discovery service + iframe/popup/extension/http post
    API surface :: FCL authentication and authorization service strategies
    Produces :: BlockheadWallet, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: FCL current user/session
    Connect means :: FCL authenticate selects wallet service and returns user authorization
    Account shape :: Flow account address
    Scope shape :: Flow network and service roles
    Runtime handles :: FCL service/session objects
    Persistence :: user/account/service metadata
    Notes :: FCL is the practical protocol client for Flow; discovery service is part of the connection source.

  Source Xaman_XrplSdk
    Status :: Research target
    Source evidence :: Xaman SDK docs expose `Xumm.authorize()` for browser sign-in flow and SDK sections for payload sign requests, OAuth/OpenID, push, and user/runtime APIs: https://docs.xaman.dev/js-ts-sdk/sdk-syntax/xumm.authorize
    Provider :: Xaman/XRPL wallets
    Kind :: wallet-auth-and-request
    Transport :: OAuth/JWT/push/deep-link
    API surface :: Xaman SDK authorize and payload signing flow
    Produces :: BlockheadWalletAuthentication, BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest
    Session identity :: JWT/user token or payload id
    Connect means :: user authorizes app/account through Xaman flow; signing happens through payload requests
    Account shape :: XRPL classic address
    Scope shape :: app authorization and payload permissions
    Runtime handles :: SDK/client/token
    Persistence :: auth/account/payload metadata, not raw tokens unless explicitly local-only
    Notes :: This is not a generic injected provider. Authentication and request payloads should stay distinct.

  Source BitcoinCoreWallet_JsonRpc
    Status :: Research target
    Source evidence :: Bitcoin Core RPC reference includes wallet RPC methods such as `getwalletinfo`, `listunspent`, `sendtoaddress`, `signmessage`, and related address/transaction wallet operations: https://developer.bitcoin.org/reference/rpc/
    Provider :: Bitcoin Core wallet
    Kind :: local-wallet-rpc
    Transport :: local JSON-RPC
    API surface :: wallet RPC commands for descriptors, addresses, UTXOs, PSBTs, balances, transactions
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletRequest, explicit Bitcoin local/private wallet rows when modeled
    Session identity :: local RPC profile/wallet name
    Connect means :: Blockhead has configured local RPC access to a wallet
    Account shape :: descriptors/accounts/addresses, not generic browser account
    Scope shape :: local RPC command access
    Runtime handles :: RPC client/auth
    Persistence :: profile id, wallet name, redacted endpoint metadata
    Notes :: Local/private wallet source. Public Bitcoin Core node data alone is not wallet state.

  Source MoneroWalletRpc_JsonRpc
    Status :: Research target
    Source evidence :: Monero wallet RPC docs define a dedicated wallet RPC surface for wallet accounts, subaddresses, transfers, outputs, payments, signing, and wallet state: https://docs.getmonero.org/rpc-library/wallet-rpc/
    Provider :: monero-wallet-rpc
    Kind :: local-wallet-rpc
    Transport :: local JSON-RPC
    API surface :: wallet RPC methods for accounts, subaddresses, transfers, outputs, key images, balances
    Produces :: explicit Monero local/private wallet rows when modeled, BlockheadWalletRequest
    Session identity :: local RPC profile/wallet file
    Connect means :: Blockhead can query a local wallet RPC process
    Account shape :: Monero account/subaddress indexes and addresses
    Scope shape :: local wallet RPC command access
    Runtime handles :: RPC client/auth
    Persistence :: redacted local profile/wallet id
    Notes :: Correctly local/private: public daemon data cannot reveal owned outputs, balances, or transfer interpretation.

  Source ZcashdWallet_JsonRpc
    Status :: Research target
    Source evidence :: Zcash RPC docs include wallet methods for transparent and shielded/unified wallet state, including `z_exportviewingkey`, `z_getbalance`, `z_getbalanceforviewingkey`, `z_listaccounts`, `z_listunspent`, `z_sendmany`, and operation status/result APIs: https://zcash.github.io/rpc/
    Provider :: zcashd wallet
    Kind :: local-wallet-rpc
    Transport :: local JSON-RPC
    API surface :: wallet RPC methods for addresses, balances, notes, transactions, viewing/spending keys
    Produces :: explicit Zcash local/private wallet rows when modeled, BlockheadWalletRequest
    Session identity :: local RPC profile/wallet
    Connect means :: Blockhead has local wallet RPC access or imported viewing/spending key context
    Account shape :: transparent/shielded/unified addresses and key fingerprints
    Scope shape :: local wallet RPC/key-scan access
    Runtime handles :: RPC client/auth
    Persistence :: key fingerprints and redacted local profile; raw key material local-only
    Notes :: Public Zcash chain rows expose commitments/nullifiers, not wallet-owned notes or balances.

  Source CashuWallet_Local
    Status :: Research target
    Source evidence :: Cashu docs describe ecash as a bearer token stored on the user's device and identify NUTs as the protocol specifications for wallet/mint implementations: https://docs.cashu.space/
    Provider :: Blockhead local Cashu wallet store
    Kind :: local-wallet-store
    Transport :: local persistence + mint REST calls
    API surface :: local proof/token/quote store, Cashu mint REST for quote/checkstate/melt/mint
    Produces :: explicit Cashu local/private proof, token, and quote rows when modeled
    Session identity :: local wallet id + mint + unit
    Connect means :: Blockhead has local bearer proof/token material for a mint
    Account shape :: no public account; wallet state is bearer proof inventory
    Scope shape :: local mint/unit/proof set
    Runtime handles :: local store and mint client
    Persistence :: proof metadata and optionally raw proof material under local trusted policy
    Notes :: Cashu proofs are bearer money. This is not a normal account-exposure wallet connection.

  Source LedgerJs_WebHid
    Status :: Constants-backed target
    Source evidence :: Ledger's `hw-transport-webhid` package documents WebHID communication with Ledger hardware wallets, user-gesture/HTTPS constraints, `TransportWebHID.create()`, `exchange(apdu)`, device listing/listening, and explicit device permission requests: https://github.com/LedgerHQ/ledger-live/tree/develop/libs/ledgerjs/packages/hw-transport-webhid
    Provider :: Ledger device
    Kind :: direct-hardware
    Transport :: WebHID
    API surface :: APDU/app-specific LedgerJS calls
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: device pairing/profile id
    Connect means :: user grants browser device access and opens/signs through a Ledger app
    Account shape :: derivation path + public key/address
    Scope shape :: device app + chain + derivation path + methods
    Runtime handles :: WebHID device/transport
    Persistence :: redacted pairing/profile, derivation metadata, not device handle
    Notes :: Desktop Chromium-limited and chain-specific. This grounds the current `direct-hardware-transport` constants row only for Ledger WebHID. Other hardware products, WebUSB paths, and chain apps need separate source rows or narrower constants rows before they become modeled support.

  Source TrezorConnect_Bridge
    Status :: Constants-backed target
    Source evidence :: Trezor Connect exposes a public Connect Explorer/API surface for browser-mediated device methods and bridge/device interaction: https://connect.trezor.io/9/
    Provider :: Trezor Connect
    Kind :: direct-hardware
    Transport :: browser bridge/WebUSB/local bridge
    API surface :: Trezor Connect method calls per chain
    Produces :: BlockheadWalletConnection, BlockheadWalletAccount, BlockheadWalletTransportSession, BlockheadWalletRequest
    Session identity :: device/session profile where available
    Connect means :: Trezor bridge/session approves address export or signing request
    Account shape :: derivation path + address/public key
    Scope shape :: chain method and derivation path
    Runtime handles :: TrezorConnect instance/bridge session
    Persistence :: redacted pairing/profile and derivation metadata
    Notes :: Not EIP-1193-shaped. For EVM dapps, MetaMask/Rabby bridges are usually simpler.
```

## Coverage Matrix

```text
  EVM browser extensions ::
    Sources Eip6963_BrowserEvent, Eip1193_InjectedProvider
    Connection BlockheadWalletConnection
    Account BlockheadWalletAccount caip10
    Request Target `BlockheadWalletRequest`; current runtime does not persist EIP-1193 request rows

  Remote/mobile/hardware bridge ::
    Sources WalletConnect_SignClient
    Connection Target `BlockheadWalletConnection` after Sign Client integration
    Transport Target `BlockheadWalletTransportSession` topic after Sign Client integration
    Account Target `BlockheadWalletAccount` CAIP-10 rows from approved session namespaces
    Request Target `BlockheadWalletRequest` for session requests

  Solana/Sui Wallet Standard ::
    Sources WalletStandard_BrowserRegistry
    Wallet BlockheadWallet discovery only today
    Connection Target only after `standard:connect` feature calls are mapped
    Account Target CAIP-like or chain-specific account object only after connection support exists
    Request Target only after feature-call instrumentation exists

  Bitcoin injected globals ::
    Sources BitcoinInjected_WalletApi
    Wallet BlockheadWallet discovery only today
    Connection Target only after wallet-specific APIs are mapped
    Account Target roleAddressSet only after connection support exists

  Cardano ::
    Sources CardanoCip30_WalletApi
    Connection BlockheadWalletConnection
    Account Current runtime writes CAIP-shaped `BlockheadWalletAccount` rows for used/unused addresses only
    Target account shape roleAddressSet with used/unused/change/reward roles after selectors support address roles
    Request Target `BlockheadWalletRequest`; current runtime does not persist CIP-30 request rows
    No generic Cardano wallet-state entity without a local wallet inventory source

  Cosmos ::
    Sources CosmosOfflineSigner_WalletApi
    Wallet BlockheadWallet discovery only today
    Connection Target only with concrete chain id and enabled signer
    Account Target chainAddress only after `getKey(chainId)` / signer account exposure
    Request Target signer calls
    No generic Cosmos wallet-state entity from signer exposure alone

  Polkadot/Substrate ::
    Sources PolkadotInjectedWeb3_WalletApi
    Connection BlockheadWalletConnection
    Account Current runtime writes CAIP-shaped `BlockheadWalletAccount` rows with generic `polkadot:0` reference
    Target account shape chain/genesis-scoped chainAddress after chain context is passed into the adapter
    Request Target `BlockheadWalletRequest`; current runtime does not persist extension request rows
    No generic Polkadot wallet-state entity from extension exposure alone

  TON/Beacon/NEAR/ICP/Flow/Xaman ::
    Sources TonConnect_Bridge, TezosBeacon_Sdk, NearWalletSelector_Sdk, IcrcSigner_PostMessage, FlowFcl_Discovery, Xaman_XrplSdk
    Connection Target `BlockheadWalletConnection` when an authorization/session exists
    Transport Target `BlockheadWalletTransportSession` when durable
    Authentication Target `BlockheadWalletAuthentication` when sign-in/OAuth is primary
    Request Target `BlockheadWalletRequest`

  Local/private wallet state ::
    Sources BitcoinCoreWallet_JsonRpc, MoneroWalletRpc_JsonRpc, ZcashdWallet_JsonRpc, CashuWallet_Local
    Connection Target optional `BlockheadWalletConnection` for configured local wallet client
    State Explicit local/private wallet rows are valid only after their selectors and exposed source state are modeled
    Account Target `BlockheadWalletAccount` only when exposing general account/address selectors is useful

  Direct hardware ::
    Sources LedgerJs_WebHid, TrezorConnect_Bridge
    Connection Target `BlockheadWalletConnection`
    Transport Target `BlockheadWalletTransportSession` device pairing
    Account Target `BlockheadWalletAccount` derivationPath/address
    Request Target `BlockheadWalletRequest` devicePrompt
    No public chain state under Blockhead rows
```

## Rejected Or Quarantined Candidates

- OpenLV / Open Lavatory WebRTC wallet bridge: removed from `src/constants/Wallet.ts` and from source rows because no public primary source, repository, specification, or explicit local product requirement was verified. Re-add only with evidence for the transport, API surface, session identity, account shape, and persistence contract.
- Ledger Wallet Provider EVM injected provider: removed from `src/constants/Wallet.ts` and source bindings until a public primary source verifies the injected discovery surface, provider API contract, account shape, and persistence contract. Keep Ledger direct-device modeling under the grounded WebHID source row.
- LedgerJS WebUSB: keep out of the constants-backed method list until it has a separate source row and product decision. Do not hide WebUSB under the current WebHID `direct-hardware-transport` row.

## Sourceability Rules

- Add a `WalletConnectionMethod` row when a protocol/spec/source exists and the method can be described with a stable discovery/transport/API surface.
- Add a live `BlockheadWallet` row only when a constants seed, browser discovery event/global, registry, manifest, or local profile exposes a candidate.
- Add a `BlockheadWalletConnection` row only when a user/session/local configuration has authorized or attempted a connection.
- Add a `BlockheadWalletAccount` row only when a wallet source exposes an account, address, principal, subaccount, derivation path, or role address.
- Add `BlockheadWalletTransportSession` only when the transport has durable serializable identity.
- Add `BlockheadWalletRequest` for wallet API calls that matter for debugging, audit, pending status, or user-visible execution.
- Add `BlockheadWalletCapabilityGrant` for signed/durable capability artifacts, not for ordinary account exposure.
- Add `BlockheadWalletAuthentication` for sign-in/OAuth/SIWx flows, even if they used a wallet to sign.
- Add chain-specific local/private wallet rows only when the source exposes private/local wallet inventory and the schema defines concrete selectors for that exposed state, not when a browser signer exposes an address.

## Intent And Session Source Notes

This section folds the prior intent/source research into the full source catalog. The schema may reference only concrete `SourceBinding` enum members. Order-server, wallet API, browser transport, and runtime names below are source-family notes unless they already exist as executable bindings in this file.

Local source ownership:

- `Local_Internal` owns product-local sessions, ordered actions, accepted invocation records, typed swap/bridge/transfer intent rows, readiness request envelopes, outcome summaries, local quote/order records, wallet requests, simulation envelopes, retained simulation calls/logs, list membership, local ids, ordering, timestamps, summaries, and payload hashes.
- `Constants_Internal` owns checked-in labels, enum/catalog normalization, action/protocol/wallet/status keys, option definitions, and reproducibility hashes. Catalog rows support validation and display; they do not become provider, wallet, runtime, or chain observations.
- Browser drag/drop is transient UI transport. Persist only accepted or replayable results as `BlockheadIntentInvocation`; never model hover state, `DataTransfer`, drag rectangles, tooltip previews, or raw UI payloads as durable source rows.
- TEVM-style simulation output is local runtime evidence. Until a concrete `Tevm_Runtime` binding is admitted, simulation rows use `Local_Internal` for retained runtime artifacts and `Voltaire_JsonRpc` only for fork/RPC context where applicable.

Prior-art source families:

- OIF aggregators, LI.FI intent order servers, NEAR Intents order servers, UniswapX/Trade API, and 1inch Fusion are signed-order or filler-market source candidates. They can motivate `BlockheadIntentQuote` and `BlockheadIntentOrder`, but they are not listed on schema rows until concrete executable source bindings, auth/CORS behavior, endpoint selectors, clocks, status vocabulary, and payload examples are admitted.
- Existing `Lifi_Rest` and `OneInchSwap_Rest` bindings are normal route/source bindings unless a future source row proves an order-server or signed-order lifecycle. Ordinary executable route quotes remain on specialized rows such as `SwapQuote_Timestamp` and `BridgeRouteQuote_Timestamp`, not `BlockheadIntentQuote`.
- Existing wallet source rows such as injected EIP-1193 providers, EIP-6963 discovery, WalletConnect, Wallet Standard, and protocol wallet SDK rows may later supply wallet request/status observations. The durable schema boundary remains `BlockheadWalletRequest` plus `BlockheadWalletRequest_Timestamp`; wallet-reported success is not chain finality.

Intent source mapping:

| Schema row | Source ownership |
| --- | --- |
| `BlockheadSession` | `Local_Internal` |
| `BlockheadSessionAction` | `Local_Internal`, `Constants_Internal` |
| `BlockheadIntentInvocation` | `Local_Internal`, `Constants_Internal`; browser drag/drop remains transient transport |
| `BlockheadActionReadinessCheck` | `Local_Internal`, `Constants_Internal` |
| `BlockheadActionReadinessCheck_Timestamp` | `Local_Internal`, `Constants_Internal`; wallet/source capability observations can be promoted only through concrete wallet source facets |
| `BlockheadActionOutcome` | `Local_Internal`, `Constants_Internal`; public transaction, receipt, bridge, and protocol evidence resolves outside this local artifact |
| `BlockheadActionOutcome_Timestamp` | `Local_Internal`, `Constants_Internal` |
| `BlockheadSwapIntent`, `BlockheadBridgeIntent`, `BlockheadTransferIntent` | `Local_Internal`, `Constants_Internal`; CAIP fields and native refs are local product-routing fields until resolved by existing account/network/asset sources |
| `BlockheadIntentQuote` | `Local_Internal`, `Constants_Internal`; provider/order-server handles are correlation fields, not row identity |
| `BlockheadIntentQuote_Timestamp` | `Local_Internal` until concrete signed-order/filler-market source bindings are admitted |
| `BlockheadIntentOrder` | `Local_Internal`, `Constants_Internal`; `source+orderId` remains a correlation handle |
| `BlockheadIntentOrder_Timestamp` | `Local_Internal`, `Constants_Internal` until concrete provider status source bindings are admitted |
| `BlockheadWalletRequest` | `Local_Internal`, `Constants_Internal`; concrete wallet sources may observe lifecycle timestamps |
| `BlockheadWalletRequest_Timestamp` | `Local_Internal`, `Constants_Internal`, plus concrete wallet source facets when implemented |
| `BlockheadSessionSimulation` | `Local_Internal`, `Voltaire_JsonRpc` for fork context |
| `BlockheadSessionSimulationCall`, `BlockheadSessionSimulationLog` | `Local_Internal` runtime replay/debug artifacts |

Intent field sourceability:

- Local ids, scoped ids, session/action links, list membership, ordering indexes, created/updated/requested/submitted timestamps, selected protocol, typed intent parameters, local quote/order/wallet links, outcomes, and simulation envelopes are `Local_Internal`.
- Enum labels, normalized status labels, capability keys, protocol/action/wallet/invocation/simulation keys, intent definitions, and reproducibility hashes are `Constants_Internal`.
- Payload hash fields such as `requestPayloadHash`, `quotePayloadHash`, `orderPayloadHash`, `statusPayloadHash`, `resultPayloadHash`, `inputDataHash`, `outputDataHash`, and `dataHash` are evidence handles. The source that produced the retained payload owns the observation; raw payloads stay out of primary schema fields.
- Provider quote fields such as quote ids, solver ids, expiries, previews, checksums, and provider errors belong on quote timestamp observations. Provider order status, fill/claim transaction hashes, gas, status payload hashes, and provider errors belong on order timestamp observations.
- Wallet request parents describe what Blockhead asked a wallet to do. Wallet-reported signatures, transaction ids/hashes, bundle ids/status, numeric status codes, observed atomicity, receipt counts, and wallet errors belong on wallet request timestamps.
- Readiness parents describe what Blockhead asked to check. Observed balances, allowances, deficits, capability support, and errors belong on readiness timestamp observations or existing account/asset/wallet rows.
- Simulation fork/run envelopes, calls, logs, gas summaries, errors, and runtime hashes are replay/debug evidence. They must not become canonical transaction, receipt, trace, or public log facts without public chain resolver evidence.
- `source` on quote/order parents is a provider/source correlation field. `source` on timestamp rows is the observer identity and belongs in selectors whenever multiple observers can report divergent observations at the same clock.

Intent resolver proof rules:

- Resolver facet absence represents unsupported facts. Do not encode source support as `EntityFieldCardinality.Zero`, placeholder primitives, or generic empty lists.
- Negative fixtures should cover drag hover with no durable row, route quote that does not create `BlockheadIntentQuote`, provider handles that do not collapse local artifacts, wallet rejection without chain finality, wallet success without receipt finality, simulated logs without public logs, and unsupported facets represented by absence.
- Treat `source-supported`, `source-derived-local`, `source-observed-not-canonical`, `source-unavailable`, `source-ambiguous`, and `source-out-of-scope` as distinct review outcomes when adding resolver facets.

AI source-layer notes:

- SourceProvider/SourceBinding are Blockhead executable source metadata. AiModelProvider is AI-domain provider identity.
- Source-native digest identifiers such as OCI digests, IPFS CIDs, Arweave ids, and Git object ids remain native selectors. Local/evidence hashes used for snapshots, request/response payloads, arguments, prompts, files, signatures, and claims must carry an explicit hash algorithm.
- Model/provider API sources resolve provider-scoped model selectors, source/time model observations, provider catalog entries, provider API operations, and catalog observations. Provider model list/detail endpoints may expose descriptions, lifecycle, token limits, supported methods, and capability flags; keep those on `AiModel_Timestamp` unless the provider contract makes them immutable identity fields. They do not prove equivalence with HF repos, OCI artifacts, or model cards.
- Hugging Face Hub and MLflow resolve source-scoped catalog entries, model versions, artifacts, documents, and claims. They should not directly resolve AiModel unless a resolver derives a provider-scoped model selector.
- Dataset/evaluation sources resolve dataset selectors, benchmark/catalog rows, document claims, and timestamped evaluation observations. Hugging Face model-index results originate as model-card claims; MLflow metrics originate as run/model metric observations with timestamp/step and optional dataset name/digest. Do not collapse those into static evaluation identity.
- Direct provider API execution is represented as BlockheadAgentProviderCall local state linked to AiProviderApiOperation/AiModel. Provider sources supply operation/model metadata and probe health, while Local_Internal owns the user's request/response execution record. Current Blockhead conversation turns store user prompt and assistant text directly; ACP/A2A protocol messages remain protocol-native rows.
- Parser, registry, and protocol document sources resolve documents, document claims, artifacts, and relationship claims. Claim extraction applies to HF cards, Croissant JSON-LD, SPDX, CycloneDX ML-BOM, OCI manifests/artifact manifests, A2A cards, EIP-8004 files, MLflow/ONNX metadata, and Git-hosted docs. They do not create dedicated AiModelCard/AiManifest/AiBom entities by default.
- ACP registry REST resolves curated ACP agent program metadata, versions, and distribution blocks from the registry JSON/schema. Registry entries are installable program/package catalog rows, not running agent identity.
- ACP local JSON-RPC resolves local runtime/session/turn/tool/file/terminal state and Blockhead-local conversation links over editor-launched stdio. Local installed agent program configuration is Blockhead-local state; live ACP process state is AcpAgentRuntime. Remote HTTP/WebSocket ACP should become a separate source binding when implemented.
- A2A well-known HTTP resolves card snapshots and service/skill/interface declarations. A2A service HTTP resolves tasks, messages, artifacts, task status observations, and authenticated extended cards across the source-declared protocol binding; the binding may be JSON-RPC, HTTP+JSON/REST, gRPC behind a gateway, or a custom A2A binding.
- MCP package registry REST resolves server.json/API catalog rows keyed by registry server name, version, packages, remotes, repository metadata, and official registry status. Package/remotes declarations are deployable server catalog metadata, not running McpServer identity.
- MCP configured protocol resolves server-scoped tools/resources/prompts and tool calls over stdio, Streamable HTTP, legacy HTTP+SSE, or custom transport. MCP messages remain JSON-RPC; tool/resource/prompt names are not global.
- EIP-8004 sources resolve crypto-native registration identity, registration-file evidence, service endpoint declarations, endpoint-domain verification, reputation feedback, and validation observations. Registration-file and validation/feedback hashes are source-native hash commitments such as keccak256, so schema rows keep hash algorithms explicit. Use Eip8004Scan_Rest for indexer/API reads and the existing Voltaire_JsonRpc binding for direct EVM contract reads; do not add an EIP-8004-specific JSON-RPC source unless the transport differs from normal EVM JSON-RPC. A2A/MCP/x402 declarations inside registration files remain endpoint rows or claims.
- X402 probes resolve HTTP 402 payment requirement observations and native PAYMENT-REQUIRED / PAYMENT-SIGNATURE / PAYMENT-RESPONSE payload evidence, not payment settlement identity. Settlement transaction hashes or receipts belong to native payment/chain rows.
- BlockheadAgentConnection rows are local configuration. Provider/protocol sources may still resolve BlockheadAgentConnection_Timestamp health/probe observations for the configured endpoint.
- AgentIdentityClaim is reserved for explicit equivalence/control/verified-binding evidence; use AiRelationshipClaim for non-equivalence relationships and provenance.
- Sigstore/Rekor resolves AiArtifactAttestation rows. Attestations are evidence about artifact integrity/provenance, not alternate artifact selectors.
