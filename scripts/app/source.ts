import type { SourceTarget } from './inputs/source-target.ts'


export enum SourceTargetKind {
	Caip2Network = 'Caip2Network',
	Canister = 'Canister',
	ContentAddressScheme = 'ContentAddressScheme',
	Eip155Chain = 'Eip155Chain',
	Feed = 'Feed',
	GitRepository = 'GitRepository',
	Global = 'Global',
	LocalDevice = 'LocalDevice',
	NetworkSlug = 'NetworkSlug',
	SqlDataset = 'SqlDataset',
	TorrentSwarm = 'TorrentSwarm',
}

export enum SourceEndpointKind {
	BrowserWalletProvider = 'BrowserWalletProvider',
	CanisterId = 'CanisterId',
	HttpUrl = 'HttpUrl',
	InjectedBrowserProvider = 'InjectedBrowserProvider',
	InProcess = 'InProcess',
	LocalFilePath = 'LocalFilePath',
	LocalProcess = 'LocalProcess',
	PostgresDsn = 'PostgresDsn',
	TcpAddress = 'TcpAddress',
	UdpAddress = 'UdpAddress',
	WebSocketUrl = 'WebSocketUrl',
}

export enum WireProtocol {
	Adnl = 'Adnl',
	Bencode = 'Bencode',
	Canister = 'Canister',
	Git = 'Git',
	Graphql = 'Graphql',
	Grpc = 'Grpc',
	HttpRest = 'HttpRest',
	InProcess = 'InProcess',
	JsonRpc2 = 'JsonRpc2',
	LocalFile = 'LocalFile',
	OciDistribution = 'OciDistribution',
	Prometheus = 'Prometheus',
	RawHttp = 'RawHttp',
	Sql = 'Sql',
	Uri = 'Uri',
	WalletProvider = 'WalletProvider',
	WebSocketMessages = 'WebSocketMessages',
	Wrpc = 'Wrpc',
	Xrpc = 'Xrpc',
}

export type SourceTargetDefinition = SourceTarget<SourceTargetKind>

export enum ApiFamily {
	AcpProtocol = 'AcpProtocol',
	AlgodRestApi = 'AlgodRestApi',
	AlgorandIndexerRestApi = 'AlgorandIndexerRestApi',
	ArweaveGateway = 'ArweaveGateway',
	AtprotoSync = 'AtprotoSync',
	BitcoinJsonRpc = 'BitcoinJsonRpc',
	BitTorrentClient = 'BitTorrentClient',
	BitTorrentDht = 'BitTorrentDht',
	BitTorrentTracker = 'BitTorrentTracker',
	BlockscoutRestV2 = 'BlockscoutRestV2',
	CardanoLocalStateQuery = 'CardanoLocalStateQuery',
	CatalogRows = 'CatalogRows',
	CelestiaNodeJsonRpc = 'CelestiaNodeJsonRpc',
	CertifiedHttpGateway = 'CertifiedHttpGateway',
	CosmosLcdApi = 'CosmosLcdApi',
	DydxIndexer = 'DydxIndexer',
	EnvioHyperSyncApi = 'EnvioHyperSyncApi',
	EthereumBeaconRest = 'EthereumBeaconRest',
	EtherscanModuleAction = 'EtherscanModuleAction',
	EvmExecutionJsonRpc = 'EvmExecutionJsonRpc',
	FedimintGatewaydApi = 'FedimintGatewaydApi',
	FilecoinLotusJsonRpc = 'FilecoinLotusJsonRpc',
	ForgejoRestApi = 'ForgejoRestApi',
	GithubContentsApi = 'GithubContentsApi',
	GithubRestApi = 'GithubRestApi',
	GitlabRestApi = 'GitlabRestApi',
	GitObject = 'GitObject',
	GoldRushFoundationalApi = 'GoldRushFoundationalApi',
	GraphqlHttp = 'GraphqlHttp',
	GrpcService = 'GrpcService',
	IcCanister = 'IcCanister',
	IpfsGateway = 'IpfsGateway',
	JsonRpcApi = 'JsonRpcApi',
	KaspaRestApi = 'KaspaRestApi',
	KaspaWrpcApi = 'KaspaWrpcApi',
	LocalParser = 'LocalParser',
	LocalStateStore = 'LocalStateStore',
	McpProtocol = 'McpProtocol',
	MetaplexDasJsonRpc = 'MetaplexDasJsonRpc',
	MoneroDaemonJsonRpc = 'MoneroDaemonJsonRpc',
	NostrRelay = 'NostrRelay',
	OciDistributionApi = 'OciDistributionApi',
	OpenApiHttp = 'OpenApiHttp',
	Postgres = 'Postgres',
	PrometheusText = 'PrometheusText',
	RestJson = 'RestJson',
	RosettaApi = 'RosettaApi',
	SolanaJsonRpc = 'SolanaJsonRpc',
	SourcifyRestV2 = 'SourcifyRestV2',
	SqdPortalStream = 'SqdPortalStream',
	StarknetJsonRpc = 'StarknetJsonRpc',
	StaticWebsite = 'StaticWebsite',
	SubstrateJsonRpc = 'SubstrateJsonRpc',
	SwarmGateway = 'SwarmGateway',
	TezosNodeRpc = 'TezosNodeRpc',
	TonCenterV3Api = 'TonCenterV3Api',
	TonLiteServerAdnl = 'TonLiteServerAdnl',
	UriScheme = 'UriScheme',
	WalletApi = 'WalletApi',
	WebTorrentApi = 'WebTorrentApi',
	XmtpClientApi = 'XmtpClientApi',
	XrpcLexicon = 'XrpcLexicon',
}

