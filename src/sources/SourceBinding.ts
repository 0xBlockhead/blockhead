// Generated from APP.ts.

import type { Caip2NetworkKey, NetworkSlug } from '$/constants/Network.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import type { Type } from 'arktype'

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

export const genericReadOperationGroups = [SourceOperationGroup.GenericRead] as const

export const walletReadAndSignOperationGroups = [
	SourceOperationGroup.WalletAccountRead,
	SourceOperationGroup.WalletSign,
] as const

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

type NonZeroDecimalDigit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Eip155ChainKey = `${NonZeroDecimalDigit}${string}` & `${bigint}`

export type SourceTarget =
	| {
		kind: SourceTargetKind.Caip2Network
		key: Caip2NetworkKey
	}
	| {
		kind: SourceTargetKind.NetworkSlug
		key: NetworkSlug
	}
	| {
		kind: SourceTargetKind.Eip155Chain
		key: Eip155ChainKey
	}
	| {
		kind: Exclude<SourceTargetKind, SourceTargetKind.Caip2Network | SourceTargetKind.NetworkSlug | SourceTargetKind.Eip155Chain>
		key: string
	}

export type SourceEndpoint<
	_Kind extends SourceEndpointKind = SourceEndpointKind,
> = _Kind extends SourceEndpointKind ? {
	endpointKind: _Kind
	locator: string
} & (
	_Kind extends SourceEndpointKind.HttpUrl ? {
		corsEnabled?: boolean
	} : {
		corsEnabled?: never
	}
) : never

export const sourceEndpointOrigin = ({
	endpointKind,
	locator,
}: SourceEndpoint) => (
	endpointKind === SourceEndpointKind.HttpUrl
	&& !locator.startsWith('env:')
	&& URL.canParse(locator) ?
		new URL(locator).origin
	:
		undefined
)

export type SourceArtifact<
	_Kind extends SourceArtifactKind = SourceArtifactKind,
