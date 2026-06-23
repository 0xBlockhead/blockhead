import type { Type } from 'arktype'

import type { Source } from '$/sources/Source.ts'
import type { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export enum SourceTargetKind {
	Global = 'Global',
	Caip2Network = 'Caip2Network',
	Eip155Chain = 'Eip155Chain',
	GitRepository = 'GitRepository',
	ContentAddressScheme = 'ContentAddressScheme',
	SqlDataset = 'SqlDataset',
	LocalDevice = 'LocalDevice',
	Feed = 'Feed',
	Canister = 'Canister',
	TorrentSwarm = 'TorrentSwarm',
}

export enum SourceEndpointKind {
	HttpUrl = 'HttpUrl',
	WebSocketUrl = 'WebSocketUrl',
	TcpAddress = 'TcpAddress',
	UdpAddress = 'UdpAddress',
	PostgresDsn = 'PostgresDsn',
	LocalFilePath = 'LocalFilePath',
	LocalProcess = 'LocalProcess',
	InjectedBrowserProvider = 'InjectedBrowserProvider',
	BrowserWalletProvider = 'BrowserWalletProvider',
	CanisterId = 'CanisterId',
	InProcess = 'InProcess',
}

export enum WireProtocol {
	HttpRest = 'HttpRest',
	JsonRpc2 = 'JsonRpc2',
	Graphql = 'Graphql',
	Xrpc = 'Xrpc',
	Grpc = 'Grpc',
	Wrpc = 'Wrpc',
	Git = 'Git',
	Bencode = 'Bencode',
	Prometheus = 'Prometheus',
	Sql = 'Sql',
	WalletProvider = 'WalletProvider',
	Canister = 'Canister',
	OciDistribution = 'OciDistribution',
	InProcess = 'InProcess',
	Uri = 'Uri',
	Adnl = 'Adnl',
	WebSocketMessages = 'WebSocketMessages',
	RawHttp = 'RawHttp',
	LocalFile = 'LocalFile',
}

export enum ApiFamily {
	RestJson = 'RestJson',
	StaticWebsite = 'StaticWebsite',
	OpenApiHttp = 'OpenApiHttp',
	GraphqlHttp = 'GraphqlHttp',
	XrpcLexicon = 'XrpcLexicon',
	EvmExecutionJsonRpc = 'EvmExecutionJsonRpc',
	EthereumBeaconRest = 'EthereumBeaconRest',
	SourcifyRestV2 = 'SourcifyRestV2',
	BitcoinJsonRpc = 'BitcoinJsonRpc',
	FilecoinLotusJsonRpc = 'FilecoinLotusJsonRpc',
	MoneroDaemonJsonRpc = 'MoneroDaemonJsonRpc',
	SubstrateJsonRpc = 'SubstrateJsonRpc',
	SolanaJsonRpc = 'SolanaJsonRpc',
	JsonRpcApi = 'JsonRpcApi',
	CelestiaNodeJsonRpc = 'CelestiaNodeJsonRpc',
	StarknetJsonRpc = 'StarknetJsonRpc',
	BlockscoutRestV2 = 'BlockscoutRestV2',
	EtherscanModuleAction = 'EtherscanModuleAction',
	AvailExplorerApi = 'AvailExplorerApi',
	CosmosLcdApi = 'CosmosLcdApi',
	DydxIndexerRest = 'DydxIndexerRest',
	TezosNodeRpc = 'TezosNodeRpc',
	Postgres = 'Postgres',
	PrometheusText = 'PrometheusText',
	CardanoLocalStateQuery = 'CardanoLocalStateQuery',
	FedimintGatewaydApi = 'FedimintGatewaydApi',
	KaspaRestApi = 'KaspaRestApi',
	KaspaWrpcApi = 'KaspaWrpcApi',
	LocalStateStore = 'LocalStateStore',
	UriScheme = 'UriScheme',
	TonLiteServerAdnl = 'TonLiteServerAdnl',
	WebTorrentApi = 'WebTorrentApi',
	GithubContentsApi = 'GithubContentsApi',
	GithubRestApi = 'GithubRestApi',
	GitlabRestApi = 'GitlabRestApi',
	ForgejoRestApi = 'ForgejoRestApi',
	GitObject = 'GitObject',
	AtprotoSync = 'AtprotoSync',
	IpfsGateway = 'IpfsGateway',
	SwarmGateway = 'SwarmGateway',
	ArweaveGateway = 'ArweaveGateway',
	NostrRelay = 'NostrRelay',
	BitTorrentTracker = 'BitTorrentTracker',
	BitTorrentDht = 'BitTorrentDht',
	BitTorrentClient = 'BitTorrentClient',
	SigstoreRekorApi = 'SigstoreRekorApi',
	A2aProtocol = 'A2aProtocol',
	AcpProtocol = 'AcpProtocol',
	McpProtocol = 'McpProtocol',
	OciDistributionApi = 'OciDistributionApi',
	X402Protocol = 'X402Protocol',
	LocalParser = 'LocalParser',
	CatalogRows = 'CatalogRows',
	WalletApi = 'WalletApi',
	XmtpClientApi = 'XmtpClientApi',
	GrpcService = 'GrpcService',
	IcCanister = 'IcCanister',
	CertifiedHttpGateway = 'CertifiedHttpGateway',
	RosettaApi = 'RosettaApi',
}

export enum SourceOperationGroup {
	GenericRead = 'GenericRead',
	GenericSubscribe = 'GenericSubscribe',
	AgentCapabilityCatalog = 'AgentCapabilityCatalog',
	AiModelCatalog = 'AiModelCatalog',
	AiProviderOperationCatalog = 'AiProviderOperationCatalog',
	AiArtifactCatalog = 'AiArtifactCatalog',
	AiDatasetMetadata = 'AiDatasetMetadata',
	AgentRuntimeInvocation = 'AgentRuntimeInvocation',
	DocumentClaimExtraction = 'DocumentClaimExtraction',
	PaymentNegotiation = 'PaymentNegotiation',
	RepositoryMetadata = 'RepositoryMetadata',
	SoftwareArtifactRegistry = 'SoftwareArtifactRegistry',
	GitRepositoryContents = 'GitRepositoryContents',
	EvmRpcCore = 'EvmRpcCore',
	EvmRpcTrace = 'EvmRpcTrace',
	EvmRpcTxpool = 'EvmRpcTxpool',
	EvmRpcSubscribe = 'EvmRpcSubscribe',
	BlockscoutAccountAbstraction = 'BlockscoutAccountAbstraction',
	EtherscanAccountModule = 'EtherscanAccountModule',
	EtherscanContractModule = 'EtherscanContractModule',
	GithubRepositoryContents = 'GithubRepositoryContents',
	IssueTracking = 'IssueTracking',
	PullRequestReview = 'PullRequestReview',
	ReleaseMetadata = 'ReleaseMetadata',
	ContentGatewayRead = 'ContentGatewayRead',
	NostrRelayRead = 'NostrRelayRead',
	BitTorrentAnnounce = 'BitTorrentAnnounce',
	BitTorrentDhtLookup = 'BitTorrentDhtLookup',
	WalletAccountRead = 'WalletAccountRead',
	WalletSign = 'WalletSign',
}

export enum SourceDelivery {
	BrowserDirect = 'BrowserDirect',
	HttpProxy = 'HttpProxy',
	RemoteQuery = 'RemoteQuery',
	RemoteLive = 'RemoteLive',
	ServerOnly = 'ServerOnly',
	LocalOnly = 'LocalOnly',
	Unsupported = 'Unsupported',
}

export enum SourceCredentialScope {
	None = 'None',
	PublicConfig = 'PublicConfig',
	RuntimeSecret = 'RuntimeSecret',
	LocalSecret = 'LocalSecret',
	UserDelegated = 'UserDelegated',
}

export enum SourceArtifactKind {
	OpenApiSpec = 'OpenApiSpec',
	OpenApiTypes = 'OpenApiTypes',
	OpenRpcSpec = 'OpenRpcSpec',
	OpenRpcTypes = 'OpenRpcTypes',
	GraphqlSchema = 'GraphqlSchema',
	GraphqlTypes = 'GraphqlTypes',
	GoogleDiscovery = 'GoogleDiscovery',
	Lexicon = 'Lexicon',
	Proto = 'Proto',
	Candid = 'Candid',
	GenerationManifest = 'GenerationManifest',
	HandwrittenTypes = 'HandwrittenTypes',
}

export type SourceTarget = {
	kind: SourceTargetKind
	key: string
}

export type SourceEndpoint = {
	endpointKind: SourceEndpointKind
	locator: string
	origin?: string
	corsEnabled?: boolean
}

export type SourceArtifact = {
	kind: SourceArtifactKind
	path: string
	generated: boolean
}

export type SourceCredentialRequirement = {
	scope: SourceCredentialScope
	env?: Type<SourcePublicEnv>
	keys?: readonly string[]
}

export type SourceBinding = {
	provider: SourceProvider
	source: Source
	target: SourceTarget
	endpoints: readonly SourceEndpoint[]
	wireProtocol: WireProtocol
	apiFamily: ApiFamily
	operationGroups: readonly SourceOperationGroup[]
	delivery: SourceDelivery
	credentials: readonly SourceCredentialRequirement[]
	artifacts?: readonly SourceArtifact[]
}