export enum SourceOperationGroup {
	AgentCapabilityCatalog = 'AgentCapabilityCatalog',
	AgentRuntimeInvocation = 'AgentRuntimeInvocation',
	AiArtifactCatalog = 'AiArtifactCatalog',
	AiDatasetMetadata = 'AiDatasetMetadata',
	AiModelCatalog = 'AiModelCatalog',
	AiProviderOperationCatalog = 'AiProviderOperationCatalog',
	BitTorrentAnnounce = 'BitTorrentAnnounce',
	BitTorrentDhtLookup = 'BitTorrentDhtLookup',
	BlockscoutAccountAbstraction = 'BlockscoutAccountAbstraction',
	ContentGatewayRead = 'ContentGatewayRead',
	DocumentClaimExtraction = 'DocumentClaimExtraction',
	EcashMintOperations = 'EcashMintOperations',
	EtherscanAccountModule = 'EtherscanAccountModule',
	EtherscanContractModule = 'EtherscanContractModule',
	EvmRpcCore = 'EvmRpcCore',
	EvmRpcSubscribe = 'EvmRpcSubscribe',
	EvmRpcTrace = 'EvmRpcTrace',
	EvmRpcTxpool = 'EvmRpcTxpool',
	GenericRead = 'GenericRead',
	GenericSubscribe = 'GenericSubscribe',
	GithubRepositoryContents = 'GithubRepositoryContents',
	GitRepositoryContents = 'GitRepositoryContents',
	IssueTracking = 'IssueTracking',
	NostrRelayPublish = 'NostrRelayPublish',
	NostrRelayRead = 'NostrRelayRead',
	NostrSearch = 'NostrSearch',
	PaymentNegotiation = 'PaymentNegotiation',
	PullRequestReview = 'PullRequestReview',
	ReleaseMetadata = 'ReleaseMetadata',
	RepositoryMetadata = 'RepositoryMetadata',
	SoftwareArtifactRegistry = 'SoftwareArtifactRegistry',
	WalletAccountRead = 'WalletAccountRead',
	WalletSign = 'WalletSign',
}

export enum SourceDelivery {
	BrowserDirect = 'BrowserDirect',
	HttpProxy = 'HttpProxy',
	LocalOnly = 'LocalOnly',
	RemoteLive = 'RemoteLive',
	RemoteQuery = 'RemoteQuery',
	ServerOnly = 'ServerOnly',
	Unsupported = 'Unsupported',
}