> = _Kind extends SourceArtifactKind ? {
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

export type SourceCredentialRequirement<
	_Scope extends SourceCredentialScope = SourceCredentialScope,
> = _Scope extends SourceCredentialScope ? {
	scope: _Scope
	env?: Type<SourcePublicEnv>
} & (
	_Scope extends SourceCredentialScope.PublicConfig ? {
		keys?: never
	} : {
		keys?: readonly string[]
	}
) : never

type SourceBindingCompatibilityRow<
	_WireProtocol extends WireProtocol,
	_ApiFamily extends ApiFamily,
	_EndpointKind extends SourceEndpointKind,
	_OperationGroup extends SourceOperationGroup,
	_ArtifactKind extends SourceArtifactKind,
> = {
	wireProtocol: _WireProtocol
	apiFamily: _ApiFamily
	endpoints: readonly [
		SourceEndpoint<_EndpointKind>,
		...SourceEndpoint<_EndpointKind>[],
	]
	operationGroups: readonly [
		_OperationGroup,
		..._OperationGroup[],
	]
	artifacts?: [_ArtifactKind] extends [never] ?
		never
	:
		readonly SourceArtifact<_ArtifactKind>[]
}

type SourceBindingCompatibility =
	| SourceBindingCompatibilityRow<
		WireProtocol.Adnl,
		ApiFamily.TonLiteServerAdnl,
		SourceEndpointKind.TcpAddress,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Bencode,
		ApiFamily.BitTorrentClient,
		SourceEndpointKind.LocalFilePath | SourceEndpointKind.TcpAddress,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Bencode,
		ApiFamily.BitTorrentDht | ApiFamily.BitTorrentTracker,
		SourceEndpointKind.UdpAddress,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Canister,
		ApiFamily.IcCanister,
		SourceEndpointKind.CanisterId,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Git,
		ApiFamily.GitObject,
		SourceEndpointKind.HttpUrl | SourceEndpointKind.LocalFilePath,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Graphql,
		ApiFamily.GraphqlHttp,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup.GenericRead,
		SourceArtifactKind.GenerationManifest | SourceArtifactKind.GraphqlSchema | SourceArtifactKind.GraphqlTypes | SourceArtifactKind.HandwrittenTypes
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Grpc,
		ApiFamily.GrpcService,
		SourceEndpointKind.HttpUrl | SourceEndpointKind.TcpAddress,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.HttpRest,
		ApiFamily.AlgodRestApi | ApiFamily.AlgorandIndexerRestApi | ApiFamily.ArweaveGateway | ApiFamily.BitTorrentClient | ApiFamily.BlockscoutRestV2 | ApiFamily.CosmosLcdApi | ApiFamily.EthereumBeaconRest | ApiFamily.EtherscanModuleAction | ApiFamily.FedimintGatewaydApi | ApiFamily.ForgejoRestApi | ApiFamily.GithubContentsApi | ApiFamily.GithubRestApi | ApiFamily.GitlabRestApi | ApiFamily.GitObject | ApiFamily.GoldRushFoundationalApi | ApiFamily.IpfsGateway | ApiFamily.KaspaRestApi | ApiFamily.RestJson | ApiFamily.RosettaApi | ApiFamily.SourcifyRestV2 | ApiFamily.SwarmGateway | ApiFamily.TezosNodeRpc | ApiFamily.TonCenterV3Api,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.HttpRest,
		ApiFamily.NostrRelay,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup.NostrRelayRead,
		SourceArtifactKind.HandwrittenTypes
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.HttpRest,
		ApiFamily.OpenApiHttp,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup.GenericRead | SourceOperationGroup.SoftwareArtifactRegistry,
		SourceArtifactKind.GenerationManifest | SourceArtifactKind.OpenApiSpec | SourceArtifactKind.OpenApiTypes
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.InProcess,
		ApiFamily.BitTorrentDht | ApiFamily.CatalogRows | ApiFamily.WebTorrentApi | ApiFamily.XmtpClientApi,
		SourceEndpointKind.InProcess,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.InProcess,
		ApiFamily.CardanoLocalStateQuery | ApiFamily.LocalParser,
		SourceEndpointKind.LocalProcess,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.JsonRpc2,
		ApiFamily.AcpProtocol | ApiFamily.McpProtocol,
		SourceEndpointKind.LocalProcess,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.JsonRpc2,
		ApiFamily.BitcoinJsonRpc | ApiFamily.CelestiaNodeJsonRpc | ApiFamily.FilecoinLotusJsonRpc | ApiFamily.MetaplexDasJsonRpc | ApiFamily.MoneroDaemonJsonRpc | ApiFamily.StarknetJsonRpc | ApiFamily.SubstrateJsonRpc,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.JsonRpc2,
		ApiFamily.EvmExecutionJsonRpc,
		SourceEndpointKind.HttpUrl | SourceEndpointKind.WebSocketUrl,
		SourceOperationGroup.EvmRpcCore | SourceOperationGroup.EvmRpcSubscribe | SourceOperationGroup.EvmRpcTrace | SourceOperationGroup.EvmRpcTxpool,
		SourceArtifactKind.GenerationManifest | SourceArtifactKind.OpenRpcSpec | SourceArtifactKind.OpenRpcTypes
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.JsonRpc2,
		ApiFamily.JsonRpcApi | ApiFamily.SolanaJsonRpc,
		SourceEndpointKind.HttpUrl | SourceEndpointKind.WebSocketUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.LocalFile,
		ApiFamily.GitObject | ApiFamily.LocalParser | ApiFamily.LocalStateStore,
		SourceEndpointKind.LocalFilePath,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.OciDistribution,
		ApiFamily.OciDistributionApi,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Prometheus,
		ApiFamily.PrometheusText,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.RawHttp,
		ApiFamily.BitTorrentTracker | ApiFamily.CertifiedHttpGateway | ApiFamily.EnvioHyperSyncApi | ApiFamily.RestJson | ApiFamily.SqdPortalStream | ApiFamily.StaticWebsite,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Sql,
		ApiFamily.Postgres,
		SourceEndpointKind.PostgresDsn,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Uri,
		ApiFamily.UriScheme,
		SourceEndpointKind.InProcess,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.WalletProvider,
		ApiFamily.WalletApi,
		SourceEndpointKind.BrowserWalletProvider | SourceEndpointKind.InProcess | SourceEndpointKind.LocalProcess,
		SourceOperationGroup.WalletAccountRead | SourceOperationGroup.WalletSign,
		never
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.WebSocketMessages,
		ApiFamily.BitTorrentTracker,
		SourceEndpointKind.WebSocketUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.WebSocketMessages,
		ApiFamily.NostrRelay,
		SourceEndpointKind.WebSocketUrl,
		SourceOperationGroup.GenericSubscribe | SourceOperationGroup.NostrRelayRead | SourceOperationGroup.NostrSearch,
		SourceArtifactKind.HandwrittenTypes
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Wrpc,
		ApiFamily.KaspaWrpcApi,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Xrpc,
		ApiFamily.AtprotoSync,
		SourceEndpointKind.HttpUrl | SourceEndpointKind.WebSocketUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>
	| SourceBindingCompatibilityRow<
		WireProtocol.Xrpc,
		ApiFamily.XrpcLexicon,
		SourceEndpointKind.HttpUrl,
		SourceOperationGroup,
		SourceArtifactKind
	>

type SourcePublicOrUserCredential = SourceCredentialRequirement<
	| SourceCredentialScope.PublicConfig
	| SourceCredentialScope.UserDelegated
>

type SourceRuntimeSecretRequirement = {
	scope: SourceCredentialScope.RuntimeSecret
	env?: never
	keys?: never
}

type SourcePublicOrUserWithOptionalRuntimeSecret =
	| readonly SourcePublicOrUserCredential[]
	| readonly [
		...SourcePublicOrUserCredential[],
		SourceRuntimeSecretRequirement,
	]

type SourceBindingDelivery =
	| {
		delivery: SourceDelivery.BrowserDirect
		endpoints: readonly (
			| (SourceEndpoint<SourceEndpointKind.HttpUrl> & { corsEnabled: true })
			| SourceEndpoint<SourceEndpointKind.BrowserWalletProvider | SourceEndpointKind.InProcess>
		)[]
		credentials: readonly SourcePublicOrUserCredential[]
	}
	| {
		delivery: SourceDelivery.HttpProxy
		endpoints: readonly SourceEndpoint<SourceEndpointKind.HttpUrl>[]
		credentials: SourcePublicOrUserWithOptionalRuntimeSecret
	}
	| {
		delivery: SourceDelivery.LocalOnly | SourceDelivery.ServerOnly | SourceDelivery.Unsupported
		credentials: readonly SourceCredentialRequirement[]
	}
	| {
		delivery: SourceDelivery.RemoteLive
		wireProtocol: Exclude<WireProtocol, WireProtocol.Grpc>
		endpoints:
			| readonly [
				SourceEndpoint<SourceEndpointKind.WebSocketUrl>,
				...SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],
			]
			| readonly [
				SourceEndpoint<SourceEndpointKind.HttpUrl>,
				SourceEndpoint<SourceEndpointKind.WebSocketUrl>,
				...SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],
			]
		credentials: SourcePublicOrUserWithOptionalRuntimeSecret
	}
	| {
		delivery: SourceDelivery.RemoteLive
		wireProtocol: WireProtocol.Grpc
		apiFamily: ApiFamily.GrpcService
		endpoints: readonly SourceEndpoint<SourceEndpointKind.HttpUrl>[]
		credentials: SourcePublicOrUserWithOptionalRuntimeSecret
	}
	| {
		delivery: SourceDelivery.RemoteQuery
		credentials: readonly SourceCredentialRequirement[]
	}

