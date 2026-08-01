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
	EthereumBeaconRest = 'EthereumBeaconRest',
	EtherscanModuleAction = 'EtherscanModuleAction',
	EnvioHyperSyncApi = 'EnvioHyperSyncApi',
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
	MetaplexDasJsonRpc = 'MetaplexDasJsonRpc',
	McpProtocol = 'McpProtocol',
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

export type SourceEndpoint = {
	endpointKind: SourceEndpointKind
	locator: string
	corsEnabled?: boolean
}

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

type SourceArtifactBase = {
	kind: SourceArtifactKind
	path: string
	generated?: true
}

export type SourceArtifact =
	| SourceArtifactBase & {
		kind: SourceArtifactKind.HandwrittenTypes
		referenceUrl?: string
		officialUrl?: never
	}
	| SourceArtifactBase & {
		kind: Exclude<SourceArtifactKind, SourceArtifactKind.HandwrittenTypes>
		officialUrl?: string
		referenceUrl?: never
	}

export type SourceCredentialRequirement =
	| {
		scope: SourceCredentialScope.PublicConfig
		env?: Type<SourcePublicEnv>
		keys?: never
	}
	| {
		scope: Exclude<SourceCredentialScope, SourceCredentialScope.PublicConfig>
		env?: Type<SourcePublicEnv>
		keys?: readonly string[]
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
	endpoints: readonly SourceEndpoint[]
	wireProtocol: WireProtocol
	apiFamily: ApiFamily
	operationGroups: readonly SourceOperationGroup[]
	delivery: SourceDelivery
	credentials: readonly SourceCredentialRequirement[]
	artifacts?: readonly SourceArtifact[]
}

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

export type SourceBindingIndex = {
	readonly [_Source in Source]?:
		| SourceBinding<_Source>
		| readonly SourceBinding<_Source>[]
}

type SourceBindingsFor<
	_Bindings extends readonly SourceBinding[],
	_Source extends Source,
	_Matches extends readonly SourceBinding[] = [],
> = number extends _Bindings['length'] ?
	readonly Extract<_Bindings[number], SourceBinding<_Source>>[]
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
	_Matches extends readonly [infer _Binding extends SourceBinding] ?
		_Binding
	:
		_Matches

type SourceBindingIndexFrom<
	_Bindings extends readonly SourceBinding[],
> = {
	readonly [_Source in _Bindings[number]['source']]:
		SourceBindingsFor<_Bindings, _Source>
}

export function indexSourceBindings<
	const _Bindings extends readonly SourceBinding[],
>(
	bindings: _Bindings
): SourceBindingIndexFrom<_Bindings>
export function indexSourceBindings(
	bindings: readonly SourceBinding[]
): SourceBindingIndex {
	return Object.fromEntries(
		Object.entries(Object.groupBy(bindings, ({ source }) => source))
			.map(([source, sourceBindings]) => [
				source,
				sourceBindings.length === 1 ? sourceBindings[0] : sourceBindings,
			])
	)
}