export enum SourceCredentialScope {
	LocalSecret = 'LocalSecret',
	PublicConfig = 'PublicConfig',
	RuntimeSecret = 'RuntimeSecret',
	UserDelegated = 'UserDelegated',
}

export enum SourceArtifactKind {
	Candid = 'Candid',
	GenerationManifest = 'GenerationManifest',
	GoogleDiscovery = 'GoogleDiscovery',
	GraphqlSchema = 'GraphqlSchema',
	GraphqlTypes = 'GraphqlTypes',
	HandwrittenTypes = 'HandwrittenTypes',
	Lexicon = 'Lexicon',
	OpenApiSpec = 'OpenApiSpec',
	OpenApiTypes = 'OpenApiTypes',
	OpenRpcSpec = 'OpenRpcSpec',
	OpenRpcTypes = 'OpenRpcTypes',
	Proto = 'Proto',
}

type _SourceEnv = {
	keys: {
		name: string
		type: string
	}[]
}

type _SourceEndpoint<_Kind extends SourceEndpointKind = SourceEndpointKind> = (
	_Kind extends SourceEndpointKind ? {
		endpointKind: _Kind
		locator: string
	} & (
		_Kind extends SourceEndpointKind.HttpUrl ? {
			corsEnabled?: boolean
		} : {
			corsEnabled?: never
		}
	) : never
)

export type _SourceArtifact<_Kind extends SourceArtifactKind = SourceArtifactKind> = (
	_Kind extends SourceArtifactKind ? {
		kind: _Kind
		path: string
		generated?: true
	} & (
		_Kind extends SourceArtifactKind.HandwrittenTypes ? {
			referenceUrl?: string
			officialUrl?: never
		} : {
			officialUrl?: string
			referenceUrl?: never
		}
	) : never
)

type _SourceCredential<_Scope extends SourceCredentialScope = SourceCredentialScope> = (
	_Scope extends SourceCredentialScope ? {
		scope: _Scope
		env?: _SourceEnv
	} & (
		_Scope extends SourceCredentialScope.PublicConfig ? {
			keys?: never
		} : {
			keys?: string[]
		}
	) : never
)

type _SourceRuntimeSecret = {
	scope: SourceCredentialScope.RuntimeSecret
	envKey: string
	injection:
		| {
			header: {
				name: string
				prefix?: string
			}
			query?: never
			endpointTemplate?: never
		}
		| {
			query: {
				name: string
			}
			header?: never
			endpointTemplate?: never
		}
		| {
			endpointTemplate: {
				slot: string
			}
			header?: never
			query?: never
		}
	oauthClientCredentials?: {
		clientIdEnvKey: string
		tokenEndpoint: string
		userAgent?: string
	}
}

type _SourceBindingBase = {
	target: SourceTargetDefinition
}

type _SourceBindingCompatibilityRow = {
	wireProtocol: WireProtocol
	apiFamilies: readonly [ApiFamily, ...ApiFamily[]]
	endpointKinds: readonly [SourceEndpointKind, ...SourceEndpointKind[]]
	operationGroups: true | readonly [SourceOperationGroup, ...SourceOperationGroup[]]
	artifactKinds: true | readonly SourceArtifactKind[]
}