export type SourceServerCredentialInjection =
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

export type SourceServerCredentialDefinition = {
	envKey: string
	injection: SourceServerCredentialInjection
}

export type SourceBinding<
	_Source extends Source = Source,
> = {
	source: _Source
	target: SourceTarget
} & SourceBindingCompatibility & SourceBindingDelivery

export const sourceBindingId = ({
	source,
	target,
	delivery,
	apiFamily,
}: Pick<
	SourceBinding,
	| 'source'
	| 'target'
	| 'delivery'
	| 'apiFamily'
>) => JSON.stringify([
	source,
	target.kind,
	target.key,
	delivery,
	apiFamily,
])

export type CompleteSourceBindingIndex = {
	readonly [_Source in Source]: readonly [
		SourceBinding<_Source>,
		...SourceBinding<_Source>[],
	]
}

export type SourceBindingIndex = Partial<CompleteSourceBindingIndex>

type SourceBindingFor<
	_Binding extends SourceBinding,
	_Source extends Source,
> = _Binding extends SourceBinding ?
	_Binding['source'] extends _Source ?
		_Binding
	: _Source extends _Binding['source'] ?
		_Binding & SourceBinding<_Source>
	:
		never
:
	never

type IsUnion<
	_Value,
	_Whole = _Value,
> = _Value extends _Whole ?
	[_Whole] extends [_Value] ? false : true
:
	never

type SourceBindingTupleHasWidenedSource<
	_Bindings extends readonly SourceBinding[],
