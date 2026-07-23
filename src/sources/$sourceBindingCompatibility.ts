// Generated from APP.ts. Do not edit by hand.

import { ApiFamily, SourceArtifactKind, SourceEndpointKind, SourceOperationGroup, WireProtocol } from './SourceBinding.ts'

export const sourceBindingCompatibility = [
	{
		wireProtocol: WireProtocol.Adnl,
		apiFamilies: [
			ApiFamily.TonLiteServerAdnl,
		],
		endpointKinds: [
			SourceEndpointKind.TcpAddress,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Bencode,
		apiFamilies: [
			ApiFamily.BitTorrentClient,
		],
		endpointKinds: [
			SourceEndpointKind.LocalFilePath,
			SourceEndpointKind.TcpAddress,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Bencode,
		apiFamilies: [
			ApiFamily.BitTorrentDht,
			ApiFamily.BitTorrentTracker,
		],
		endpointKinds: [
			SourceEndpointKind.UdpAddress,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Canister,
		apiFamilies: [
			ApiFamily.IcCanister,
		],
		endpointKinds: [
			SourceEndpointKind.CanisterId,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Git,
		apiFamilies: [
			ApiFamily.GitObject,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
			SourceEndpointKind.LocalFilePath,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Graphql,
		apiFamilies: [
			ApiFamily.GraphqlHttp,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		artifactKinds: [
			SourceArtifactKind.GenerationManifest,
			SourceArtifactKind.GraphqlSchema,
			SourceArtifactKind.GraphqlTypes,
			SourceArtifactKind.HandwrittenTypes,
		],
	},
	{
		wireProtocol: WireProtocol.Grpc,
		apiFamilies: [
			ApiFamily.GrpcService,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
			SourceEndpointKind.TcpAddress,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.HttpRest,
		apiFamilies: [
			ApiFamily.A2aProtocol,
			ApiFamily.ArweaveGateway,
			ApiFamily.AvailExplorerApi,
			ApiFamily.BitTorrentClient,
			ApiFamily.BlockscoutRestV2,
			ApiFamily.CosmosLcdApi,
			ApiFamily.DydxIndexerRest,
			ApiFamily.EthereumBeaconRest,
			ApiFamily.EtherscanModuleAction,
			ApiFamily.FedimintGatewaydApi,
			ApiFamily.ForgejoRestApi,
			ApiFamily.GitObject,
			ApiFamily.GithubContentsApi,
			ApiFamily.GithubRestApi,
			ApiFamily.GitlabRestApi,
			ApiFamily.GoldRushFoundationalApi,
			ApiFamily.IpfsGateway,
			ApiFamily.KaspaRestApi,
			ApiFamily.NostrRelay,
			ApiFamily.RestJson,
			ApiFamily.RosettaApi,
			ApiFamily.SigstoreRekorApi,
			ApiFamily.SourcifyRestV2,
			ApiFamily.SwarmGateway,
			ApiFamily.TezosNodeRpc,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.HttpRest,
		apiFamilies: [
			ApiFamily.OpenApiHttp,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		artifactKinds: [
			SourceArtifactKind.GenerationManifest,
			SourceArtifactKind.OpenApiSpec,
			SourceArtifactKind.OpenApiTypes,
		],
	},
	{
		wireProtocol: WireProtocol.InProcess,
		apiFamilies: [
			ApiFamily.BitTorrentDht,
			ApiFamily.CatalogRows,
			ApiFamily.LocalStateStore,
			ApiFamily.WebTorrentApi,
			ApiFamily.XmtpClientApi,
		],
		endpointKinds: [
			SourceEndpointKind.InProcess,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.InProcess,
		apiFamilies: [
			ApiFamily.CardanoLocalStateQuery,
			ApiFamily.LocalParser,
		],
		endpointKinds: [
			SourceEndpointKind.LocalProcess,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamilies: [
			ApiFamily.AcpProtocol,
			ApiFamily.McpProtocol,
		],
		endpointKinds: [
			SourceEndpointKind.LocalProcess,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamilies: [
			ApiFamily.BitcoinJsonRpc,
			ApiFamily.CelestiaNodeJsonRpc,
			ApiFamily.FilecoinLotusJsonRpc,
			ApiFamily.MoneroDaemonJsonRpc,
			ApiFamily.StarknetJsonRpc,
			ApiFamily.SubstrateJsonRpc,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamilies: [
			ApiFamily.JsonRpcApi,
			ApiFamily.SolanaJsonRpc,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
			SourceEndpointKind.WebSocketUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamilies: [
			ApiFamily.NostrRelay,
		],
		endpointKinds: [
			SourceEndpointKind.WebSocketUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamilies: [
			ApiFamily.EvmExecutionJsonRpc,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
			SourceEndpointKind.WebSocketUrl,
		],
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
			SourceOperationGroup.EvmRpcSubscribe,
			SourceOperationGroup.EvmRpcTrace,
			SourceOperationGroup.EvmRpcTxpool,
		],
		artifactKinds: [
			SourceArtifactKind.GenerationManifest,
			SourceArtifactKind.OpenRpcSpec,
			SourceArtifactKind.OpenRpcTypes,
		],
	},
	{
		wireProtocol: WireProtocol.LocalFile,
		apiFamilies: [
			ApiFamily.GitObject,
			ApiFamily.LocalParser,
			ApiFamily.LocalStateStore,
		],
		endpointKinds: [
			SourceEndpointKind.LocalFilePath,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.OciDistribution,
		apiFamilies: [
			ApiFamily.OciDistributionApi,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Prometheus,
		apiFamilies: [
			ApiFamily.PrometheusText,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.RawHttp,
		apiFamilies: [
			ApiFamily.BitTorrentTracker,
			ApiFamily.CertifiedHttpGateway,
			ApiFamily.EnvioHyperSyncApi,
			ApiFamily.RestJson,
			ApiFamily.SqdPortalStream,
			ApiFamily.StaticWebsite,
			ApiFamily.X402Protocol,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Sql,
		apiFamilies: [
			ApiFamily.Postgres,
		],
		endpointKinds: [
			SourceEndpointKind.PostgresDsn,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Uri,
		apiFamilies: [
			ApiFamily.UriScheme,
		],
		endpointKinds: [
			SourceEndpointKind.InProcess,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.WalletProvider,
		apiFamilies: [
			ApiFamily.WalletApi,
		],
		endpointKinds: [
			SourceEndpointKind.BrowserWalletProvider,
			SourceEndpointKind.InProcess,
			SourceEndpointKind.LocalProcess,
		],
		operationGroups: [
			SourceOperationGroup.WalletAccountRead,
			SourceOperationGroup.WalletSign,
		],
		artifactKinds: [],
	},
	{
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamilies: [
			ApiFamily.BitTorrentTracker,
		],
		endpointKinds: [
			SourceEndpointKind.WebSocketUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Wrpc,
		apiFamilies: [
			ApiFamily.KaspaWrpcApi,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Xrpc,
		apiFamilies: [
			ApiFamily.AtprotoSync,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
			SourceEndpointKind.WebSocketUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
	{
		wireProtocol: WireProtocol.Xrpc,
		apiFamilies: [
			ApiFamily.XrpcLexicon,
		],
		endpointKinds: [
			SourceEndpointKind.HttpUrl,
		],
		operationGroups: true,
		artifactKinds: true,
	},
] as const