export const sourceBindingCompatibility = [
	{ wireProtocol: WireProtocol.Adnl, apiFamilies: [ApiFamily.TonLiteServerAdnl], endpointKinds: [SourceEndpointKind.TcpAddress], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Bencode, apiFamilies: [ApiFamily.BitTorrentClient], endpointKinds: [SourceEndpointKind.LocalFilePath, SourceEndpointKind.TcpAddress], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Bencode, apiFamilies: [ApiFamily.BitTorrentDht, ApiFamily.BitTorrentTracker], endpointKinds: [SourceEndpointKind.UdpAddress], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Canister, apiFamilies: [ApiFamily.IcCanister], endpointKinds: [SourceEndpointKind.CanisterId], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Git, apiFamilies: [ApiFamily.GitObject], endpointKinds: [SourceEndpointKind.HttpUrl, SourceEndpointKind.LocalFilePath], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Graphql, apiFamilies: [ApiFamily.GraphqlHttp], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: [SourceOperationGroup.GenericRead], artifactKinds: [SourceArtifactKind.GenerationManifest, SourceArtifactKind.GraphqlSchema, SourceArtifactKind.GraphqlTypes, SourceArtifactKind.HandwrittenTypes] },
	{ wireProtocol: WireProtocol.Grpc, apiFamilies: [ApiFamily.GrpcService], endpointKinds: [SourceEndpointKind.HttpUrl, SourceEndpointKind.TcpAddress], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.HttpRest, apiFamilies: [ApiFamily.AlgodRestApi, ApiFamily.AlgorandIndexerRestApi, ApiFamily.ArweaveGateway, ApiFamily.BitTorrentClient, ApiFamily.BlockscoutRestV2, ApiFamily.CosmosLcdApi, ApiFamily.EthereumBeaconRest, ApiFamily.EtherscanModuleAction, ApiFamily.FedimintGatewaydApi, ApiFamily.ForgejoRestApi, ApiFamily.GithubContentsApi, ApiFamily.GithubRestApi, ApiFamily.GitlabRestApi, ApiFamily.GitObject, ApiFamily.GoldRushFoundationalApi, ApiFamily.IpfsGateway, ApiFamily.KaspaRestApi, ApiFamily.RestJson, ApiFamily.RosettaApi, ApiFamily.SourcifyRestV2, ApiFamily.SwarmGateway, ApiFamily.TezosNodeRpc, ApiFamily.TonCenterV3Api], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.HttpRest, apiFamilies: [ApiFamily.NostrRelay], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: [SourceOperationGroup.NostrRelayRead], artifactKinds: [SourceArtifactKind.HandwrittenTypes] },
	{ wireProtocol: WireProtocol.HttpRest, apiFamilies: [ApiFamily.OpenApiHttp], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: [SourceOperationGroup.GenericRead, SourceOperationGroup.SoftwareArtifactRegistry], artifactKinds: [SourceArtifactKind.GenerationManifest, SourceArtifactKind.OpenApiSpec, SourceArtifactKind.OpenApiTypes] },
	{ wireProtocol: WireProtocol.InProcess, apiFamilies: [ApiFamily.BitTorrentDht, ApiFamily.CatalogRows, ApiFamily.WebTorrentApi, ApiFamily.XmtpClientApi], endpointKinds: [SourceEndpointKind.InProcess], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.InProcess, apiFamilies: [ApiFamily.CardanoLocalStateQuery, ApiFamily.LocalParser], endpointKinds: [SourceEndpointKind.LocalProcess], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.JsonRpc2, apiFamilies: [ApiFamily.AcpProtocol, ApiFamily.McpProtocol], endpointKinds: [SourceEndpointKind.LocalProcess], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.JsonRpc2, apiFamilies: [ApiFamily.BitcoinJsonRpc, ApiFamily.FilecoinLotusJsonRpc, ApiFamily.MoneroDaemonJsonRpc, ApiFamily.SubstrateJsonRpc], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.JsonRpc2, apiFamilies: [ApiFamily.CelestiaNodeJsonRpc, ApiFamily.MetaplexDasJsonRpc, ApiFamily.StarknetJsonRpc], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: [SourceOperationGroup.GenericRead], artifactKinds: [SourceArtifactKind.GenerationManifest, SourceArtifactKind.HandwrittenTypes, SourceArtifactKind.OpenRpcSpec, SourceArtifactKind.OpenRpcTypes] },
	{ wireProtocol: WireProtocol.JsonRpc2, apiFamilies: [ApiFamily.EvmExecutionJsonRpc], endpointKinds: [SourceEndpointKind.HttpUrl, SourceEndpointKind.WebSocketUrl], operationGroups: [SourceOperationGroup.EvmRpcCore, SourceOperationGroup.EvmRpcSubscribe, SourceOperationGroup.EvmRpcTrace, SourceOperationGroup.EvmRpcTxpool], artifactKinds: [SourceArtifactKind.GenerationManifest, SourceArtifactKind.OpenRpcSpec, SourceArtifactKind.OpenRpcTypes] },
	{ wireProtocol: WireProtocol.JsonRpc2, apiFamilies: [ApiFamily.JsonRpcApi, ApiFamily.SolanaJsonRpc], endpointKinds: [SourceEndpointKind.HttpUrl, SourceEndpointKind.WebSocketUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.LocalFile, apiFamilies: [ApiFamily.GitObject, ApiFamily.LocalParser, ApiFamily.LocalStateStore], endpointKinds: [SourceEndpointKind.LocalFilePath], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.OciDistribution, apiFamilies: [ApiFamily.OciDistributionApi], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Prometheus, apiFamilies: [ApiFamily.PrometheusText], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.RawHttp, apiFamilies: [ApiFamily.BitTorrentTracker, ApiFamily.CertifiedHttpGateway, ApiFamily.EnvioHyperSyncApi, ApiFamily.RestJson, ApiFamily.SqdPortalStream, ApiFamily.StaticWebsite], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Sql, apiFamilies: [ApiFamily.Postgres], endpointKinds: [SourceEndpointKind.PostgresDsn], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Uri, apiFamilies: [ApiFamily.UriScheme], endpointKinds: [SourceEndpointKind.InProcess], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.WalletProvider, apiFamilies: [ApiFamily.WalletApi], endpointKinds: [SourceEndpointKind.BrowserWalletProvider, SourceEndpointKind.InProcess, SourceEndpointKind.LocalProcess], operationGroups: [SourceOperationGroup.WalletAccountRead, SourceOperationGroup.WalletSign], artifactKinds: [] },
	{ wireProtocol: WireProtocol.WebSocketMessages, apiFamilies: [ApiFamily.BitTorrentTracker], endpointKinds: [SourceEndpointKind.WebSocketUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.WebSocketMessages, apiFamilies: [ApiFamily.DydxIndexer], endpointKinds: [SourceEndpointKind.WebSocketUrl], operationGroups: [SourceOperationGroup.GenericSubscribe], artifactKinds: [SourceArtifactKind.HandwrittenTypes] },
	{ wireProtocol: WireProtocol.WebSocketMessages, apiFamilies: [ApiFamily.NostrRelay], endpointKinds: [SourceEndpointKind.WebSocketUrl], operationGroups: [SourceOperationGroup.GenericSubscribe, SourceOperationGroup.NostrRelayPublish, SourceOperationGroup.NostrRelayRead, SourceOperationGroup.NostrSearch], artifactKinds: [SourceArtifactKind.HandwrittenTypes] },
	{ wireProtocol: WireProtocol.Wrpc, apiFamilies: [ApiFamily.KaspaWrpcApi], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Xrpc, apiFamilies: [ApiFamily.AtprotoSync], endpointKinds: [SourceEndpointKind.HttpUrl, SourceEndpointKind.WebSocketUrl], operationGroups: true, artifactKinds: true },
	{ wireProtocol: WireProtocol.Xrpc, apiFamilies: [ApiFamily.XrpcLexicon], endpointKinds: [SourceEndpointKind.HttpUrl], operationGroups: true, artifactKinds: true },
] as const satisfies readonly _SourceBindingCompatibilityRow[]

type _SourceBindingCompatibility<
	_Row extends typeof sourceBindingCompatibility[number] = typeof sourceBindingCompatibility[number]
> = _Row extends typeof sourceBindingCompatibility[number] ? {
	wireProtocol: _Row['wireProtocol']
	apiFamily: _Row['apiFamilies'][number]
	endpoints: [_SourceEndpoint<_Row['endpointKinds'][number]>, ..._SourceEndpoint<_Row['endpointKinds'][number]>[]]
	operationGroups: _Row['operationGroups'] extends readonly (infer _OperationGroup extends SourceOperationGroup)[] ? [_OperationGroup, ..._OperationGroup[]] : [SourceOperationGroup, ...SourceOperationGroup[]]
	artifacts?: _Row['artifactKinds'] extends readonly (infer _ArtifactKind extends SourceArtifactKind)[] ? _Row['artifactKinds'] extends readonly [] ? never : _SourceArtifact<_ArtifactKind>[] : _SourceArtifact[]
} : never

export enum SourceBindingDeliveryEndpointLayout {
	BrowserDirect = 'BrowserDirect',
	Compatible = 'Compatible',
	HttpOnly = 'HttpOnly',
	RemoteLiveWebSocket = 'RemoteLiveWebSocket',
}

export enum SourceBindingDeliveryCredentialLayout {
	Any = 'Any',
	PublicOrUser = 'PublicOrUser',
	PublicOrUserWithOptionalRuntimeSecret = 'PublicOrUserWithOptionalRuntimeSecret',
}

type _SourceBindingDeliveryCompatibilityRow = {
	deliveries: readonly [SourceDelivery, ...SourceDelivery[]]
	wireProtocols:
		| true
		| {
			include: readonly [WireProtocol, ...WireProtocol[]]
			exclude?: never
		}
		| {
			exclude: readonly [WireProtocol, ...WireProtocol[]]
			include?: never
		}
	apiFamilies: true | readonly [ApiFamily, ...ApiFamily[]]
	endpointLayout: SourceBindingDeliveryEndpointLayout
	credentialLayout: SourceBindingDeliveryCredentialLayout
}

export const sourceBindingDeliveryCompatibility = [
	{
		deliveries: [SourceDelivery.BrowserDirect],
		wireProtocols: true,
		apiFamilies: true,
		endpointLayout: SourceBindingDeliveryEndpointLayout.BrowserDirect,
		credentialLayout: SourceBindingDeliveryCredentialLayout.PublicOrUser,
	},
	{
		deliveries: [SourceDelivery.HttpProxy],
		wireProtocols: true,
		apiFamilies: true,
		endpointLayout: SourceBindingDeliveryEndpointLayout.HttpOnly,
		credentialLayout: SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret,
	},
	{
		deliveries: [SourceDelivery.LocalOnly, SourceDelivery.ServerOnly, SourceDelivery.Unsupported],
		wireProtocols: true,
		apiFamilies: true,
		endpointLayout: SourceBindingDeliveryEndpointLayout.Compatible,
		credentialLayout: SourceBindingDeliveryCredentialLayout.Any,
	},
	{
		deliveries: [SourceDelivery.RemoteLive],
		wireProtocols: { exclude: [WireProtocol.Grpc] },
		apiFamilies: true,
		endpointLayout: SourceBindingDeliveryEndpointLayout.RemoteLiveWebSocket,
		credentialLayout: SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret,
	},
	{
		deliveries: [SourceDelivery.RemoteLive],
		wireProtocols: { include: [WireProtocol.Grpc] },
		apiFamilies: [ApiFamily.GrpcService],
		endpointLayout: SourceBindingDeliveryEndpointLayout.HttpOnly,
		credentialLayout: SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret,
	},
	{
		deliveries: [SourceDelivery.RemoteQuery],
		wireProtocols: true,
		apiFamilies: true,
		endpointLayout: SourceBindingDeliveryEndpointLayout.Compatible,
		credentialLayout: SourceBindingDeliveryCredentialLayout.Any,
	},
] as const satisfies readonly _SourceBindingDeliveryCompatibilityRow[]

type _SourceBindingDeliveryWireProtocol<
	_Row extends typeof sourceBindingDeliveryCompatibility[number],
> = _Row['wireProtocols'] extends true ?
	WireProtocol
: _Row['wireProtocols'] extends { include: readonly (infer _WireProtocol extends WireProtocol)[] } ?
	_WireProtocol
: _Row['wireProtocols'] extends { exclude: readonly (infer _WireProtocol extends WireProtocol)[] } ?
	Exclude<WireProtocol, _WireProtocol>
:
	never

type _SourceBindingDeliveryApiFamily<
	_Row extends typeof sourceBindingDeliveryCompatibility[number],
> = _Row['apiFamilies'] extends true ?
	ApiFamily
: _Row['apiFamilies'] extends readonly (infer _ApiFamily extends ApiFamily)[] ?
	_ApiFamily
:
	never

type _SourceBindingDeliveryEndpoints<
	_Layout extends SourceBindingDeliveryEndpointLayout,
> = (
	_Layout extends SourceBindingDeliveryEndpointLayout.BrowserDirect ?
		readonly (
			| (_SourceEndpoint<SourceEndpointKind.HttpUrl> & { corsEnabled: true })
			| _SourceEndpoint<SourceEndpointKind.BrowserWalletProvider | SourceEndpointKind.InProcess>
		)[]
	: _Layout extends SourceBindingDeliveryEndpointLayout.HttpOnly ?
		readonly _SourceEndpoint<SourceEndpointKind.HttpUrl>[]
	: _Layout extends SourceBindingDeliveryEndpointLayout.RemoteLiveWebSocket ?
		| readonly [
			_SourceEndpoint<SourceEndpointKind.WebSocketUrl>,
			..._SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],
		]
		| readonly [
			_SourceEndpoint<SourceEndpointKind.HttpUrl>,
			_SourceEndpoint<SourceEndpointKind.WebSocketUrl>,
			..._SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],
		]
	:
		readonly _SourceEndpoint[]
)