> = _Bindings extends readonly [
	infer _Binding extends SourceBinding,
	...infer _Remaining extends readonly SourceBinding[],
] ?
	IsUnion<_Binding['source']> extends true ?
		true
	:
		SourceBindingTupleHasWidenedSource<_Remaining>
:
	false

type SourceBindingsFor<
	_Bindings extends readonly SourceBinding[],
	_Source extends Source,
	_Matches extends readonly SourceBinding[] = [],
> = number extends _Bindings['length'] ?
	_Matches extends readonly [SourceBinding, ...SourceBinding[]] ?
		readonly [
			..._Matches,
			...SourceBindingFor<_Bindings[number], _Source>[],
		]
	:
		readonly [
			SourceBindingFor<_Bindings[number], _Source>,
			...SourceBindingFor<_Bindings[number], _Source>[],
		]
: _Bindings extends readonly [
	infer _Binding extends SourceBinding,
	...infer _Remaining extends readonly SourceBinding[],
] ?
	SourceBindingsFor<
		_Remaining,
		_Source,
		_Binding['source'] extends _Source ?
			readonly [..._Matches, _Binding]
		:
			_Matches
	>
:
	_Matches

type SourceBindingIndexFrom<
	_Bindings extends readonly SourceBinding[],
> = _Bindings extends readonly [infer _First extends SourceBinding, ...SourceBinding[]] ?
	number extends _Bindings['length'] ?
		IsUnion<_First['source']> extends true ?
			Partial<{
				readonly [_Source in _Bindings[number]['source']]:
					SourceBindingsFor<_Bindings, _Source>
			}>
		:
			{
				readonly [_Source in _First['source']]:
					SourceBindingsFor<_Bindings, _Source>
			} & Partial<{
				readonly [_Source in Exclude<_Bindings[number]['source'], _First['source']>]:
					SourceBindingsFor<_Bindings, _Source>
			}>
	: SourceBindingTupleHasWidenedSource<_Bindings> extends true ?
		Partial<{
			readonly [_Source in _Bindings[number]['source']]: readonly [
				SourceBindingFor<_Bindings[number], _Source>,
				...SourceBindingFor<_Bindings[number], _Source>[],
			]
		}>
	:
		{
			readonly [_Source in _Bindings[number]['source']]:
				SourceBindingsFor<_Bindings, _Source>
		}
:
	Partial<{
		readonly [_Source in _Bindings[number]['source']]:
			SourceBindingsFor<_Bindings, _Source>
	}>

// Native map/flatMap erase the nonempty target catalogs authored by APP.ts.
// These overloads retain that cardinality so indexed source keys stay required.
type SourceBindingsFromRows<
	_Rows extends readonly unknown[],
	_Binding extends SourceBinding,
> = {
	readonly [_Index in keyof _Rows]: _Binding
}

export function mapSourceBindings<
	const _Rows extends readonly [unknown, ...unknown[]],
	const _Binding extends SourceBinding,
>(
	rows: _Rows,
	bindingFromRow: (row: _Rows[number]) => _Binding
): SourceBindingsFromRows<_Rows, _Binding>
export function mapSourceBindings<_Row>(
	rows: readonly _Row[],
	bindingFromRow: (row: _Row) => SourceBinding
): readonly SourceBinding[] {
	return rows.map(bindingFromRow)
}
export function flatMapSourceBindings<
	const _Rows extends readonly [unknown, ...unknown[]],
	const _Bindings extends readonly [SourceBinding, ...SourceBinding[]],
>(
	rows: _Rows,
	bindingsFromRow: (row: _Rows[number]) => _Bindings
): readonly [
	..._Bindings,
	..._Bindings[number][],
]
export function flatMapSourceBindings<_Row>(
	rows: readonly _Row[],
	bindingsFromRow: (row: _Row) => readonly SourceBinding[]
): readonly SourceBinding[] {
	return rows.flatMap(bindingsFromRow)
}

export function indexSourceBindings<
	const _Bindings extends readonly SourceBinding[],
>(
	bindings: _Bindings
): SourceBindingIndexFrom<_Bindings>
export function indexSourceBindings(
	bindings: readonly SourceBinding[]
): Partial<Record<Source, readonly SourceBinding[]>> {
	if (bindings.length === 0)
		throw new Error('Source binding indexes must contain at least one binding')
	if (new Set(bindings.map(sourceBindingId)).size !== bindings.length)
		throw new Error('Source binding indexes must not contain duplicate stable identities')

	return Object.groupBy(bindings, ({ source }) => source)
}