type _SourcePublicOrUserCredential = _SourceCredential<
	| SourceCredentialScope.PublicConfig
	| SourceCredentialScope.UserDelegated
>

type _SourceBindingDeliveryCredentials<
	_Layout extends SourceBindingDeliveryCredentialLayout,
> = (
	_Layout extends SourceBindingDeliveryCredentialLayout.PublicOrUser ?
		readonly _SourcePublicOrUserCredential[]
	: _Layout extends SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret ?
		| readonly _SourcePublicOrUserCredential[]
		| readonly [..._SourcePublicOrUserCredential[], _SourceRuntimeSecret]
	:
		readonly _SourceCredential[]
)

type _SourceBindingDelivery<
	_Row extends typeof sourceBindingDeliveryCompatibility[number] = typeof sourceBindingDeliveryCompatibility[number],
> = _Row extends typeof sourceBindingDeliveryCompatibility[number] ? {
	delivery: _Row['deliveries'][number]
	wireProtocol: _SourceBindingDeliveryWireProtocol<_Row>
	apiFamily: _SourceBindingDeliveryApiFamily<_Row>
	endpoints: _SourceBindingDeliveryEndpoints<_Row['endpointLayout']>
	credentials: _SourceBindingDeliveryCredentials<_Row['credentialLayout']>
} : never

export type _SourceBinding = _SourceBindingBase & _SourceBindingCompatibility & _SourceBindingDelivery

export type SourceProviderDefinition<_Provider extends string = string> = {
	provider: _Provider
	label: string
}

export type SourceDefinition<
	_Source extends string = string,
	_Provider extends string = string,
> = {
	source: _Source
	provider: _Provider
	provenance?: string
	label: string
	binding?: _SourceBinding
	bindings?: _SourceBinding[]
}

type _ExactDefinition<_Definition, _Contract> = _Definition & {
	[_Key in Exclude<keyof _Definition, keyof _Contract>]: never
}

export const defineSources = <_Source extends string>() => <const _Providers extends readonly SourceProviderDefinition[]>(providers: _Providers & {
	[_Index in keyof _Providers]: _Providers[_Index] extends SourceProviderDefinition ?
		_ExactDefinition<_Providers[_Index], SourceProviderDefinition>
	:
		_Providers[_Index]
}) => <
	const _Sources extends readonly SourceDefinition<_Source, _Providers[number]['provider']>[],
>(sources: _Sources & {
	[_Index in keyof _Sources]: _Sources[_Index] extends SourceDefinition<_Source, _Providers[number]['provider']> ?
		_ExactDefinition<_Sources[_Index], SourceDefinition<_Source, _Providers[number]['provider']>>
	:
		_Sources[_Index]
}) => ({
	providers,
	sources,
})
