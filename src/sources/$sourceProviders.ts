// Generated from APP.ts. Do not edit by hand.

import { Source } from './Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol } from './SourceBinding.ts'
import { SourceProvider, type SourceProviderDefinition } from './SourceProvider.ts'
import { type as arktype } from 'arktype'

export const sourceProviderDefinitions: readonly SourceProviderDefinition[] = [
	{
		provider: SourceProvider.A2a,
		label: 'Agent2Agent',
		sources: [
			{
				provider: SourceProvider.A2a,
				source: Source.A2aWellKnown_Http,
				label: 'A2A well-known agent card',
			},
			{
				provider: SourceProvider.A2a,
				source: Source.A2aService_Http,
				label: 'A2A service HTTP',
			},
		],
		bindings: [
			{
				provider: SourceProvider.A2a,
				source: Source.A2aWellKnown_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'a2a-well-known',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{origin}/.well-known/agent.json',
						origin: 'https://{origin}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.A2aProtocol,
				operationGroups: [
					SourceOperationGroup.AgentCapabilityCatalog,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/A2a/Http/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.A2a,
				source: Source.A2aService_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'a2a-service',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{origin}/{agent-path}',
						origin: 'https://{origin}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.A2aProtocol,
				operationGroups: [
					SourceOperationGroup.AgentRuntimeInvocation,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/A2a/Http/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{origin}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Acp,
		label: 'Agent Client Protocol',
		sources: [
			{
				provider: SourceProvider.Acp,
				source: Source.AcpLocal_JsonRpc,
				label: 'ACP local JSON-RPC',
			},
			{
				provider: SourceProvider.Acp,
				source: Source.AcpRegistry_Rest,
				label: 'ACP registry REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Acp,
				source: Source.AcpLocal_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'acp-local',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'acp',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.AcpProtocol,
				operationGroups: [
					SourceOperationGroup.AgentCapabilityCatalog,
					SourceOperationGroup.AgentRuntimeInvocation,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Acp,
				source: Source.AcpRegistry_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'acp-registry',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
						origin: 'https://cdn.agentclientprotocol.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AgentCapabilityCatalog,
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Acp/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://cdn.agentclientprotocol.com',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Across,
		label: 'Across',
		sources: [
			{
				provider: SourceProvider.Across,
				source: Source.Across_Rest,
				label: 'Across REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Across,
				source: Source.Across_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'across-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://app.across.to',
						origin: 'https://app.across.to',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Across_Rest-4',
			},
		],
	},
	{
		provider: SourceProvider.Algod,
		label: 'Algod',
		sources: [
			{
				provider: SourceProvider.Algod,
				source: Source.Algod_Rest,
				label: 'Algod REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Algod,
				source: Source.Algod_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{algod-api-host}',
						origin: 'https://{algod-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AlgorandIndexer,
		label: 'Algorand Indexer',
		sources: [
			{
				provider: SourceProvider.AlgorandIndexer,
				source: Source.AlgorandIndexer_Rest,
				label: 'Algorand Indexer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AlgorandIndexer,
				source: Source.AlgorandIndexer_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{algorand-indexer-api-host}',
						origin: 'https://{algorand-indexer-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AlgorandWallet,
		label: 'Algorand wallet',
		sources: [
			{
				provider: SourceProvider.AlgorandWallet,
				source: Source.AlgorandWallet_WalletApi,
				label: 'Algorand wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AlgorandWallet,
				source: Source.AlgorandWallet_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'algorand-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'algorand',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Allium,
		label: 'Allium',
		env: arktype({
			'PUBLIC_ALLIUM_API_KEY': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.Allium,
				source: Source.Allium_Rest,
				label: 'Allium REST',
				env: arktype({
					'PUBLIC_ALLIUM_API_KEY': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Allium,
				source: Source.Allium_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.allium.so',
						origin: 'https://api.allium.so',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_ALLIUM_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_ALLIUM_API_KEY',
						],
					},
				],
				proxyId: 'Allium_Rest-8',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Allium/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Amboss,
		label: 'Amboss',
		sources: [
			{
				provider: SourceProvider.Amboss,
				source: Source.Amboss_Graphql,
				label: 'Amboss Space GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Amboss,
				source: Source.Amboss_Graphql,
				target: {
					kind: SourceTargetKind.Global,
					key: 'amboss-space',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.amboss.space/graphql',
						origin: 'https://api.amboss.space',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'AMBOSS_API_KEY',
						],
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.GraphqlSchema,
						path: 'src/sources/Amboss/Graphql/schema.graphql',
						generated: true,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Amboss/Graphql/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GraphqlTypes,
						path: 'src/sources/Amboss/Graphql/graphql-env.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Anthropic,
		label: 'Anthropic',
		sources: [
			{
				provider: SourceProvider.Anthropic,
				source: Source.Anthropic_Rest,
				label: 'Anthropic REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Anthropic,
				source: Source.Anthropic_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'anthropic-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.anthropic.com',
						origin: 'https://api.anthropic.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'ANTHROPIC_API_KEY',
						],
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.anthropic.com',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.AptosAip62,
		label: 'Aptos AIP-62',
		sources: [
			{
				provider: SourceProvider.AptosAip62,
				source: Source.AptosAip62_WalletApi,
				label: 'Aptos AIP-62 wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AptosAip62,
				source: Source.AptosAip62_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'aptos-aip62-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'aptos',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AptosFullnode,
		label: 'Aptos fullnode',
		sources: [
			{
				provider: SourceProvider.AptosFullnode,
				source: Source.AptosFullnode_Rest,
				label: 'Aptos fullnode REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AptosFullnode,
				source: Source.AptosFullnode_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'aptos:1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://fullnode.mainnet.aptoslabs.com/v1/',
						origin: 'https://fullnode.mainnet.aptoslabs.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'AptosFullnode_Rest-12',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/AptosFullnode/OpenApi/spec.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/AptosFullnode/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/AptosFullnode/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AptosIndexer,
		label: 'Aptos Indexer',
		sources: [
			{
				provider: SourceProvider.AptosIndexer,
				source: Source.AptosIndexer_Graphql,
				label: 'Aptos Indexer GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AptosIndexer,
				source: Source.AptosIndexer_Graphql,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'aptos:1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.mainnet.aptoslabs.com/v1/graphql',
						origin: 'https://api.mainnet.aptoslabs.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'AptosIndexer_Graphql-13',
				artifacts: [
					{
						kind: SourceArtifactKind.GraphqlSchema,
						path: 'src/sources/AptosIndexer/Graphql/schema.graphql',
						generated: true,
						officialUrl: 'https://api.mainnet.aptoslabs.com/v1/graphql',
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/AptosIndexer/Graphql/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GraphqlTypes,
						path: 'src/sources/AptosIndexer/Graphql/graphql-env.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Arweave,
		label: 'Arweave',
		sources: [
			{
				provider: SourceProvider.Arweave,
				source: Source.Arweave_Rest,
				label: 'Arweave Gateway',
			},
			{
				provider: SourceProvider.Arweave,
				source: Source.Arweave_Graphql,
				label: 'Arweave GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Arweave,
				source: Source.Arweave_Rest,
				target: {
					kind: SourceTargetKind.ContentAddressScheme,
					key: 'arweave',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://arweave.net',
						origin: 'https://arweave.net',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ar-io.net',
						origin: 'https://ar-io.net',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.ArweaveGateway,
				operationGroups: [
					SourceOperationGroup.ContentGatewayRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Arweave/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Arweave,
				source: Source.Arweave_Graphql,
				target: {
					kind: SourceTargetKind.ContentAddressScheme,
					key: 'arweave',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://arweave.net/graphql',
						origin: 'https://arweave.net',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AtprotoBsky,
		label: 'ATProto (Bsky public appview)',
		sources: [
			{
				provider: SourceProvider.AtprotoBsky,
				source: Source.Atproto_Xrpc,
				label: 'ATProto XRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AtprotoBsky,
				source: Source.Atproto_Xrpc,
				target: {
					kind: SourceTargetKind.Global,
					key: 'bsky-public-appview',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://public.api.bsky.app',
						origin: 'https://public.api.bsky.app',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Xrpc,
				apiFamily: ApiFamily.XrpcLexicon,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Atproto_Xrpc-16',
				artifacts: [
					{
						kind: SourceArtifactKind.Lexicon,
						path: 'src/sources/AtprotoBsky/Lexicon',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/AtprotoBsky/Lexicon/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AtprotoBskySocial,
		label: 'ATProto (Bsky social appview)',
		sources: [
			{
				provider: SourceProvider.AtprotoBskySocial,
				source: Source.Atproto_BskySocial_Xrpc,
				label: 'ATProto Bsky Social XRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AtprotoBskySocial,
				source: Source.Atproto_BskySocial_Xrpc,
				target: {
					kind: SourceTargetKind.Global,
					key: 'bsky-social-appview',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://bsky.social',
						origin: 'https://bsky.social',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Xrpc,
				apiFamily: ApiFamily.XrpcLexicon,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Atproto_BskySocial_Xrpc-17',
				artifacts: [
					{
						kind: SourceArtifactKind.Lexicon,
						path: 'src/sources/AtprotoBskySocial/Lexicon',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/AtprotoBskySocial/Lexicon/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AtprotoSync,
		label: 'AT Protocol sync',
		sources: [
			{
				provider: SourceProvider.AtprotoSync,
				source: Source.AtprotoSync_Xrpc,
				label: 'AT Protocol sync XRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AtprotoSync,
				source: Source.AtprotoSync_Xrpc,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'atproto-sync',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{pds-host}',
						origin: 'https://{pds-host}',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://{pds-host}/xrpc/com.atproto.sync.subscribeRepos',
					},
				],
				wireProtocol: WireProtocol.Xrpc,
				apiFamily: ApiFamily.AtprotoSync,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{pds-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Avail,
		label: 'Avail',
		sources: [
			{
				provider: SourceProvider.Avail,
				source: Source.Avail_JsonRpc,
				label: 'Avail JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Avail,
				source: Source.Avail_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'avail',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{avail-rpc-host}',
						origin: 'https://{avail-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.SubstrateJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AvailExplorer,
		label: 'Avail Explorer',
		sources: [
			{
				provider: SourceProvider.AvailExplorer,
				source: Source.AvailExplorer_Rest,
				label: 'Avail Explorer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AvailExplorer,
				source: Source.AvailExplorer_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'avail',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{avail-explorer-api-host}',
						origin: 'https://{avail-explorer-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.AvailExplorerApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.AvalancheInfo,
		label: 'Avalanche Info API',
		sources: [
			{
				provider: SourceProvider.AvalancheInfo,
				source: Source.AvalancheInfo_JsonRpc,
				label: 'Avalanche Info JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AvalancheInfo,
				source: Source.AvalancheInfo_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'avalanche-p-chain',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.avax.network/ext/info',
						origin: 'https://api.avax.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'AvalancheInfo_JsonRpc-21',
			},
		],
	},
	{
		provider: SourceProvider.AvalanchePlatformVm,
		label: 'Avalanche PlatformVM',
		sources: [
			{
				provider: SourceProvider.AvalanchePlatformVm,
				source: Source.AvalanchePlatformVm_JsonRpc,
				label: 'Avalanche PlatformVM JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AvalanchePlatformVm,
				source: Source.AvalanchePlatformVm_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'avalanche-p-chain',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.avax.network/ext/bc/P',
						origin: 'https://api.avax.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'AvalanchePlatformVm_JsonRpc-22',
			},
		],
	},
	{
		provider: SourceProvider.Avascan,
		label: 'Avascan',
		sources: [
			{
				provider: SourceProvider.Avascan,
				source: Source.Avascan_Rest,
				label: 'Avascan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Avascan,
				source: Source.Avascan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'avascan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.avascan.info',
						origin: 'https://api.avascan.info',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Avascan_Rest-23',
			},
		],
	},
	{
		provider: SourceProvider.AwsBedrock,
		label: 'AWS Bedrock',
		sources: [
			{
				provider: SourceProvider.AwsBedrock,
				source: Source.AwsBedrock_Rest,
				label: 'AWS Bedrock REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AwsBedrock,
				source: Source.AwsBedrock_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'aws-bedrock',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:AWS_BEDROCK_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'AWS_ACCESS_KEY_ID',
							'AWS_SECRET_ACCESS_KEY',
							'AWS_BEDROCK_REGION',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Axelarscan,
		label: 'Axelarscan',
		sources: [
			{
				provider: SourceProvider.Axelarscan,
				source: Source.Axelarscan_Rest,
				label: 'Axelarscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Axelarscan,
				source: Source.Axelarscan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'axelarscan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.axelarscan.io',
						origin: 'https://api.axelarscan.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Axelarscan_Rest-25',
			},
		],
	},
	{
		provider: SourceProvider.AzureAiFoundry,
		label: 'Azure AI Foundry',
		sources: [
			{
				provider: SourceProvider.AzureAiFoundry,
				source: Source.AzureAiFoundry_Rest,
				label: 'Azure AI Foundry REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.AzureAiFoundry,
				source: Source.AzureAiFoundry_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'azure-ai-foundry',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:AZURE_AI_FOUNDRY_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'AZURE_AI_FOUNDRY_API_KEY',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Beacon,
		label: 'Beacon',
		sources: [
			{
				provider: SourceProvider.Beacon,
				source: Source.Beacon_Rest,
				label: 'Beacon (consensus) REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Beacon,
				source: Source.Beacon_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum-beacon-api.publicnode.com',
						origin: 'https://ethereum-beacon-api.publicnode.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EthereumBeaconRest,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Beacon/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
			{
				provider: SourceProvider.Beacon,
				source: Source.Beacon_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum-sepolia-beacon-api.publicnode.com',
						origin: 'https://ethereum-sepolia-beacon-api.publicnode.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EthereumBeaconRest,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Beacon/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
			{
				provider: SourceProvider.Beacon,
				source: Source.Beacon_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '17000',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum-holesky-beacon-api.publicnode.com',
						origin: 'https://ethereum-holesky-beacon-api.publicnode.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EthereumBeaconRest,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Beacon/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.BeaconchaIn,
		label: 'Beaconcha.in',
		env: arktype({
			'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.BeaconchaIn,
				source: Source.BeaconchaIn_Rest,
				label: 'Beaconcha.in REST',
				env: arktype({
					'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.BeaconchaIn,
				source: Source.BeaconchaIn_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://beaconcha.in/api/v1',
						origin: 'https://beaconcha.in',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
				proxyId: 'BeaconchaIn_Rest-30',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/BeaconchaIn/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.BeaconchaIn,
				source: Source.BeaconchaIn_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '17000',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://holesky.beaconcha.in/api/v1',
						origin: 'https://holesky.beaconcha.in',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
				proxyId: 'BeaconchaIn_Rest-31',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/BeaconchaIn/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.BeaconchaIn,
				source: Source.BeaconchaIn_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '560048',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hoodi.beaconcha.in/api/v1',
						origin: 'https://hoodi.beaconcha.in',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
				proxyId: 'BeaconchaIn_Rest-32',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/BeaconchaIn/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.BetterCallDev,
		label: 'Better Call Dev',
		sources: [
			{
				provider: SourceProvider.BetterCallDev,
				source: Source.BetterCallDev_Rest,
				label: 'Better Call Dev REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BetterCallDev,
				source: Source.BetterCallDev_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'better-call-dev-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.better-call.dev',
						origin: 'https://api.better-call.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BetterCallDev_Rest-33',
			},
		],
		origins: [
			{
				origin: 'https://api.better-call.dev',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.BigDipper,
		label: 'Big Dipper',
		sources: [
			{
				provider: SourceProvider.BigDipper,
				source: Source.BigDipper_Rest,
				label: 'Big Dipper REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BigDipper,
				source: Source.BigDipper_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'big-dipper-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.bigdipper.live',
						origin: 'https://api.bigdipper.live',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BigDipper_Rest-34',
			},
		],
	},
	{
		provider: SourceProvider.BinanceChainApi,
		label: 'Binance Chain API',
		sources: [
			{
				provider: SourceProvider.BinanceChainApi,
				source: Source.BinanceChainApi_Rest,
				label: 'Binance Chain API REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BinanceChainApi,
				source: Source.BinanceChainApi_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'binance-chain-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://dex.binance.org',
						origin: 'https://dex.binance.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BinanceChainApi_Rest-35',
			},
		],
	},
	{
		provider: SourceProvider.BinanceChainExplorer,
		label: 'Binance Chain Explorer',
		sources: [
			{
				provider: SourceProvider.BinanceChainExplorer,
				source: Source.BinanceChainExplorer_Rest,
				label: 'Binance Chain Explorer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BinanceChainExplorer,
				source: Source.BinanceChainExplorer_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'binance-chain-explorer',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://explorer.binance.org',
						origin: 'https://explorer.binance.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BinanceChainExplorer_Rest-36',
			},
		],
	},
	{
		provider: SourceProvider.BitcoinBips,
		label: 'Bitcoin BIPs',
		sources: [
			{
				provider: SourceProvider.BitcoinBips,
				source: Source.BitcoinBips_Github,
				label: 'Bitcoin BIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitcoinBips,
				source: Source.BitcoinBips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'bitcoin/bips@master:',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.BitcoinCashBcmr,
		label: 'Bitcoin Cash Metadata Registries',
		sources: [
			{
				provider: SourceProvider.BitcoinCashBcmr,
				source: Source.BitcoinCashBcmr_Github,
				label: 'Bitcoin Cash BCMR GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitcoinCashBcmr,
				source: Source.BitcoinCashBcmr_Github,
				target: {
					kind: SourceTargetKind.Global,
					key: 'BitcoinCashBcmr',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.BitcoinCashChips,
		label: 'Bitcoin Cash CHIPs',
		sources: [
			{
				provider: SourceProvider.BitcoinCashChips,
				source: Source.BitcoinCashChips_Gitlab,
				label: 'Bitcoin Cash CHIPs GitLab',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitcoinCashChips,
				source: Source.BitcoinCashChips_Gitlab,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'gitlab:23431309@master:',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gitlab.com',
						origin: 'https://gitlab.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GitObject,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BitcoinCashChips_Gitlab-39',
			},
		],
		origins: [
			{
				origin: 'https://gitlab.com',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.BitcoinCashNode,
		label: 'Bitcoin Cash Node',
		sources: [
			{
				provider: SourceProvider.BitcoinCashNode,
				source: Source.BitcoinCashNode_JsonRpc,
				label: 'Bitcoin Cash Node JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitcoinCashNode,
				source: Source.BitcoinCashNode_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:000000000000000000651ef99cb9fcbe',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8332',
						origin: 'http://127.0.0.1:8332',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.BitcoinCore,
		label: 'Bitcoin Core',
		sources: [
			{
				provider: SourceProvider.BitcoinCore,
				source: Source.BitcoinCore_JsonRpc,
				label: 'Bitcoin Core JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitcoinCore,
				source: Source.BitcoinCore_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:000000000019d6689c085ae165831e93',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8332',
						origin: 'http://127.0.0.1:8332',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Bithomp,
		label: 'Bithomp',
		sources: [
			{
				provider: SourceProvider.Bithomp,
				source: Source.Bithomp_Rest,
				label: 'Bithomp REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Bithomp,
				source: Source.Bithomp_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'bithomp-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://bithomp.com',
						origin: 'https://bithomp.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Bithomp_Rest-42',
			},
		],
	},
	{
		provider: SourceProvider.Bittensor,
		label: 'Bittensor',
		sources: [
			{
				provider: SourceProvider.Bittensor,
				source: Source.Bittensor_JsonRpc,
				label: 'Bittensor JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Bittensor,
				source: Source.Bittensor_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'bittensor',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://entrypoint-finney.opentensor.ai',
						origin: 'https://entrypoint-finney.opentensor.ai',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://lite.chain.opentensor.ai',
						origin: 'https://lite.chain.opentensor.ai',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.SubstrateJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Bittensor_JsonRpc-43',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Bittensor/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		label: 'BitTorrent',
		sources: [
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrentMetainfo_File,
				label: 'BitTorrent metainfo file',
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_HttpTracker,
				label: 'BitTorrent HTTP tracker',
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_UdpTracker,
				label: 'BitTorrent UDP tracker',
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_MainlineDht,
				label: 'BitTorrent Mainline DHT',
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_MetadataExchange,
				label: 'BitTorrent metadata exchange',
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_PeerWire,
				label: 'BitTorrent peer wire',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrentMetainfo_File,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'metainfo-file',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: '{torrent-file-path}',
					},
				],
				wireProtocol: WireProtocol.Bencode,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_HttpTracker,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'http-tracker',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{tracker-host}/announce',
						origin: 'https://{tracker-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.BitTorrentTracker,
				operationGroups: [
					SourceOperationGroup.BitTorrentAnnounce,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_UdpTracker,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'udp-tracker',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.UdpAddress,
						locator: 'udp://{tracker-host}:{port}',
					},
				],
				wireProtocol: WireProtocol.Bencode,
				apiFamily: ApiFamily.BitTorrentTracker,
				operationGroups: [
					SourceOperationGroup.BitTorrentAnnounce,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_MainlineDht,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'mainline-dht',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.UdpAddress,
						locator: 'udp://{bootstrap-node}:{port}',
					},
				],
				wireProtocol: WireProtocol.Bencode,
				apiFamily: ApiFamily.BitTorrentDht,
				operationGroups: [
					SourceOperationGroup.BitTorrentDhtLookup,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_MetadataExchange,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'metadata-exchange',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: '{peer-host}:{port}',
					},
				],
				wireProtocol: WireProtocol.Bencode,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.BitTorrent,
				source: Source.BitTorrent_PeerWire,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'peer-wire',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: '{peer-host}:{port}',
					},
				],
				wireProtocol: WireProtocol.Bencode,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Blobscan,
		label: 'Blobscan',
		sources: [
			{
				provider: SourceProvider.Blobscan,
				source: Source.Blobscan_Rest,
				label: 'Blobscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Blobscan,
				source: Source.Blobscan_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.blobscan.com',
						origin: 'https://api.blobscan.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blobscan_Rest-50',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Blobscan/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Blobscan,
				source: Source.Blobscan_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.sepolia.blobscan.com',
						origin: 'https://api.sepolia.blobscan.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blobscan_Rest-51',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Blobscan/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Blobscan,
				source: Source.Blobscan_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '100',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.gnosis.blobscan.com',
						origin: 'https://api.gnosis.blobscan.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blobscan_Rest-52',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Blobscan/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Blobscan,
				source: Source.Blobscan_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '560048',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.hoodi.blobscan.com',
						origin: 'https://api.hoodi.blobscan.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blobscan_Rest-53',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Blobscan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Blockchair,
		label: 'Blockchair',
		sources: [
			{
				provider: SourceProvider.Blockchair,
				source: Source.Blockchair_Rest,
				label: 'Blockchair REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Blockchair,
				source: Source.Blockchair_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'blockchair',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.blockchair.com',
						origin: 'https://api.blockchair.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_BLOCKCHAIR_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_BLOCKCHAIR_API_KEY',
						],
					},
				],
				proxyId: 'Blockchair_Rest-54',
			},
		],
	},
	{
		provider: SourceProvider.Blockfrost,
		label: 'Blockfrost',
		sources: [
			{
				provider: SourceProvider.Blockfrost,
				source: Source.Blockfrost_Rest,
				label: 'Blockfrost REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Blockfrost,
				source: Source.Blockfrost_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cip34:1-764824073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://cardano-mainnet.blockfrost.io/api/v0/',
						origin: 'https://cardano-mainnet.blockfrost.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'Blockfrost_Rest-55',
				serverCredentialId: 'Blockfrost_Rest-55',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Blockfrost/OpenApi/openapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Blockfrost/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Blockfrost/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Blockscout,
		label: 'Blockscout',
		sources: [
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				label: 'Blockscout REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.blockscout.com',
						origin: 'https://eth.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-56',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.blockscout.com',
						origin: 'https://eth.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-57',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://optimism.blockscout.com',
						origin: 'https://optimism.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-58',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://optimism.blockscout.com',
						origin: 'https://optimism.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-59',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '100',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gnosis.blockscout.com',
						origin: 'https://gnosis.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-60',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '100',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gnosis.blockscout.com',
						origin: 'https://gnosis.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-61',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '137',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://polygon.blockscout.com',
						origin: 'https://polygon.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-62',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '137',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://polygon.blockscout.com',
						origin: 'https://polygon.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-63',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '8453',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://base.blockscout.com',
						origin: 'https://base.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-64',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '8453',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://base.blockscout.com',
						origin: 'https://base.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-65',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42161',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://arbitrum.blockscout.com',
						origin: 'https://arbitrum.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-66',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42161',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://arbitrum.blockscout.com',
						origin: 'https://arbitrum.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-67',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth-sepolia.blockscout.com',
						origin: 'https://eth-sepolia.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BlockscoutRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BlockscoutAccountAbstraction,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-68',
			},
			{
				provider: SourceProvider.Blockscout,
				source: Source.Blockscout_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth-sepolia.blockscout.com',
						origin: 'https://eth-sepolia.blockscout.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Blockscout_Rest-69',
			},
		],
	},
	{
		provider: SourceProvider.BnbBeaconArchive,
		label: 'BNB Beacon archive',
		sources: [
			{
				provider: SourceProvider.BnbBeaconArchive,
				source: Source.BnbBeaconArchive_Rest,
				label: 'BNB Beacon archive REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BnbBeaconArchive,
				source: Source.BnbBeaconArchive_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'bnb-beacon-archive',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://archive-api.binance.org',
						origin: 'https://archive-api.binance.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BnbBeaconArchive_Rest-70',
			},
		],
	},
	{
		provider: SourceProvider.BnbChainFusion,
		label: 'BNB Chain Fusion',
		sources: [
			{
				provider: SourceProvider.BnbChainFusion,
				source: Source.BnbChainFusion_Rest,
				label: 'BNB Chain Fusion REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.BnbChainFusion,
				source: Source.BnbChainFusion_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'bnb-chain-fusion',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.binance.org',
						origin: 'https://api.binance.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'BnbChainFusion_Rest-71',
			},
		],
	},
	{
		provider: SourceProvider.Caips,
		label: 'CAIPs',
		sources: [
			{
				provider: SourceProvider.Caips,
				source: Source.Caips_Github,
				label: 'CAIPs GitHub',
			},
			{
				provider: SourceProvider.Caips,
				source: Source.CaipNamespaces_Github,
				label: 'CAIP namespaces GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Caips,
				source: Source.Caips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ChainAgnostic/CAIPs@main:CAIPs',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Caips,
				source: Source.CaipNamespaces_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ChainAgnostic/namespaces@main:namespaces',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CardanoCip30,
		label: 'Cardano CIP-30',
		sources: [
			{
				provider: SourceProvider.CardanoCip30,
				source: Source.CardanoCip30_WalletApi,
				label: 'Cardano CIP-30 wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CardanoCip30,
				source: Source.CardanoCip30_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'cardano-cip30-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'cardano',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CardanoDbSync,
		label: 'cardano-db-sync',
		sources: [
			{
				provider: SourceProvider.CardanoDbSync,
				source: Source.CardanoDbSync_Postgres,
				label: 'cardano-db-sync Postgres',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CardanoDbSync,
				source: Source.CardanoDbSync_Postgres,
				target: {
					kind: SourceTargetKind.SqlDataset,
					key: 'cardano-db-sync',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.PostgresDsn,
						locator: 'env:CARDANO_DB_SYNC_DATABASE_URL',
					},
				],
				wireProtocol: WireProtocol.Sql,
				apiFamily: ApiFamily.Postgres,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CardanoKoios,
		label: 'Cardano Koios',
		sources: [
			{
				provider: SourceProvider.CardanoKoios,
				source: Source.CardanoKoios_Rest,
				label: 'Cardano Koios REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CardanoKoios,
				source: Source.CardanoKoios_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cip34:1-764824073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.koios.rest',
						origin: 'https://api.koios.rest',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'CardanoKoios_Rest-76',
			},
		],
	},
	{
		provider: SourceProvider.CardanoNode,
		label: 'Cardano node',
		sources: [
			{
				provider: SourceProvider.CardanoNode,
				source: Source.CardanoNode_LocalStateQuery,
				label: 'Cardano node local-state query',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CardanoNode,
				source: Source.CardanoNode_LocalStateQuery,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cip34:1-764824073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'env:CARDANO_NODE_SOCKET_PATH',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CardanoLocalStateQuery,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Cardanoscan,
		label: 'Cardanoscan',
		sources: [
			{
				provider: SourceProvider.Cardanoscan,
				source: Source.Cardanoscan_Rest,
				label: 'Cardanoscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Cardanoscan,
				source: Source.Cardanoscan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'cardanoscan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.cardanoscan.io',
						origin: 'https://api.cardanoscan.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Cardanoscan_Rest-78',
			},
		],
	},
	{
		provider: SourceProvider.Cashu,
		label: 'Cashu',
		sources: [
			{
				provider: SourceProvider.Cashu,
				source: Source.CashuMint_Rest,
				label: 'Cashu mint REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Cashu,
				source: Source.CashuMint_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'https://8333.space:3338',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://8333.space:3338',
						origin: 'https://8333.space:3338',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'CashuMint_Rest-79',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Cashu/Mint/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Celenium,
		label: 'Celenium',
		sources: [
			{
				provider: SourceProvider.Celenium,
				source: Source.Celenium_Rest,
				label: 'Celenium REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Celenium,
				source: Source.Celenium_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'celenium-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.celenium.io',
						origin: 'https://api.celenium.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Celenium_Rest-80',
			},
		],
	},
	{
		provider: SourceProvider.Celestia,
		label: 'Celestia',
		sources: [
			{
				provider: SourceProvider.Celestia,
				source: Source.Celestia_JsonRpc,
				label: 'Celestia JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Celestia,
				source: Source.Celestia_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'celestia',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{celestia-rpc-host}',
						origin: 'https://{celestia-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.CelestiaNodeJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ChainlinkDataFeeds,
		label: 'Chainlink Data Feeds',
		sources: [
			{
				provider: SourceProvider.ChainlinkDataFeeds,
				source: Source.ChainlinkDataFeeds_AddressCatalog,
				label: 'Chainlink Data Feeds address catalog',
			},
			{
				provider: SourceProvider.ChainlinkDataFeeds,
				source: Source.ChainlinkDataFeeds_Contracts,
				label: 'Chainlink Data Feeds contracts',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ChainlinkDataFeeds,
				source: Source.ChainlinkDataFeeds_AddressCatalog,
				target: {
					kind: SourceTargetKind.Global,
					key: 'chainlink-data-feeds-address-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'chainlink-data-feeds-address-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.ChainlinkDataFeeds,
				source: Source.ChainlinkDataFeeds_Contracts,
				target: {
					kind: SourceTargetKind.Global,
					key: 'chainlink-data-feeds-contract-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'chainlink-data-feeds-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Chainlist,
		label: 'Chainlist',
		sources: [
			{
				provider: SourceProvider.Chainlist,
				source: Source.Chainlist_Rest,
				label: 'Chainlist REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Chainlist,
				source: Source.Chainlist_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'rpcs-json',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://chainlist.org',
						origin: 'https://chainlist.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Chainlist_Rest-84',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Chainlist/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CircleCctp,
		label: 'Circle CCTP',
		sources: [
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctp_IrisApi,
				label: 'Circle CCTP Iris API',
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Evm,
				label: 'Circle CCTP EVM contracts',
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Solana,
				label: 'Circle CCTP Solana contracts',
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Stellar,
				label: 'Circle CCTP Stellar contracts',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctp_IrisApi,
				target: {
					kind: SourceTargetKind.Global,
					key: 'circle-cctp-iris-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{circle-iris-api-host}',
						origin: 'https://{circle-iris-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Evm,
				target: {
					kind: SourceTargetKind.Global,
					key: 'circle-cctp-evm-contract-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'circle-cctp-evm-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Solana,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'circle-cctp-solana-program-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.CircleCctp,
				source: Source.CircleCctpContracts_Stellar,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'stellar',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'circle-cctp-stellar-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{circle-iris-api-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.CodexNetworkPresets,
		label: 'Codex network presets',
		sources: [
			{
				provider: SourceProvider.CodexNetworkPresets,
				source: Source.CodexNetworkPresets_Github,
				label: 'Codex network presets GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CodexNetworkPresets,
				source: Source.CodexNetworkPresets_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'codex-storage-network/codex-network-presets@master',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CodexNode,
		label: 'Codex node',
		sources: [
			{
				provider: SourceProvider.CodexNode,
				source: Source.CodexNode_Rest,
				label: 'Codex node REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CodexNode,
				source: Source.CodexNode_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'codex-node-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://{codex-node-host}:{port}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Cohere,
		label: 'Cohere',
		sources: [
			{
				provider: SourceProvider.Cohere,
				source: Source.Cohere_Rest,
				label: 'Cohere REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Cohere,
				source: Source.Cohere_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'cohere-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.cohere.com',
						origin: 'https://api.cohere.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'COHERE_API_KEY',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Coingecko,
		label: 'Coingecko',
		sources: [
			{
				provider: SourceProvider.Coingecko,
				source: Source.Coingecko_OpenApi,
				label: 'Coingecko OpenAPI',
			},
			{
				provider: SourceProvider.Coingecko,
				source: Source.Coingecko_Rest,
				label: 'Coingecko REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Coingecko,
				source: Source.Coingecko_OpenApi,
				target: {
					kind: SourceTargetKind.Global,
					key: 'coingecko-demo',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.coingecko.com/api/v3',
						origin: 'https://api.coingecko.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_COINGECKO_DEMO_API_KEY': 'string',
							'PUBLIC_COINGECKO_PRO_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_COINGECKO_DEMO_API_KEY',
							'PUBLIC_COINGECKO_PRO_API_KEY',
						],
					},
				],
				proxyId: 'Coingecko_OpenApi-92',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Coingecko/OpenApi/coingecko-demo.json',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Coingecko/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Coingecko/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
			{
				provider: SourceProvider.Coingecko,
				source: Source.Coingecko_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'coingecko-rest-v3',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.coingecko.com/api/v3',
						origin: 'https://api.coingecko.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_COINGECKO_DEMO_API_KEY': 'string',
							'PUBLIC_COINGECKO_PRO_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_COINGECKO_DEMO_API_KEY',
							'PUBLIC_COINGECKO_PRO_API_KEY',
						],
					},
				],
				proxyId: 'Coingecko_Rest-93',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Coingecko/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CoinMarketCap,
		label: 'Coin Market Cap',
		env: arktype({
			'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.CoinMarketCap,
				source: Source.CoinMarketCap_Rest,
				label: 'Coin Market Cap REST',
				env: arktype({
					'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.CoinMarketCap,
				source: Source.CoinMarketCap_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'pro-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://pro-api.coinmarketcap.com',
						origin: 'https://pro-api.coinmarketcap.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_COINMARKETCAP_API_KEY',
						],
					},
				],
				proxyId: 'CoinMarketCap_Rest-94',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/CoinMarketCap/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Coinpaprika,
		label: 'Coinpaprika',
		env: arktype({
			'PUBLIC_COINPAPRIKA_API_KEY': 'string > 0?',
		}),
		sources: [
			{
				provider: SourceProvider.Coinpaprika,
				source: Source.Coinpaprika_OpenApi,
				label: 'Coinpaprika OpenAPI',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Coinpaprika,
				source: Source.Coinpaprika_OpenApi,
				target: {
					kind: SourceTargetKind.Global,
					key: 'coinpaprika-openapi',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.coinpaprika.com/v1',
						origin: 'https://api.coinpaprika.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api-pro.coinpaprika.com/v1',
						origin: 'https://api-pro.coinpaprika.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_COINPAPRIKA_API_KEY': 'string > 0?',
						}),
						keys: [
							'PUBLIC_COINPAPRIKA_API_KEY',
						],
					},
				],
				proxyId: 'Coinpaprika_OpenApi-95',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Coinpaprika/OpenApi/openapi.yml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Coinpaprika/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Coinpaprika/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CometBft,
		label: 'CometBFT',
		sources: [
			{
				provider: SourceProvider.CometBft,
				source: Source.CometBft_Rest,
				label: 'CometBFT REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CometBft,
				source: Source.CometBft_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cosmos:cosmoshub-4',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://cosmos-rpc.publicnode.com',
						origin: 'https://cosmos-rpc.publicnode.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/CometBft/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Conseil,
		label: 'Conseil',
		sources: [
			{
				provider: SourceProvider.Conseil,
				source: Source.Conseil_Postgres,
				label: 'Conseil Postgres',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Conseil,
				source: Source.Conseil_Postgres,
				target: {
					kind: SourceTargetKind.SqlDataset,
					key: 'conseil',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.PostgresDsn,
						locator: 'env:CONSEIL_DATABASE_URL',
					},
				],
				wireProtocol: WireProtocol.Sql,
				apiFamily: ApiFamily.Postgres,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Covalent,
		label: 'Covalent',
		sources: [
			{
				provider: SourceProvider.Covalent,
				source: Source.GoldRushFoundational_Rest,
				label: 'GoldRush Foundational API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Covalent,
				source: Source.GoldRushFoundational_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.covalenthq.com',
						origin: 'https://api.covalenthq.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GoldRushFoundationalApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'GoldRushFoundational_Rest-150',
				serverCredentialId: 'GoldRushFoundational_Rest-150',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Covalent/GoldRush/Rest/types.ts',
						generated: false,
						referenceUrl: 'https://goldrush.dev/docs/skills/goldrush-foundational-api/references/endpoints-transactions/',
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.covalenthq.com',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider._Constants,
		label: 'Constants',
		sources: [
			{
				provider: SourceProvider._Constants,
				source: Source.Constants_Internal,
				label: 'Checked-in constants',
			},
		],
		bindings: [
			{
				provider: SourceProvider._Constants,
				source: Source.Constants_Internal,
				target: {
					kind: SourceTargetKind.Global,
					key: 'checked-in-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'src/constants/**',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CosmosAdrs,
		label: 'Cosmos ADRs',
		sources: [
			{
				provider: SourceProvider.CosmosAdrs,
				source: Source.CosmosAdrs_Github,
				label: 'Cosmos ADRs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CosmosAdrs,
				source: Source.CosmosAdrs_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'cosmos/cosmos-sdk@main:docs/architecture',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.CosmosChainRegistry,
		label: 'Cosmos Chain Registry name',
		sources: [
			{
				provider: SourceProvider.CosmosChainRegistry,
				source: Source.CosmosChainRegistry_Github,
				label: 'Cosmos Chain Registry name GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CosmosChainRegistry,
				source: Source.CosmosChainRegistry_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'cosmos/chain-registry@master:',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.CosmosSdk,
		label: 'Cosmos SDK',
		sources: [
			{
				provider: SourceProvider.CosmosSdk,
				source: Source.CosmosSdk_Rest,
				label: 'Cosmos SDK REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CosmosSdk,
				source: Source.CosmosSdk_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cosmos:cosmoshub-4',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rest.cosmos.directory/cosmoshub',
						origin: 'https://rest.cosmos.directory',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/CosmosSdk/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CronosExplorer,
		label: 'Cronos Explorer',
		sources: [
			{
				provider: SourceProvider.CronosExplorer,
				source: Source.CronosExplorer_Rest,
				label: 'Cronos Explorer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CronosExplorer,
				source: Source.CronosExplorer_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'cronos-explorer-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{cronos-explorer-api-host}',
						origin: 'https://{cronos-explorer-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.CycloneDx,
		label: 'CycloneDX',
		sources: [
			{
				provider: SourceProvider.CycloneDx,
				source: Source.CycloneDxDocument_Local,
				label: 'CycloneDX document',
			},
		],
		bindings: [
			{
				provider: SourceProvider.CycloneDx,
				source: Source.CycloneDxDocument_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'cyclonedx-document',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'selected-file-or-artifact',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.LocalParser,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.DocumentClaimExtraction,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Defillama,
		label: 'Defillama',
		env: arktype({
			'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
		}),
		sources: [
			{
				provider: SourceProvider.Defillama,
				source: Source.Defillama_OpenApi,
				label: 'Defillama OpenAPI',
			},
			{
				provider: SourceProvider.Defillama,
				source: Source.Defillama_Rest,
				label: 'Defillama REST',
				env: arktype({
					'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Defillama,
				source: Source.Defillama_OpenApi,
				target: {
					kind: SourceTargetKind.Global,
					key: 'coins-openapi',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://coins.llama.fi',
						origin: 'https://coins.llama.fi',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://icons.llama.fi',
						origin: 'https://icons.llama.fi',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Defillama_OpenApi-104',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Defillama/OpenApi/openapi.json',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Defillama/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Defillama/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
			{
				provider: SourceProvider.Defillama,
				source: Source.Defillama_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'coins-pro-rest',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://pro-api.llama.fi',
						origin: 'https://pro-api.llama.fi',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
						}),
						keys: [
							'PUBLIC_DEFILLAMA_PRO_API_KEY',
						],
					},
				],
				proxyId: 'Defillama_Rest-105',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Defillama/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Dexscreener,
		label: 'Dexscreener',
		sources: [
			{
				provider: SourceProvider.Dexscreener,
				source: Source.Dexscreener_OpenApi,
				label: 'Dexscreener OpenAPI',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Dexscreener,
				source: Source.Dexscreener_OpenApi,
				target: {
					kind: SourceTargetKind.Global,
					key: 'dexscreener-openapi',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.dexscreener.com',
						origin: 'https://api.dexscreener.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Dexscreener_OpenApi-106',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Dexscreener/OpenApi/openapi.yml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Dexscreener/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Dexscreener/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.DogecoinCore,
		label: 'Dogecoin Core',
		sources: [
			{
				provider: SourceProvider.DogecoinCore,
				source: Source.DogecoinCore_JsonRpc,
				label: 'Dogecoin Core JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.DogecoinCore,
				source: Source.DogecoinCore_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:1a91e3dace36e2be3bf030a65679fe82',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:22555',
						origin: 'http://127.0.0.1:22555',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.DogecoinDips,
		label: 'Dogecoin DIPs',
		sources: [
			{
				provider: SourceProvider.DogecoinDips,
				source: Source.DogecoinDips_Github,
				label: 'Dogecoin DIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.DogecoinDips,
				source: Source.DogecoinDips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'dogecoin/dips@master:',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.Dune,
		label: 'Dune',
		env: arktype({
			'PUBLIC_DUNE_API_KEY': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.Dune,
				source: Source.Dune_Rest,
				label: 'Dune REST',
				env: arktype({
					'PUBLIC_DUNE_API_KEY': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Dune,
				source: Source.Dune_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.dune.com',
						origin: 'https://api.dune.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_DUNE_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_DUNE_API_KEY',
						],
					},
				],
				proxyId: 'Dune_Rest-109',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Dune/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Dydx,
		label: 'dYdX',
		sources: [
			{
				provider: SourceProvider.Dydx,
				source: Source.DydxIndexer_Rest,
				label: 'dYdX Indexer REST',
			},
			{
				provider: SourceProvider.Dydx,
				source: Source.DydxValidator_Rest,
				label: 'dYdX Validator REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Dydx,
				source: Source.DydxIndexer_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'dydx',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{dydx-indexer-host}',
						origin: 'https://{dydx-indexer-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.DydxIndexerRest,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Dydx,
				source: Source.DydxValidator_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'dydx',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{dydx-validator-rest-host}',
						origin: 'https://{dydx-validator-rest-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.CosmosLcdApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{dydx-indexer-host}',
				corsEnabled: false,
			},
			{
				origin: 'https://{dydx-validator-rest-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Eas,
		label: 'Ethereum Attestation Service',
		sources: [
			{
				provider: SourceProvider.Eas,
				source: Source.EasContracts_Evm,
				label: 'EAS contract catalog',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Eas,
				source: Source.EasContracts_Evm,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eas-evm-contract-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'eas-evm-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EasScan,
		label: 'EAS Scan',
		sources: [
			{
				provider: SourceProvider.EasScan,
				source: Source.EasScan_Graphql,
				label: 'EAS Scan GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EasScan,
				source: Source.EasScan_Graphql,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eas-scan',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{eas-scan-graphql-host}',
						origin: 'https://{eas-scan-graphql-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/EasScan/Graphql/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{eas-scan-graphql-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.EigenExplorer,
		label: 'EigenExplorer',
		sources: [
			{
				provider: SourceProvider.EigenExplorer,
				source: Source.EigenExplorer_Rest,
				label: 'EigenExplorer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EigenExplorer,
				source: Source.EigenExplorer_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eigen-explorer-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{eigen-explorer-api-host}',
						origin: 'https://{eigen-explorer-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{eigen-explorer-api-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.EigenLayer,
		label: 'EigenLayer',
		sources: [
			{
				provider: SourceProvider.EigenLayer,
				source: Source.EigenLayerContracts_Evm,
				label: 'EigenLayer contract catalog',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EigenLayer,
				source: Source.EigenLayerContracts_Evm,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eigenlayer-evm-contract-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'eigenlayer-evm-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EigenLayerSubgraph,
		label: 'EigenLayer subgraph',
		sources: [
			{
				provider: SourceProvider.EigenLayerSubgraph,
				source: Source.EigenLayerSubgraph_Graphql,
				label: 'EigenLayer subgraph GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EigenLayerSubgraph,
				source: Source.EigenLayerSubgraph_Graphql,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eigenlayer-subgraph',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{eigenlayer-subgraph-host}',
						origin: 'https://{eigenlayer-subgraph-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/EigenLayerSubgraph/Graphql/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{eigenlayer-subgraph-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Eip8004Scan,
		label: '8004scan',
		sources: [
			{
				provider: SourceProvider.Eip8004Scan,
				source: Source.Eip8004Scan_Rest,
				label: '8004scan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Eip8004Scan,
				source: Source.Eip8004Scan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eip8004-agents',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://8004scan.io/api/v1/public',
						origin: 'https://8004scan.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Eip8004Scan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Ensips,
		label: 'ENSIPs',
		sources: [
			{
				provider: SourceProvider.Ensips,
				source: Source.Ensips_Github,
				label: 'ENSIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Ensips,
				source: Source.Ensips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ensdomains/ensips@master:ensips',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EnsMetadataService,
		label: 'ENS metadata service',
		sources: [
			{
				provider: SourceProvider.EnsMetadataService,
				source: Source.EnsMetadataService_Rest,
				label: 'ENS metadata service REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EnsMetadataService,
				source: Source.EnsMetadataService_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'ens-metadata-service',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{ens-metadata-service-host}',
						origin: 'https://{ens-metadata-service-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Erigon,
		label: 'Erigon',
		sources: [
			{
				provider: SourceProvider.Erigon,
				source: Source.Erigon_JsonRpc,
				label: 'Erigon JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Erigon,
				source: Source.Erigon_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'erigon-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8545',
						origin: 'http://127.0.0.1:8545',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Esplora,
		label: 'Esplora',
		sources: [
			{
				provider: SourceProvider.Esplora,
				source: Source.Esplora_Rest,
				label: 'Esplora REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Esplora,
				source: Source.Esplora_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:000000000019d6689c085ae165831e93',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://blockstream.info/api',
						origin: 'https://blockstream.info',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Esplora,
				source: Source.Esplora_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'liquid',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://blockstream.info/liquid/api',
						origin: 'https://blockstream.info',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EthereumEips,
		label: 'Ethereum EIPs',
		sources: [
			{
				provider: SourceProvider.EthereumEips,
				source: Source.EthereumEips_Github,
				label: 'Ethereum EIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EthereumEips,
				source: Source.EthereumEips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ethereum/EIPs@master:EIPS',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'EthereumEips_Github-123',
			},
			{
				provider: SourceProvider.EthereumEips,
				source: Source.EthereumEips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ethereum/ercs@master:ERCS',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'EthereumEips_Github-124',
			},
		],
	},
	{
		provider: SourceProvider.EthereumLists,
		label: 'ethereum-lists (chainid.network)',
		sources: [
			{
				provider: SourceProvider.EthereumLists,
				source: Source.EthereumLists_Rest,
				label: 'ethereum-lists REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EthereumLists,
				source: Source.EthereumLists_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'chains',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://chainid.network',
						origin: 'https://chainid.network',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'EthereumLists_Rest-125',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/EthereumLists/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EthereumSpecs,
		label: 'Ethereum specs',
		sources: [
			{
				provider: SourceProvider.EthereumSpecs,
				source: Source.EthereumSpecs_Github,
				label: 'Ethereum specs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EthereumSpecs,
				source: Source.EthereumSpecs_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ethereum/*',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Etherscan,
		label: 'Etherscan',
		sources: [
			{
				provider: SourceProvider.Etherscan,
				source: Source.Etherscan_Rest,
				label: 'Etherscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Etherscan,
				source: Source.Etherscan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'etherscan-v2',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.etherscan.io/v2/api',
						origin: 'https://api.etherscan.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.EtherscanModuleAction,
				operationGroups: [
					SourceOperationGroup.EtherscanAccountModule,
					SourceOperationGroup.EtherscanContractModule,
					SourceOperationGroup.EvmRpcCore,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_ETHERSCAN_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_ETHERSCAN_API_KEY',
						],
					},
				],
				proxyId: 'Etherscan_Rest-127',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Etherscan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EthForks,
		label: 'EthForks',
		sources: [
			{
				provider: SourceProvider.EthForks,
				source: Source.EthForks_Rest,
				label: 'EthForks REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.EthForks,
				source: Source.EthForks_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'eth-forks',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth-forks.github.io',
						origin: 'https://eth-forks.github.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'EthForks_Rest-128',
			},
		],
	},
	{
		provider: SourceProvider.Envio,
		label: 'Envio',
		sources: [
			{
				provider: SourceProvider.Envio,
				source: Source.EnvioHyperRpc_JsonRpc,
				label: 'Envio HyperRPC',
			},
			{
				provider: SourceProvider.Envio,
				source: Source.EnvioHyperSync_RawHttp,
				label: 'Envio HyperSync',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Envio,
				source: Source.EnvioHyperRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.rpc.hypersync.xyz/{ENVIO_API_TOKEN}',
						origin: 'https://eth.rpc.hypersync.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'EnvioHyperRpc_JsonRpc-129',
				serverCredentialId: 'EnvioHyperRpc_JsonRpc-129',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Envio,
				source: Source.EnvioHyperSync_RawHttp,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.hypersync.xyz',
						origin: 'https://eth.hypersync.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.EnvioHyperSyncApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'EnvioHyperSync_RawHttp-130',
				serverCredentialId: 'EnvioHyperSync_RawHttp-130',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Envio/HyperSync/types.ts',
						generated: false,
						referenceUrl: 'https://docs.envio.dev/docs/HyperSync/overview',
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Farcaster,
		label: 'Farcaster',
		sources: [
			{
				provider: SourceProvider.Farcaster,
				source: Source.Farcaster_Rest,
				label: 'Farcaster REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Farcaster,
				source: Source.Farcaster_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'client-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.farcaster.xyz',
						origin: 'https://api.farcaster.xyz',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://farcaster.xyz',
						origin: 'https://farcaster.xyz',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://haatz.quilibrium.com',
						origin: 'https://haatz.quilibrium.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Farcaster_Rest-131',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Farcaster/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Fedi,
		label: 'Fedi',
		sources: [
			{
				provider: SourceProvider.Fedi,
				source: Source.Fedi_Rest,
				label: 'Fedi REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Fedi,
				source: Source.Fedi_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'fedi-rest-service',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:FEDI_REST_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.FedimintClient,
		label: 'Fedimint client',
		sources: [
			{
				provider: SourceProvider.FedimintClient,
				source: Source.FedimintClient_Rpc,
				label: 'Fedimint client RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.FedimintClient,
				source: Source.FedimintClient_Rpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'fedimint-client',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:FEDIMINT_CLIENT_RPC_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.FedimintGatewayd,
		label: 'Fedimint gatewayd',
		sources: [
			{
				provider: SourceProvider.FedimintGatewayd,
				source: Source.FedimintGatewayd_Rest,
				label: 'Fedimint gatewayd REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.FedimintGatewayd,
				source: Source.FedimintGatewayd_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'fedimint-gatewayd',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:FEDIMINT_GATEWAYD_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.FedimintGatewaydApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.FilecoinFips,
		label: 'Filecoin FIPs',
		sources: [
			{
				provider: SourceProvider.FilecoinFips,
				source: Source.FilecoinFips_Github,
				label: 'Filecoin FIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.FilecoinFips,
				source: Source.FilecoinFips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'filecoin-project/FIPs@master:FIPS',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.Filfox,
		label: 'Filfox',
		sources: [
			{
				provider: SourceProvider.Filfox,
				source: Source.Filfox_Rest,
				label: 'Filfox REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Filfox,
				source: Source.Filfox_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://filfox.info',
						origin: 'https://filfox.info',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Filfox/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Forgejo,
		label: 'Forgejo',
		sources: [
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoRepos_Rest,
				label: 'Forgejo repositories REST',
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoIssues_Rest,
				label: 'Forgejo issues REST',
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoPulls_Rest,
				label: 'Forgejo pulls REST',
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoReleases_Rest,
				label: 'Forgejo releases REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoRepos_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'forgejo-repositories',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{forgejo-host}/api/v1',
						origin: 'https://{forgejo-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.ForgejoRestApi,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoIssues_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'forgejo-issues',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{forgejo-host}/api/v1',
						origin: 'https://{forgejo-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.ForgejoRestApi,
				operationGroups: [
					SourceOperationGroup.IssueTracking,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoPulls_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'forgejo-pulls',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{forgejo-host}/api/v1',
						origin: 'https://{forgejo-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.ForgejoRestApi,
				operationGroups: [
					SourceOperationGroup.PullRequestReview,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
			{
				provider: SourceProvider.Forgejo,
				source: Source.ForgejoReleases_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'forgejo-releases',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{forgejo-host}/api/v1',
						origin: 'https://{forgejo-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.ForgejoRestApi,
				operationGroups: [
					SourceOperationGroup.ReleaseMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Freighter,
		label: 'Freighter',
		sources: [
			{
				provider: SourceProvider.Freighter,
				source: Source.Freighter_WalletApi,
				label: 'Freighter wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Freighter,
				source: Source.Freighter_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'freighter',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'freighter',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.FxEmbed,
		label: 'FxEmbed',
		sources: [
			{
				provider: SourceProvider.FxEmbed,
				source: Source.X_FxEmbed_Rest,
				label: 'FxEmbed REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.FxEmbed,
				source: Source.X_FxEmbed_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'fxembed-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.fxtwitter.com',
						origin: 'https://api.fxtwitter.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'X_FxEmbed_Rest-142',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/FxEmbed/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.GetBlock,
		label: 'GetBlock',
		sources: [
			{
				provider: SourceProvider.GetBlock,
				source: Source.GetBlockRpc_JsonRpc,
				label: 'GetBlock EVM JSON-RPC',
			},
			{
				provider: SourceProvider.GetBlock,
				source: Source.GetBlockYellowstone_Grpc,
				label: 'GetBlock Yellowstone gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.GetBlock,
				source: Source.GetBlockRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
						origin: 'https://go.getblock.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'GetBlockRpc_JsonRpc-143',
				serverCredentialId: 'GetBlockRpc_JsonRpc-143',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.GetBlock,
				source: Source.GetBlockYellowstone_Grpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
						origin: 'https://go.getblock.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				serverCredentialId: 'GetBlockYellowstone_Grpc-144',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/GetBlock/Yellowstone/types.ts',
						generated: false,
						referenceUrl: 'https://getblock.io/docs/yellowstone-grpc/',
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Git,
		label: 'Git',
		sources: [
			{
				provider: SourceProvider.Git,
				source: Source.Git_Local,
				label: 'Local Git repository',
			},
			{
				provider: SourceProvider.Git,
				source: Source.Git_Remote,
				label: 'Remote Git repository',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Git,
				source: Source.Git_Local,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'local-git-repository',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: '{repository-path}',
					},
				],
				wireProtocol: WireProtocol.Git,
				apiFamily: ApiFamily.GitObject,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Git,
				source: Source.Git_Remote,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'remote-git-repository',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{host}/{owner}/{repo}.git',
						origin: 'https://{host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Git,
				apiFamily: ApiFamily.GitObject,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Github,
		label: 'GitHub',
		sources: [
			{
				provider: SourceProvider.Github,
				source: Source.Github_Rest,
				label: 'GitHub REST',
			},
			{
				provider: SourceProvider.Github,
				source: Source.Github_Git,
				label: 'GitHub Git',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Github,
				source: Source.Github_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'github-rest',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubRestApi,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.IssueTracking,
					SourceOperationGroup.PullRequestReview,
					SourceOperationGroup.ReleaseMetadata,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
			{
				provider: SourceProvider.Github,
				source: Source.Github_Git,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'github-git',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://github.com/{owner}/{repo}.git',
						origin: 'https://github.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Git,
				apiFamily: ApiFamily.GitObject,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Gitlab,
		label: 'GitLab',
		sources: [
			{
				provider: SourceProvider.Gitlab,
				source: Source.Gitlab_Rest,
				label: 'GitLab REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Gitlab,
				source: Source.Gitlab_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'gitlab-rest',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gitlab.com',
						origin: 'https://gitlab.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GitlabRestApi,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.IssueTracking,
					SourceOperationGroup.PullRequestReview,
					SourceOperationGroup.ReleaseMetadata,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
				proxyId: 'Gitlab_Rest-149',
			},
		],
	},
	{
		provider: SourceProvider.GoogleAi,
		label: 'Google AI',
		sources: [
			{
				provider: SourceProvider.GoogleAi,
				source: Source.GoogleAi_Rest,
				label: 'Google AI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.GoogleAi,
				source: Source.GoogleAi_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'google-ai-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://generativelanguage.googleapis.com',
						origin: 'https://generativelanguage.googleapis.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'GOOGLE_AI_API_KEY',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.HashConnect,
		label: 'HashConnect',
		sources: [
			{
				provider: SourceProvider.HashConnect,
				source: Source.HashConnect_WalletApi,
				label: 'HashConnect wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HashConnect,
				source: Source.HashConnect_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'hashconnect',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'hashconnect',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.HederaMirrorNode,
		label: 'Hedera mirror node',
		sources: [
			{
				provider: SourceProvider.HederaMirrorNode,
				source: Source.HederaMirrorNode_Rest,
				label: 'Hedera mirror node REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HederaMirrorNode,
				source: Source.HederaMirrorNode_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'hedera:mainnet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet-public.mirrornode.hedera.com',
						origin: 'https://mainnet-public.mirrornode.hedera.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'HederaMirrorNode_Rest-153',
			},
		],
	},
	{
		provider: SourceProvider.HederaSdk,
		label: 'Hedera SDK',
		sources: [
			{
				provider: SourceProvider.HederaSdk,
				source: Source.HederaSdk_Grpc,
				label: 'Hedera SDK gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HederaSdk,
				source: Source.HederaSdk_Grpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'hedera:mainnet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:HEDERA_SDK_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.Proto,
						path: 'src/sources/HederaSdk/Grpc/proto',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/HederaSdk/Grpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.HederaWalletConnect,
		label: 'Hedera WalletConnect',
		sources: [
			{
				provider: SourceProvider.HederaWalletConnect,
				source: Source.HederaWalletConnect_SignClient,
				label: 'Hedera WalletConnect sign client',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HederaWalletConnect,
				source: Source.HederaWalletConnect_SignClient,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'hedera-walletconnect',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'walletconnect-hedera',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Helius,
		label: 'Helius',
		sources: [
			{
				provider: SourceProvider.Helius,
				source: Source.Helius_Rest,
				label: 'Helius REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Helius,
				source: Source.Helius_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api-mainnet.helius-rpc.com',
						origin: 'https://api-mainnet.helius-rpc.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_HELIUS_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_HELIUS_API_KEY',
						],
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Helius/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api-mainnet.helius-rpc.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.HuggingFace,
		label: 'Hugging Face',
		sources: [
			{
				provider: SourceProvider.HuggingFace,
				source: Source.HuggingFaceHub_Rest,
				label: 'Hugging Face Hub REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HuggingFace,
				source: Source.HuggingFaceHub_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'huggingface-hub',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://huggingface.co/api',
						origin: 'https://huggingface.co',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.RepositoryMetadata,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Hyperliquid,
		label: 'Hyperliquid',
		sources: [
			{
				provider: SourceProvider.Hyperliquid,
				source: Source.Hyperliquid_Rest,
				label: 'Hyperliquid REST',
			},
			{
				provider: SourceProvider.Hyperliquid,
				source: Source.Hyperliquid_JsonRpc,
				label: 'HyperEVM JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Hyperliquid,
				source: Source.Hyperliquid_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'eip155:999',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.hyperliquid.xyz/info',
						origin: 'https://api.hyperliquid.xyz',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Hyperliquid/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Hyperliquid,
				source: Source.Hyperliquid_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '999',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.hyperliquid.xyz/evm',
						origin: 'https://rpc.hyperliquid.xyz',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.HyperliquidDocs,
		label: 'Hyperliquid docs',
		sources: [
			{
				provider: SourceProvider.HyperliquidDocs,
				source: Source.HyperliquidDocs_Rest,
				label: 'Hyperliquid docs REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.HyperliquidDocs,
				source: Source.HyperliquidDocs_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'hyperliquid-docs',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hyperliquid.gitbook.io',
						origin: 'https://hyperliquid.gitbook.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.StaticWebsite,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://hyperliquid.gitbook.io',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.InternetComputer,
		label: 'Internet Computer',
		sources: [
			{
				provider: SourceProvider.InternetComputer,
				source: Source.IcDashboard_Canister,
				label: 'IC dashboard canister',
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_Canister,
				label: 'Internet Computer canister',
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_Http,
				label: 'Internet Computer HTTP gateway',
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_RosettaApi,
				label: 'Internet Computer Rosetta API',
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_WalletApi,
				label: 'Internet Computer wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.InternetComputer,
				source: Source.IcDashboard_Canister,
				target: {
					kind: SourceTargetKind.Canister,
					key: 'ic-dashboard',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.CanisterId,
						locator: 'env:IC_DASHBOARD_CANISTER_ID',
					},
				],
				wireProtocol: WireProtocol.Canister,
				apiFamily: ApiFamily.IcCanister,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_Canister,
				target: {
					kind: SourceTargetKind.Canister,
					key: 'application-canister',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.CanisterId,
						locator: 'env:IC_CANISTER_ID',
					},
				],
				wireProtocol: WireProtocol.Canister,
				apiFamily: ApiFamily.IcCanister,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'internet-computer-boundary',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:IC_BOUNDARY_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.CertifiedHttpGateway,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_RosettaApi,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'icp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:IC_ROSETTA_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RosettaApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.InternetComputer,
				source: Source.InternetComputer_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'user-session',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'browser:internet-computer-wallet',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.InternetIdentity,
		label: 'Internet Identity',
		sources: [
			{
				provider: SourceProvider.InternetIdentity,
				source: Source.InternetIdentity_Delegation,
				label: 'Internet Identity delegation',
			},
		],
		bindings: [
			{
				provider: SourceProvider.InternetIdentity,
				source: Source.InternetIdentity_Delegation,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'user-session',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'internet-identity-delegation',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Ipfs,
		label: 'IPFS',
		sources: [
			{
				provider: SourceProvider.Ipfs,
				source: Source.Ipfs_Rest,
				label: 'IPFS Gateway',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Ipfs,
				source: Source.Ipfs_Rest,
				target: {
					kind: SourceTargetKind.ContentAddressScheme,
					key: 'ipfs',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ipfs.io',
						origin: 'https://ipfs.io',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://dweb.link',
						origin: 'https://dweb.link',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://cloudflare-ipfs.com',
						origin: 'https://cloudflare-ipfs.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.IpfsGateway,
				operationGroups: [
					SourceOperationGroup.ContentGatewayRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Ipfs_Rest-167',
			},
		],
	},
	{
		provider: SourceProvider.Juno,
		label: 'Juno',
		sources: [
			{
				provider: SourceProvider.Juno,
				source: Source.Juno_JsonRpc,
				label: 'Juno JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Juno,
				source: Source.Juno_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'starknet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{juno-rpc-host}',
						origin: 'https://{juno-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.StarknetJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{juno-rpc-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Kabila,
		label: 'Kabila',
		sources: [
			{
				provider: SourceProvider.Kabila,
				source: Source.Kabila_WalletConnect,
				label: 'Kabila WalletConnect',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Kabila,
				source: Source.Kabila_WalletConnect,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'kabila-walletconnect',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'kabila-walletconnect',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.KaspaExplorer,
		label: 'Kaspa Explorer',
		sources: [
			{
				provider: SourceProvider.KaspaExplorer,
				source: Source.KaspaExplorer_Rest,
				label: 'Kaspa Explorer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.KaspaExplorer,
				source: Source.KaspaExplorer_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'kaspa-explorer-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{kaspa-explorer-api-host}',
						origin: 'https://{kaspa-explorer-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.KaspaNode,
		label: 'Kaspa node',
		sources: [
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Grpc,
				label: 'Kaspa node gRPC',
			},
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Rest,
				label: 'Kaspa node REST',
			},
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Wrpc,
				label: 'Kaspa node wRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Grpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'kaspa',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:KASPA_NODE_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.Proto,
						path: 'src/sources/KaspaNode/Grpc/proto',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/KaspaNode/Grpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'kaspa',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:KASPA_NODE_REST_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.KaspaRestApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.KaspaNode,
				source: Source.KaspaNode_Wrpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'kaspa',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:KASPA_NODE_WRPC_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Wrpc,
				apiFamily: ApiFamily.KaspaWrpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.KaspaWalletCli,
		label: 'Kaspa wallet CLI',
		sources: [
			{
				provider: SourceProvider.KaspaWalletCli,
				source: Source.KaspaWalletCli_WalletApi,
				label: 'Kaspa wallet CLI API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.KaspaWalletCli,
				source: Source.KaspaWalletCli_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'kaspa-wallet-cli',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'kaspa-wallet-cli',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.KaspaWalletSdk,
		label: 'Kaspa wallet SDK',
		sources: [
			{
				provider: SourceProvider.KaspaWalletSdk,
				source: Source.KaspaWalletSdk_WalletApi,
				label: 'Kaspa wallet SDK API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.KaspaWalletSdk,
				source: Source.KaspaWalletSdk_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'kaspa-wallet-sdk',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'kaspa-wallet-sdk',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.KaswareWallet,
		label: 'Kasware Wallet',
		sources: [
			{
				provider: SourceProvider.KaswareWallet,
				source: Source.KaswareWallet_WalletApi,
				label: 'Kasware Wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.KaswareWallet,
				source: Source.KaswareWallet_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'kasware-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'kasware',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Keplr,
		label: 'Keplr',
		sources: [
			{
				provider: SourceProvider.Keplr,
				source: Source.Keplr_WalletApi,
				label: 'Keplr wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Keplr,
				source: Source.Keplr_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'keplr',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'keplr',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Koios,
		label: 'Koios',
		sources: [
			{
				provider: SourceProvider.Koios,
				source: Source.Koios_Rest,
				label: 'Koios REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Koios,
				source: Source.Koios_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cip34:1-764824073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.koios.rest',
						origin: 'https://api.koios.rest',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Koios_Rest-178',
			},
		],
	},
	{
		provider: SourceProvider.L2Beat,
		label: 'L2Beat',
		sources: [
			{
				provider: SourceProvider.L2Beat,
				source: Source.L2Beat_Rest,
				label: 'L2Beat REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.L2Beat,
				source: Source.L2Beat_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'scaling-summary',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://l2beat.com',
						origin: 'https://l2beat.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'L2Beat_Rest-179',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/L2Beat/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LayerZeroScan,
		label: 'LayerZero Scan',
		sources: [
			{
				provider: SourceProvider.LayerZeroScan,
				source: Source.LayerZeroScan_Rest,
				label: 'LayerZero Scan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LayerZeroScan,
				source: Source.LayerZeroScan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'layerzero-scan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{layerzero-scan-api-host}',
						origin: 'https://{layerzero-scan-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Leap,
		label: 'Leap',
		sources: [
			{
				provider: SourceProvider.Leap,
				source: Source.Leap_WalletApi,
				label: 'Leap wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Leap,
				source: Source.Leap_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'leap',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'leap',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LedgerFilecoin,
		label: 'Ledger Filecoin',
		sources: [
			{
				provider: SourceProvider.LedgerFilecoin,
				source: Source.LedgerFilecoin_WalletApi,
				label: 'Ledger Filecoin wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LedgerFilecoin,
				source: Source.LedgerFilecoin_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'ledger-filecoin',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'ledger-filecoin',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Lens,
		label: 'Lens Protocol',
		sources: [
			{
				provider: SourceProvider.Lens,
				source: Source.Lens_Graphql,
				label: 'Lens Protocol GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Lens,
				source: Source.Lens_Graphql,
				target: {
					kind: SourceTargetKind.Global,
					key: 'lens-protocol',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.lens.xyz/graphql',
						origin: 'https://api.lens.xyz',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_LENS_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_LENS_API_KEY',
						],
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.GraphqlSchema,
						path: 'src/sources/Lens/Graphql/schema.graphql',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Lens/Graphql/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GraphqlTypes,
						path: 'src/sources/Lens/Graphql/graphql-env.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LibtorrentSession,
		label: 'libtorrent session',
		sources: [
			{
				provider: SourceProvider.LibtorrentSession,
				source: Source.LibtorrentSession_Rest,
				label: 'libtorrent session REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LibtorrentSession,
				source: Source.LibtorrentSession_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'libtorrent-session',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:LIBTORRENT_SESSION_API_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Lifi,
		label: 'LI.FI',
		sources: [
			{
				provider: SourceProvider.Lifi,
				source: Source.LifiStatus_Rest,
				label: 'LI.FI status REST',
			},
			{
				provider: SourceProvider.Lifi,
				source: Source.Lifi_Rest,
				label: 'LI.FI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Lifi,
				source: Source.LifiStatus_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'lifi-status',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://li.quest',
						origin: 'https://li.quest',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Lifi,
				source: Source.Lifi_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'lifi',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://li.quest',
						origin: 'https://li.quest',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://staging.li.quest',
						origin: 'https://staging.li.quest',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Lifi/OpenApi/openapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Lifi/OpenApi/openapi.d.ts',
						generated: true,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Lifi/OpenApi/schema-source.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://li.quest',
				corsEnabled: true,
			},
			{
				origin: 'https://staging.li.quest',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.LightningLnd,
		label: 'LND',
		sources: [
			{
				provider: SourceProvider.LightningLnd,
				source: Source.LightningLnd_Grpc,
				label: 'LND gRPC',
			},
			{
				provider: SourceProvider.LightningLnd,
				source: Source.LightningLnd_Rest,
				label: 'LND REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LightningLnd,
				source: Source.LightningLnd_Grpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'lnd',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:LIGHTNING_LND_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.WalletAccountRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.LightningLnd,
				source: Source.LightningLnd_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'lnd',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://127.0.0.1:8080',
						origin: 'https://127.0.0.1:8080',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8080',
						origin: 'http://127.0.0.1:8080',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://localhost:8080',
						origin: 'https://localhost:8080',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://localhost:8080',
						origin: 'http://localhost:8080',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_LND_MACAROON_HEX': 'string',
						}),
						keys: [
							'PUBLIC_LND_MACAROON_HEX',
						],
					},
				],
				proxyId: 'LightningLnd_Rest-188',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/LightningLnd/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				origin: 'http://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				origin: 'https://localhost:8080',
				corsEnabled: false,
			},
			{
				origin: 'http://localhost:8080',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.LightningMempoolSpace,
		label: 'mempool.space Lightning',
		sources: [
			{
				provider: SourceProvider.LightningMempoolSpace,
				source: Source.LightningMempoolSpace_Rest,
				label: 'mempool.space Lightning REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LightningMempoolSpace,
				source: Source.LightningMempoolSpace_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'lightning',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mempool.space',
						origin: 'https://mempool.space',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/LightningMempoolSpace/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LitecoinCore,
		label: 'Litecoin Core',
		sources: [
			{
				provider: SourceProvider.LitecoinCore,
				source: Source.LitecoinCore_JsonRpc,
				label: 'Litecoin Core JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LitecoinCore,
				source: Source.LitecoinCore_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:12a765e31ffd4059bada1e25190f6e98',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:9332',
						origin: 'http://127.0.0.1:9332',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LitecoinLips,
		label: 'Litecoin LIPs',
		sources: [
			{
				provider: SourceProvider.LitecoinLips,
				source: Source.LitecoinLips_Github,
				label: 'Litecoin LIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LitecoinLips,
				source: Source.LitecoinLips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'litecoin-project/lips@master:',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.LitecoinWalletRpc,
		label: 'Litecoin wallet RPC',
		sources: [
			{
				provider: SourceProvider.LitecoinWalletRpc,
				source: Source.LitecoinWalletRpc_JsonRpc,
				label: 'Litecoin wallet JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LitecoinWalletRpc,
				source: Source.LitecoinWalletRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'wallet-rpc',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:9332',
						origin: 'http://127.0.0.1:9332',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Local,
		label: 'Local',
		sources: [
			{
				provider: SourceProvider.Local,
				source: Source.Local_Internal,
				label: 'Local Internal',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Local,
				source: Source.Local_Internal,
				target: {
					kind: SourceTargetKind.Global,
					key: 'internal-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'src/resolvers/Local/Internal/catalog.ts',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LogosBlockchainNode,
		label: 'Logos blockchain node',
		sources: [
			{
				provider: SourceProvider.LogosBlockchainNode,
				source: Source.LogosBlockchainNode_Rest,
				label: 'Logos blockchain node REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LogosBlockchainNode,
				source: Source.LogosBlockchainNode_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'logos-testnet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:LOGOS_BLOCKCHAIN_NODE_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.LogosDocs,
		label: 'Logos docs',
		sources: [
			{
				provider: SourceProvider.LogosDocs,
				source: Source.LogosDocs_Rest,
				label: 'Logos docs',
			},
		],
		bindings: [
			{
				provider: SourceProvider.LogosDocs,
				source: Source.LogosDocs_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'docs',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://docs.logoslabs.io',
						origin: 'https://docs.logoslabs.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/LogosDocs/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Lotus,
		label: 'Lotus',
		sources: [
			{
				provider: SourceProvider.Lotus,
				source: Source.Lotus_JsonRpc,
				label: 'Lotus JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Lotus,
				source: Source.Lotus_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'fil:f',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.node.glif.io',
						origin: 'https://api.node.glif.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.FilecoinLotusJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Lotus/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Lotus,
				source: Source.Lotus_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'local-lotus',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:1234',
						origin: 'http://127.0.0.1:1234',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.FilecoinLotusJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Lotus/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Magic,
		label: 'Magic',
		sources: [
			{
				provider: SourceProvider.Magic,
				source: Source.Magic_HederaWalletApi,
				label: 'Magic Hedera wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Magic,
				source: Source.Magic_HederaWalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'magic-hedera',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'magic-hedera',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MagnetUri,
		label: 'Magnet URI',
		sources: [
			{
				provider: SourceProvider.MagnetUri,
				source: Source.MagnetUri_Uri,
				label: 'Magnet URI parser',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MagnetUri,
				source: Source.MagnetUri_Uri,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'magnet-uri',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'magnet-uri-parser',
					},
				],
				wireProtocol: WireProtocol.Uri,
				apiFamily: ApiFamily.UriScheme,
				operationGroups: [
					SourceOperationGroup.BitTorrentDhtLookup,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Martian,
		label: 'Martian',
		sources: [
			{
				provider: SourceProvider.Martian,
				source: Source.Martian_WalletApi,
				label: 'Martian wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Martian,
				source: Source.Martian_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'martian',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'martian',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Mastodon,
		label: 'Mastodon',
		env: arktype({
			'PUBLIC_MASTODON_ACCESS_TOKEN': 'string > 0?',
		}),
		sources: [
			{
				provider: SourceProvider.Mastodon,
				source: Source.Mastodon_Rest,
				label: 'Mastodon REST',
				env: arktype({
					'PUBLIC_MASTODON_ACCESS_TOKEN': 'string > 0?',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Mastodon,
				source: Source.Mastodon_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mastodon-compatible-activitypub',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mastodon.social',
						origin: 'https://mastodon.social',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://fosstodon.org',
						origin: 'https://fosstodon.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_MASTODON_ACCESS_TOKEN': 'string > 0?',
						}),
						keys: [
							'PUBLIC_MASTODON_ACCESS_TOKEN',
						],
					},
				],
				proxyId: 'Mastodon_Rest-201',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Mastodon/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Mcp,
		label: 'MCP',
		sources: [
			{
				provider: SourceProvider.Mcp,
				source: Source.McpDeclared_Protocol,
				label: 'Declared MCP server',
			},
			{
				provider: SourceProvider.Mcp,
				source: Source.McpPackageRegistry_Rest,
				label: 'MCP package registry REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Mcp,
				source: Source.McpDeclared_Protocol,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'declared-mcp-server',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'mcp',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.McpProtocol,
				operationGroups: [
					SourceOperationGroup.AgentCapabilityCatalog,
					SourceOperationGroup.AgentRuntimeInvocation,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Mcp,
				source: Source.McpPackageRegistry_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mcp-package-registry',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://registry.modelcontextprotocol.io/v0.1/servers',
						origin: 'https://registry.modelcontextprotocol.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AgentCapabilityCatalog,
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://registry.modelcontextprotocol.io',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.MempoolSpace,
		label: 'mempool.space',
		sources: [
			{
				provider: SourceProvider.MempoolSpace,
				source: Source.MempoolSpace_Rest,
				label: 'mempool.space REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MempoolSpace,
				source: Source.MempoolSpace_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:000000000019d6689c085ae165831e93',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mempool.space/api',
						origin: 'https://mempool.space',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://mempool.space',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.MetadataVision,
		label: 'Metadata Vision',
		sources: [
			{
				provider: SourceProvider.MetadataVision,
				source: Source.MetadataVision_Rest,
				label: 'Metadata Vision Open Graph',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MetadataVision,
				source: Source.MetadataVision_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'open-graph',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://og.metadata.vision',
						origin: 'https://og.metadata.vision',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'MetadataVision_Rest-205',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MetadataVision/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MetaplexDAS,
		label: 'Metaplex DAS',
		sources: [
			{
				provider: SourceProvider.MetaplexDAS,
				source: Source.MetaplexDAS_Rest,
				label: 'Metaplex DAS REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MetaplexDAS,
				source: Source.MetaplexDAS_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'metaplex-das-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{metaplex-das-api-host}',
						origin: 'https://{metaplex-das-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MevRelay,
		label: 'MEV-Boost relay',
		sources: [
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				label: 'MEV-Boost relay REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'boost-relay.flashbots.net',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://boost-relay.flashbots.net',
						origin: 'https://boost-relay.flashbots.net',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'MevRelay_Rest-207',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MevRelay/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'relay.ultrasound.money',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://relay.ultrasound.money',
						origin: 'https://relay.ultrasound.money',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'MevRelay_Rest-208',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MevRelay/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'builder-relay-sepolia.flashbots.net',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://builder-relay-sepolia.flashbots.net',
						origin: 'https://builder-relay-sepolia.flashbots.net',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'MevRelay_Rest-209',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MevRelay/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Mintscan,
		label: 'Mintscan',
		sources: [
			{
				provider: SourceProvider.Mintscan,
				source: Source.Mintscan_Rest,
				label: 'Mintscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Mintscan,
				source: Source.Mintscan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mintscan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{mintscan-api-host}',
						origin: 'https://{mintscan-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MistralAi,
		label: 'Mistral AI',
		sources: [
			{
				provider: SourceProvider.MistralAi,
				source: Source.MistralAi_Rest,
				label: 'Mistral AI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MistralAi,
				source: Source.MistralAi_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mistral-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.mistral.ai',
						origin: 'https://api.mistral.ai',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						keys: [
							'MISTRAL_API_KEY',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MlCommons,
		label: 'MLCommons',
		sources: [
			{
				provider: SourceProvider.MlCommons,
				source: Source.CroissantDocument_Local,
				label: 'Croissant document',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MlCommons,
				source: Source.CroissantDocument_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'croissant-document',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'selected-file-or-artifact',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.LocalParser,
				operationGroups: [
					SourceOperationGroup.AiDatasetMetadata,
					SourceOperationGroup.DocumentClaimExtraction,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Mlflow,
		label: 'MLflow',
		sources: [
			{
				provider: SourceProvider.Mlflow,
				source: Source.Mlflow_Rest,
				label: 'MLflow REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Mlflow,
				source: Source.Mlflow_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mlflow-tracking-server',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:MLFLOW_TRACKING_URL',
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MoneroDaemonRpc,
		label: 'Monero daemon RPC',
		sources: [
			{
				provider: SourceProvider.MoneroDaemonRpc,
				source: Source.MoneroDaemonRpc_JsonRpc,
				label: 'Monero daemon JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MoneroDaemonRpc,
				source: Source.MoneroDaemonRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'monero:418015bb9ae982a1975da7d79277c270',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://xmr-node.cakewallet.com:18081/json_rpc',
						origin: 'https://xmr-node.cakewallet.com:18081',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://nodes.hashvault.pro:18081/json_rpc',
						origin: 'http://nodes.hashvault.pro:18081',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.MoneroDaemonJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'MoneroDaemonRpc_JsonRpc-214',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.MoneroDaemonRpc,
				source: Source.MoneroDaemonRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'local-monerod',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:18081/json_rpc',
						origin: 'http://127.0.0.1:18081',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.MoneroDaemonJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.MoneroWalletRpc,
		label: 'Monero wallet RPC',
		sources: [
			{
				provider: SourceProvider.MoneroWalletRpc,
				source: Source.MoneroWalletRpc_JsonRpc,
				label: 'Monero wallet JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MoneroWalletRpc,
				source: Source.MoneroWalletRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'wallet-rpc',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:18083/json_rpc',
						origin: 'http://127.0.0.1:18083',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.NearBlocks,
		label: 'NearBlocks',
		sources: [
			{
				provider: SourceProvider.NearBlocks,
				source: Source.NearBlocks_Rest,
				label: 'NearBlocks REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NearBlocks,
				source: Source.NearBlocks_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'near',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.nearblocks.io',
						origin: 'https://api.nearblocks.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/NearBlocks/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.NearConnect,
		label: 'NEAR Connect',
		sources: [
			{
				provider: SourceProvider.NearConnect,
				source: Source.NearConnect_WalletApi,
				label: 'NEAR Connect wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NearConnect,
				source: Source.NearConnect_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'near-connect',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'near-connect',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.NearNeps,
		label: 'NEAR NEPs',
		sources: [
			{
				provider: SourceProvider.NearNeps,
				source: Source.NearNeps_Github,
				label: 'NEAR NEPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NearNeps,
				source: Source.NearNeps_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'near/NEPs@master:neps',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.NearRpc,
		label: 'NEAR RPC',
		sources: [
			{
				provider: SourceProvider.NearRpc,
				source: Source.NearRpc_JsonRpc,
				label: 'NEAR JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NearRpc,
				source: Source.NearRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'near',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.mainnet.near.org',
						origin: 'https://rpc.mainnet.near.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'NearRpc_JsonRpc-220',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/NearRpc/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.NearWalletSelector,
		label: 'NEAR Wallet Selector',
		sources: [
			{
				provider: SourceProvider.NearWalletSelector,
				source: Source.NearWalletSelector_WalletApi,
				label: 'NEAR Wallet Selector API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NearWalletSelector,
				source: Source.NearWalletSelector_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'near-wallet-selector',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'near-wallet-selector',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Neynar,
		label: 'Neynar',
		env: arktype({
			'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
		}),
		sources: [
			{
				provider: SourceProvider.Neynar,
				source: Source.Neynar_Rest,
				label: 'Neynar REST',
				env: arktype({
					'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Neynar,
				source: Source.Neynar_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.neynar.com',
						origin: 'https://api.neynar.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
						}),
						keys: [
							'PUBLIC_NEYNAR_API_KEY',
						],
					},
				],
				proxyId: 'Neynar_Rest-222',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Neynar/OpenApi/openapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Neynar/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/Neynar/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Nfid,
		label: 'NFID',
		sources: [
			{
				provider: SourceProvider.Nfid,
				source: Source.Nfid_WalletApi,
				label: 'NFID wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Nfid,
				source: Source.Nfid_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'nfid',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'nfid',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Nitro,
		label: 'Nitro',
		sources: [
			{
				provider: SourceProvider.Nitro,
				source: Source.Nitro_ClientStore,
				label: 'Nitro client store',
			},
			{
				provider: SourceProvider.Nitro,
				source: Source.Nitro_NodeRpc,
				label: 'Nitro node RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Nitro,
				source: Source.Nitro_ClientStore,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'nitro-client-store',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'nitro-client-store',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.LocalStateStore,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Nitro,
				source: Source.Nitro_NodeRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'nitro-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:NITRO_NODE_RPC_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Nodely,
		label: 'Nodely',
		sources: [
			{
				provider: SourceProvider.Nodely,
				source: Source.Nodely_Algod_Rest,
				label: 'Nodely Algod REST',
			},
			{
				provider: SourceProvider.Nodely,
				source: Source.Nodely_AlgorandIndexer_Rest,
				label: 'Nodely Algorand Indexer REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Nodely,
				source: Source.Nodely_Algod_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet-api.4160.nodely.dev',
						origin: 'https://mainnet-api.4160.nodely.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Nodely_Algod_Rest-226',
			},
			{
				provider: SourceProvider.Nodely,
				source: Source.Nodely_AlgorandIndexer_Rest,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet-idx.4160.nodely.dev',
						origin: 'https://mainnet-idx.4160.nodely.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Nodely_AlgorandIndexer_Rest-227',
			},
		],
	},
	{
		provider: SourceProvider.NostrBand,
		label: 'NostrBand',
		sources: [
			{
				provider: SourceProvider.NostrBand,
				source: Source.NostrBand_Rest,
				label: 'NostrBand REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NostrBand,
				source: Source.NostrBand_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.nostr.band',
						origin: 'https://api.nostr.band',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'NostrBand_Rest-228',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/NostrBand/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.NostrRelay,
		label: 'Nostr relay',
		sources: [
			{
				provider: SourceProvider.NostrRelay,
				source: Source.NostrRelay_Nip11_Http,
				label: 'Nostr relay NIP-11 HTTP',
			},
			{
				provider: SourceProvider.NostrRelay,
				source: Source.NostrRelay_WebSocket,
				label: 'Nostr relay WebSocket',
			},
		],
		bindings: [
			{
				provider: SourceProvider.NostrRelay,
				source: Source.NostrRelay_Nip11_Http,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'nostr-relay-nip11',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{relay-host}',
						origin: 'https://{relay-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.NostrRelay,
				operationGroups: [
					SourceOperationGroup.NostrRelayRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/NostrRelay/Http/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.NostrRelay,
				source: Source.NostrRelay_WebSocket,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'nostr-relay-websocket',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://{relay-host}',
					},
				],
				wireProtocol: WireProtocol.WebSocketMessages,
				apiFamily: ApiFamily.NostrRelay,
				operationGroups: [
					SourceOperationGroup.NostrRelayRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/NostrRelay/WebSocket/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{relay-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.OciRegistry,
		label: 'OCI Registry',
		sources: [
			{
				provider: SourceProvider.OciRegistry,
				source: Source.OciRegistry_Distribution,
				label: 'OCI distribution registry',
			},
		],
		bindings: [
			{
				provider: SourceProvider.OciRegistry,
				source: Source.OciRegistry_Distribution,
				target: {
					kind: SourceTargetKind.Global,
					key: 'oci-registry',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{registry}/v2',
						origin: 'https://{registry}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.OciDistribution,
				apiFamily: ApiFamily.OciDistributionApi,
				operationGroups: [
					SourceOperationGroup.SoftwareArtifactRegistry,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Ogmios,
		label: 'Ogmios',
		sources: [
			{
				provider: SourceProvider.Ogmios,
				source: Source.Ogmios_JsonRpc,
				label: 'Ogmios JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Ogmios,
				source: Source.Ogmios_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cip34:1-764824073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:OGMIOS_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.OneInchSwap,
		label: '1inch Swap',
		sources: [
			{
				provider: SourceProvider.OneInchSwap,
				source: Source.OneInchSwap_Rest,
				label: '1inch Swap REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.OneInchSwap,
				source: Source.OneInchSwap_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'one-inch-swap-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.1inch.dev',
						origin: 'https://api.1inch.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Onnx,
		label: 'ONNX',
		sources: [
			{
				provider: SourceProvider.Onnx,
				source: Source.OnnxArtifact_Local,
				label: 'ONNX artifact',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Onnx,
				source: Source.OnnxArtifact_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'onnx-artifact',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'selected-file-or-artifact',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.LocalParser,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.DocumentClaimExtraction,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.OpenAI,
		label: 'OpenAI',
		sources: [
			{
				provider: SourceProvider.OpenAI,
				source: Source.OpenAI_Rest,
				label: 'OpenAI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.OpenAI,
				source: Source.OpenAI_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'openai-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.openai.com',
						origin: 'https://api.openai.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.AiModelCatalog,
					SourceOperationGroup.AiProviderOperationCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'OpenAI_Rest-235',
				serverCredentialId: 'OpenAI_Rest-235',
			},
		],
		origins: [
			{
				origin: 'https://api.openai.com',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Openchain,
		label: 'Openchain',
		sources: [
			{
				provider: SourceProvider.Openchain,
				source: Source.Openchain_Rest,
				label: 'Openchain REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Openchain,
				source: Source.Openchain_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'evm-signatures',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.4byte.sourcify.dev/signature-database/v1',
						origin: 'https://api.4byte.sourcify.dev',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://www.4byte.directory/api/v1',
						origin: 'https://www.4byte.directory',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Openchain_Rest-236',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Openchain/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.OpenSea,
		label: 'OpenSea',
		sources: [
			{
				provider: SourceProvider.OpenSea,
				source: Source.OpenSea_Rest,
				label: 'OpenSea REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.OpenSea,
				source: Source.OpenSea_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'opensea-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.opensea.io',
						origin: 'https://api.opensea.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.OpenApiHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/OpenSea/OpenApi/openapi.json',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/OpenSea/OpenApi/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.OpenApiTypes,
						path: 'src/sources/OpenSea/OpenApi/openapi.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.OsmosisLCD,
		label: 'Osmosis LCD',
		sources: [
			{
				provider: SourceProvider.OsmosisLCD,
				source: Source.Osmosis_LCD_Rest,
				label: 'Osmosis LCD REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.OsmosisLCD,
				source: Source.Osmosis_LCD_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'cosmos:cosmoshub-4',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{osmosis-lcd-host}',
						origin: 'https://{osmosis-lcd-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.CosmosLcdApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Paraswap,
		label: 'ParaSwap',
		sources: [
			{
				provider: SourceProvider.Paraswap,
				source: Source.Paraswap_Rest,
				label: 'ParaSwap REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Paraswap,
				source: Source.Paraswap_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'paraswap-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://apiv5.paraswap.io',
						origin: 'https://apiv5.paraswap.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Paraswap_Rest-239',
			},
		],
	},
	{
		provider: SourceProvider.Pathfinder,
		label: 'Pathfinder',
		sources: [
			{
				provider: SourceProvider.Pathfinder,
				source: Source.Pathfinder_JsonRpc,
				label: 'Pathfinder JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Pathfinder,
				source: Source.Pathfinder_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'starknet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{pathfinder-rpc-host}',
						origin: 'https://{pathfinder-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.StarknetJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{pathfinder-rpc-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Payjoin,
		label: 'Payjoin',
		sources: [
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinOhttpRelay_Http,
				label: 'Payjoin OHTTP relay',
			},
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinReceiver_Http,
				label: 'Payjoin receiver HTTP',
			},
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinDirectory_Rest,
				label: 'Payjoin directory REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinOhttpRelay_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'ohttp-relay',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{payjoin-ohttp-relay-host}',
						origin: 'https://{payjoin-ohttp-relay-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinReceiver_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'receiver',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{payjoin-receiver-host}',
						origin: 'https://{payjoin-receiver-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinDirectory_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'directory',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://payjo.in',
						origin: 'https://payjo.in',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8080',
						origin: 'http://127.0.0.1:8080',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://localhost:8080',
						origin: 'http://localhost:8080',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'PayjoinDirectory_Rest-243',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Payjoin/Directory/Rest/queries.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Petra,
		label: 'Petra',
		sources: [
			{
				provider: SourceProvider.Petra,
				source: Source.Petra_WalletApi,
				label: 'Petra wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Petra,
				source: Source.Petra_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'petra',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'petra',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Piped,
		label: 'Piped',
		sources: [
			{
				provider: SourceProvider.Piped,
				source: Source.Piped_Rest,
				label: 'Piped API REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Piped,
				source: Source.Piped_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'piped-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.piped.private.coffee',
						origin: 'https://api.piped.private.coffee',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Piped/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.piped.private.coffee',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.PlugWallet,
		label: 'Plug Wallet',
		sources: [
			{
				provider: SourceProvider.PlugWallet,
				source: Source.PlugWallet_WalletApi,
				label: 'Plug Wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.PlugWallet,
				source: Source.PlugWallet_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'plug-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'plug',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Polkadot,
		label: 'Polkadot',
		sources: [
			{
				provider: SourceProvider.Polkadot,
				source: Source.Polkadot_JsonRpc,
				label: 'Polkadot JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Polkadot,
				source: Source.Polkadot_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.polkadot.io',
						origin: 'https://rpc.polkadot.io',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.SubstrateJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Polkadot/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://rpc.polkadot.io',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.PolkadotInjectedWeb3,
		label: 'Polkadot injected web3',
		sources: [
			{
				provider: SourceProvider.PolkadotInjectedWeb3,
				source: Source.PolkadotInjectedWeb3_WalletApi,
				label: 'Polkadot injected web3 wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.PolkadotInjectedWeb3,
				source: Source.PolkadotInjectedWeb3_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'polkadot-injected-web3',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'injectedWeb3',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.PolkadotRfcs,
		label: 'Polkadot RFCs',
		sources: [
			{
				provider: SourceProvider.PolkadotRfcs,
				source: Source.PolkadotRfcs_Github,
				label: 'Polkadot RFCs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.PolkadotRfcs,
				source: Source.PolkadotRfcs_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'polkadot-fellows/RFCs@main:text',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.Pontem,
		label: 'Pontem',
		sources: [
			{
				provider: SourceProvider.Pontem,
				source: Source.Pontem_WalletApi,
				label: 'Pontem wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Pontem,
				source: Source.Pontem_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'pontem',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'pontem',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Primal,
		label: 'Primal',
		sources: [
			{
				provider: SourceProvider.Primal,
				source: Source.Primal_Rest,
				label: 'Primal REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Primal,
				source: Source.Primal_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'primal-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.primal.net',
						origin: 'https://api.primal.net',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Primal_Rest-251',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Primal/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.PublicNode,
		label: 'PublicNode',
		sources: [
			{
				provider: SourceProvider.PublicNode,
				source: Source.Solana_JsonRpc,
				label: 'Solana JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.PublicNode,
				source: Source.Solana_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://solana-rpc.publicnode.com',
						origin: 'https://solana-rpc.publicnode.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.SolanaJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Solana_JsonRpc-276',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Solana/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.PublicNode,
				source: Source.Solana_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://solana-rpc.publicnode.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.SolanaJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Solana/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Pyth,
		label: 'Pyth',
		sources: [
			{
				provider: SourceProvider.Pyth,
				source: Source.Pyth_EvmContract,
				label: 'Pyth EVM contract catalog',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.Pyth_SolanaProgram,
				label: 'Pyth Solana program catalog',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythHermes_Rest,
				label: 'Pyth Hermes REST',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythBenchmarks_Rest,
				label: 'Pyth benchmarks REST',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythPriceFeedsCatalog_Rest,
				label: 'Pyth price feeds catalog REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Pyth,
				source: Source.Pyth_EvmContract,
				target: {
					kind: SourceTargetKind.Global,
					key: 'pyth-evm-contract-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'pyth-evm-contract-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.Pyth_SolanaProgram,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'pyth-solana-program-catalog',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.CatalogRows,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythHermes_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'pyth-hermes',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hermes.pyth.network',
						origin: 'https://hermes.pyth.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'PythHermes_Rest-254',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythBenchmarks_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'pyth-benchmarks',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://benchmarks.pyth.network',
						origin: 'https://benchmarks.pyth.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'PythBenchmarks_Rest-255',
			},
			{
				provider: SourceProvider.Pyth,
				source: Source.PythPriceFeedsCatalog_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'pyth-price-feeds-catalog',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://benchmarks.pyth.network',
						origin: 'https://benchmarks.pyth.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'PythPriceFeedsCatalog_Rest-256',
			},
		],
		origins: [
			{
				origin: 'https://hermes.pyth.network',
				corsEnabled: false,
			},
			{
				origin: 'https://benchmarks.pyth.network',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.qBittorrentWebUi,
		label: 'qBittorrent WebUI',
		sources: [
			{
				provider: SourceProvider.qBittorrentWebUi,
				source: Source.qBittorrentWebUi_Rest,
				label: 'qBittorrent WebUI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.qBittorrentWebUi,
				source: Source.qBittorrentWebUi_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'qbittorrent-client',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8080',
						origin: 'http://127.0.0.1:8080',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.QuilibriumDocs,
		label: 'Quilibrium docs',
		sources: [
			{
				provider: SourceProvider.QuilibriumDocs,
				source: Source.QuilibriumDocs_Rest,
				label: 'Quilibrium docs REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.QuilibriumDocs,
				source: Source.QuilibriumDocs_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'docs',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://docs.quilibrium.com',
						origin: 'https://docs.quilibrium.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://quilibrium.com',
						origin: 'https://quilibrium.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://docs.quilibrium.com',
				corsEnabled: true,
			},
			{
				origin: 'https://quilibrium.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.QuilibriumNode,
		label: 'Quilibrium node',
		sources: [
			{
				provider: SourceProvider.QuilibriumNode,
				source: Source.QuilibriumNode_Grpc,
				label: 'Quilibrium node gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.QuilibriumNode,
				source: Source.QuilibriumNode_Grpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'quilibrium',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:QUILIBRIUM_NODE_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/QuilibriumNode/Grpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.QuilibriumNodeMetrics,
		label: 'Quilibrium node metrics',
		sources: [
			{
				provider: SourceProvider.QuilibriumNodeMetrics,
				source: Source.QuilibriumNodeMetrics_Prometheus,
				label: 'Quilibrium node Prometheus',
			},
		],
		bindings: [
			{
				provider: SourceProvider.QuilibriumNodeMetrics,
				source: Source.QuilibriumNodeMetrics_Prometheus,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'quilibrium-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:QUILIBRIUM_NODE_PROMETHEUS_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Prometheus,
				apiFamily: ApiFamily.PrometheusText,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.QuilibriumNodeRpc,
		label: 'Quilibrium node RPC',
		sources: [
			{
				provider: SourceProvider.QuilibriumNodeRpc,
				source: Source.QuilibriumNodeRpc_Grpc,
				label: 'Quilibrium node gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.QuilibriumNodeRpc,
				source: Source.QuilibriumNodeRpc_Grpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'quilibrium',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:QUILIBRIUM_NODE_RPC_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/QuilibriumNodeRpc/Grpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Radicle,
		label: 'Radicle',
		sources: [
			{
				provider: SourceProvider.Radicle,
				source: Source.Radicle_Local,
				label: 'Radicle local repository',
			},
			{
				provider: SourceProvider.Radicle,
				source: Source.Radicle_Remote,
				label: 'Radicle remote repository',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Radicle,
				source: Source.Radicle_Local,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'radicle-repository',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'env:RADICLE_STORAGE_PATH',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.GitObject,
				operationGroups: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Radicle,
				source: Source.Radicle_Remote,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'radicle-repository',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:RADICLE_REMOTE_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.RadicleCli,
		label: 'Radicle CLI',
		sources: [
			{
				provider: SourceProvider.RadicleCli,
				source: Source.RadicleCli_Local,
				label: 'Radicle CLI local',
			},
		],
		bindings: [
			{
				provider: SourceProvider.RadicleCli,
				source: Source.RadicleCli_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'radicle-cli',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalProcess,
						locator: 'rad',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.LocalParser,
				operationGroups: [
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.RadicleNode,
		label: 'Radicle node',
		sources: [
			{
				provider: SourceProvider.RadicleNode,
				source: Source.RadicleNode_Control,
				label: 'Radicle node control API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.RadicleNode,
				source: Source.RadicleNode_Control,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'radicle-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:RADICLE_NODE_CONTROL_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.RepositoryMetadata,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Reddit,
		label: 'Reddit',
		env: arktype({
			'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
			'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.Reddit,
				source: Source.Reddit_Rest,
				label: 'Reddit OAuth REST',
				env: arktype({
					'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
					'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Reddit,
				source: Source.Reddit_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'oauth-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://oauth.reddit.com',
						origin: 'https://oauth.reddit.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://www.reddit.com',
						origin: 'https://www.reddit.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
							'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
						}),
						keys: [
							'PUBLIC_REDDIT_CLIENT_ID',
							'PUBLIC_REDDIT_CLIENT_SECRET',
						],
					},
				],
				proxyId: 'Reddit_Rest-266',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Reddit/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.RedditPublic,
		label: 'Reddit public JSON',
		sources: [
			{
				provider: SourceProvider.RedditPublic,
				source: Source.Reddit_PublicJson,
				label: 'Reddit public JSON',
			},
		],
		bindings: [
			{
				provider: SourceProvider.RedditPublic,
				source: Source.Reddit_PublicJson,
				target: {
					kind: SourceTargetKind.Global,
					key: 'reddit-public-json',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://www.reddit.com',
						origin: 'https://www.reddit.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Reddit_PublicJson-267',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/RedditPublic/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Reservoir,
		label: 'Reservoir',
		sources: [
			{
				provider: SourceProvider.Reservoir,
				source: Source.Reservoir_Rest,
				label: 'Reservoir REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Reservoir,
				source: Source.Reservoir_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'reservoir-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{reservoir-api-host}',
						origin: 'https://{reservoir-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Reth,
		label: 'Reth',
		sources: [
			{
				provider: SourceProvider.Reth,
				source: Source.Reth_JsonRpc,
				label: 'Reth JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Reth,
				source: Source.Reth_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'reth-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8545',
						origin: 'http://127.0.0.1:8545',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Rss,
		label: 'RSS / Atom',
		sources: [
			{
				provider: SourceProvider.Rss,
				source: Source.Rss_Rest,
				label: 'RSS / Atom direct fetch',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Rss,
				source: Source.Rss_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'https://hnrss.org',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hnrss.org',
						origin: 'https://hnrss.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Rss_Rest-270',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Rss/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Rss,
				source: Source.Rss_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'https://feeds.bbci.co.uk',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://feeds.bbci.co.uk',
						origin: 'https://feeds.bbci.co.uk',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Rss_Rest-271',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Rss/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Rss2Json,
		label: 'RSS2JSON',
		sources: [
			{
				provider: SourceProvider.Rss2Json,
				source: Source.Rss2Json_Rest,
				label: 'RSS2JSON API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Rss2Json,
				source: Source.Rss2Json_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'rss2json',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.rss2json.com',
						origin: 'https://api.rss2json.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Rss2Json_Rest-272',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Rss2Json/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.SigstoreRekor,
		label: 'Sigstore Rekor',
		sources: [
			{
				provider: SourceProvider.SigstoreRekor,
				source: Source.SigstoreRekor_Rest,
				label: 'Sigstore Rekor REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.SigstoreRekor,
				source: Source.SigstoreRekor_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'transparency-log',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rekor.sigstore.dev',
						origin: 'https://rekor.sigstore.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.SigstoreRekorApi,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Snapchain,
		label: 'Snapchain',
		sources: [
			{
				provider: SourceProvider.Snapchain,
				source: Source.Snapchain_Rest,
				label: 'Snapchain REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Snapchain,
				source: Source.Snapchain_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'farcaster-snapchain',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hub.pinata.cloud',
						origin: 'https://hub.pinata.cloud',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://snap.farcaster.xyz:3381',
						origin: 'https://snap.farcaster.xyz:3381',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://pop.farcaster.xyz:3381',
						origin: 'https://pop.farcaster.xyz:3381',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://haatz.quilibrium.com',
						origin: 'https://haatz.quilibrium.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Snapchain_Rest-274',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Snapchain/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.SpaceAndTime,
		label: 'Space and Time',
		sources: [
			{
				provider: SourceProvider.SpaceAndTime,
				source: Source.SpaceAndTime_MakeInfinite,
				label: 'Space and Time MakeInfinite',
			},
		],
		bindings: [
			{
				provider: SourceProvider.SpaceAndTime,
				source: Source.SpaceAndTime_MakeInfinite,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'eip155:1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://proxy.api.makeinfinite.dev',
						origin: 'https://proxy.api.makeinfinite.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
				proxyId: 'SpaceAndTime_MakeInfinite-275',
				serverCredentialId: 'SpaceAndTime_MakeInfinite-275',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/SpaceAndTime/MakeInfinite/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.SolanaMobileWalletAdapter,
		label: 'Solana Mobile Wallet Adapter',
		sources: [
			{
				provider: SourceProvider.SolanaMobileWalletAdapter,
				source: Source.SolanaMobileWalletAdapter_WalletApi,
				label: 'Solana Mobile Wallet Adapter API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.SolanaMobileWalletAdapter,
				source: Source.SolanaMobileWalletAdapter_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'solana-mobile-wallet-adapter',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'solana-mobile-wallet-adapter',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.SolanaSimds,
		label: 'Solana SIMDs',
		sources: [
			{
				provider: SourceProvider.SolanaSimds,
				source: Source.SolanaSimds_Github,
				label: 'Solana SIMDs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.SolanaSimds,
				source: Source.SolanaSimds_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'solana-foundation/solana-improvement-documents@main:proposals',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.Sourcify,
		label: 'Sourcify',
		sources: [
			{
				provider: SourceProvider.Sourcify,
				source: Source.Sourcify_Rest,
				label: 'Sourcify REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Sourcify,
				source: Source.Sourcify_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'repository',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sourcify.dev/server/v2',
						origin: 'https://sourcify.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.SourcifyRestV2,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Sourcify_Rest-280',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Sourcify/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Spdx,
		label: 'SPDX',
		sources: [
			{
				provider: SourceProvider.Spdx,
				source: Source.SpdxDocument_Local,
				label: 'SPDX document',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Spdx,
				source: Source.SpdxDocument_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'spdx-document',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'selected-file-or-artifact',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.LocalParser,
				operationGroups: [
					SourceOperationGroup.AiArtifactCatalog,
					SourceOperationGroup.DocumentClaimExtraction,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Sqd,
		label: 'SQD',
		sources: [
			{
				provider: SourceProvider.Sqd,
				source: Source.SqdPortal_RawHttp,
				label: 'SQD Portal',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Sqd,
				source: Source.SqdPortal_RawHttp,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
						origin: 'https://portal.sqd.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.SqdPortalStream,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'SqdPortal_RawHttp-282',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Sqd/Portal/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Starknet,
		label: 'Starknet',
		sources: [
			{
				provider: SourceProvider.Starknet,
				source: Source.Starknet_JsonRpc,
				label: 'Starknet JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Starknet,
				source: Source.Starknet_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'starknet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{starknet-rpc-host}',
						origin: 'https://{starknet-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.StarknetJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Starknet/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{starknet-rpc-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Starkscan,
		label: 'Starkscan',
		sources: [
			{
				provider: SourceProvider.Starkscan,
				source: Source.Starkscan_Rest,
				label: 'Starkscan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Starkscan,
				source: Source.Starkscan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'starkscan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{starkscan-api-host}',
						origin: 'https://{starkscan-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{starkscan-api-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.StellarExpert,
		label: 'StellarExpert',
		sources: [
			{
				provider: SourceProvider.StellarExpert,
				source: Source.StellarExpert_Rest,
				label: 'StellarExpert REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.StellarExpert,
				source: Source.StellarExpert_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'stellar-expert-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.stellar.expert',
						origin: 'https://api.stellar.expert',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'StellarExpert_Rest-285',
			},
		],
	},
	{
		provider: SourceProvider.StellarHorizon,
		label: 'Stellar Horizon',
		sources: [
			{
				provider: SourceProvider.StellarHorizon,
				source: Source.StellarHorizon_Rest,
				label: 'Stellar Horizon REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.StellarHorizon,
				source: Source.StellarHorizon_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'stellar-public-horizon',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://horizon.stellar.org',
						origin: 'https://horizon.stellar.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'StellarHorizon_Rest-286',
			},
		],
	},
	{
		provider: SourceProvider.StellarRpc,
		label: 'Stellar RPC',
		sources: [
			{
				provider: SourceProvider.StellarRpc,
				source: Source.StellarRpc_JsonRpc,
				label: 'Stellar RPC JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.StellarRpc,
				source: Source.StellarRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'stellar',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:STELLAR_RPC_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.StellarToml,
		label: 'Stellar TOML',
		sources: [
			{
				provider: SourceProvider.StellarToml,
				source: Source.StellarToml_Rest,
				label: 'Stellar TOML REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.StellarToml,
				source: Source.StellarToml_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'stellar-toml',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{domain}/.well-known/stellar.toml',
						origin: 'https://{domain}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.StoicWallet,
		label: 'Stoic Wallet',
		sources: [
			{
				provider: SourceProvider.StoicWallet,
				source: Source.StoicWallet_WalletApi,
				label: 'Stoic Wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.StoicWallet,
				source: Source.StoicWallet_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'stoic-wallet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'stoic',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Subscan,
		label: 'Subscan',
		env: arktype({
			'PUBLIC_SUBSCAN_API_KEY': 'string',
		}),
		sources: [
			{
				provider: SourceProvider.Subscan,
				source: Source.Subscan_Rest,
				label: 'Subscan REST',
				env: arktype({
					'PUBLIC_SUBSCAN_API_KEY': 'string',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Subscan,
				source: Source.Subscan_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://polkadot.api.subscan.io',
						origin: 'https://polkadot.api.subscan.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_SUBSCAN_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_SUBSCAN_API_KEY',
						],
					},
				],
				proxyId: 'Subscan_Rest-290',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Subscan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.SubstrateSidecar,
		label: 'Substrate API Sidecar',
		env: arktype({
			'[string]': 'string',
		}),
		sources: [
			{
				provider: SourceProvider.SubstrateSidecar,
				source: Source.SubstrateSidecar_Rest,
				label: 'Substrate API Sidecar REST',
				env: arktype({
					'[string]': 'string',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.SubstrateSidecar,
				source: Source.SubstrateSidecar_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'substrate-sidecar',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8080',
						origin: 'http://127.0.0.1:8080',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'SubstrateSidecar_Rest-291',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/SubstrateSidecar/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Sui,
		label: 'Sui',
		sources: [
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_Graphql,
				label: 'Sui GraphQL',
			},
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_Grpc,
				label: 'Sui gRPC',
			},
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_JsonRpc,
				label: 'Sui JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_Graphql,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'sui',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{sui-graphql-host}',
						origin: 'https://{sui-graphql-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Sui/Graphql/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_Grpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'sui',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:SUI_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.Sui,
				source: Source.Sui_JsonRpc,
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'sui',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{sui-rpc-host}',
						origin: 'https://{sui-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Superchain,
		label: 'Superchain',
		sources: [
			{
				provider: SourceProvider.Superchain,
				source: Source.Superchain_Github,
				label: 'Superchain GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Superchain,
				source: Source.Superchain_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'ethereum-optimism/superchain-registry@main:chainList.json',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Swarm,
		label: 'Swarm',
		sources: [
			{
				provider: SourceProvider.Swarm,
				source: Source.Swarm_Rest,
				label: 'Swarm Gateway',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Swarm,
				source: Source.Swarm_Rest,
				target: {
					kind: SourceTargetKind.ContentAddressScheme,
					key: 'swarm',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gateway.ethswarm.org',
						origin: 'https://gateway.ethswarm.org',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://bzz.link',
						origin: 'https://bzz.link',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.SwarmGateway,
				operationGroups: [
					SourceOperationGroup.ContentGatewayRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TezosDappetizer,
		label: 'Tezos Dappetizer',
		sources: [
			{
				provider: SourceProvider.TezosDappetizer,
				source: Source.TezosDappetizer_Postgres,
				label: 'Tezos Dappetizer Postgres',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TezosDappetizer,
				source: Source.TezosDappetizer_Postgres,
				target: {
					kind: SourceTargetKind.SqlDataset,
					key: 'tezos-dappetizer-dataset',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.PostgresDsn,
						locator: 'env:TEZOS_DAPPETIZER_DATABASE_URL',
					},
				],
				wireProtocol: WireProtocol.Sql,
				apiFamily: ApiFamily.Postgres,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
						env: arktype({
							'TEZOS_DAPPETIZER_DATABASE_URL': 'string',
						}),
						keys: [
							'TEZOS_DAPPETIZER_DATABASE_URL',
						],
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TezosNode,
		label: 'Tezos node RPC',
		sources: [
			{
				provider: SourceProvider.TezosNode,
				source: Source.TezosNode_Rpc,
				label: 'Tezos node RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TezosNode,
				source: Source.TezosNode_Rpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tezos:NetXdQprcVkpaWU',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{tezos-node-rpc-host}',
						origin: 'https://{tezos-node-rpc-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.TezosNodeRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{tezos-node-rpc-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.TheGraph,
		label: 'The Graph',
		sources: [
			{
				provider: SourceProvider.TheGraph,
				source: Source.TheGraph_Graphql,
				label: 'The Graph GraphQL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TheGraph,
				source: Source.TheGraph_Graphql,
				target: {
					kind: SourceTargetKind.Global,
					key: 'ens-subgraph',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gateway.thegraph.com/api/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
						origin: 'https://gateway.thegraph.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.Graphql,
				apiFamily: ApiFamily.GraphqlHttp,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_THEGRAPH_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_THEGRAPH_API_KEY',
						],
					},
				],
				proxyId: 'TheGraph_Graphql-299',
				artifacts: [
					{
						kind: SourceArtifactKind.GraphqlSchema,
						path: 'src/sources/TheGraph/Graphql/Ens/schema.graphql',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GraphqlSchema,
						path: 'src/sources/TheGraph/Graphql/Ens/schema.patch.graphql',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/TheGraph/Graphql/Ens/schema-source.ts',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GraphqlTypes,
						path: 'src/sources/TheGraph/Graphql/Ens/graphql-env.d.ts',
						generated: true,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ThreeXpl,
		label: '3xpl',
		sources: [
			{
				provider: SourceProvider.ThreeXpl,
				source: Source.ThreeXpl_Rest,
				label: '3xpl REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ThreeXpl,
				source: Source.ThreeXpl_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'json-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sandbox-api.3xpl.com',
						origin: 'https://sandbox-api.3xpl.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.3xpl.com',
						origin: 'https://api.3xpl.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/ThreeXpl/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TonApi,
		label: 'TonAPI',
		sources: [
			{
				provider: SourceProvider.TonApi,
				source: Source.TonApi_Rest,
				label: 'TonAPI REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TonApi,
				source: Source.TonApi_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'ton:-239',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://tonapi.io',
						origin: 'https://tonapi.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'TonApi_Rest-301',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TonApi/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TonCenter,
		label: 'TON Center',
		sources: [
			{
				provider: SourceProvider.TonCenter,
				source: Source.TonCenter_V2_Rest,
				label: 'TON Center v2 REST',
			},
			{
				provider: SourceProvider.TonCenter,
				source: Source.TonCenter_V3_Rest,
				label: 'TON Center v3 REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TonCenter,
				source: Source.TonCenter_V2_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'toncenter-v2',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{toncenter-v2-api-host}',
						origin: 'https://{toncenter-v2-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.TonCenter,
				source: Source.TonCenter_V3_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'toncenter-v3',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{toncenter-v3-api-host}',
						origin: 'https://{toncenter-v3-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TonConnect,
		label: 'TonConnect',
		sources: [
			{
				provider: SourceProvider.TonConnect,
				source: Source.TonConnect_WalletApi,
				label: 'TonConnect wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TonConnect,
				source: Source.TonConnect_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tonconnect',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'tonconnect',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Tonlib,
		label: 'tonlib',
		sources: [
			{
				provider: SourceProvider.Tonlib,
				source: Source.Tonlib_JsonRpc,
				label: 'tonlib JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Tonlib,
				source: Source.Tonlib_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'ton:-239',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'env:TONLIB_JSON_RPC_URL',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TonLiteServer,
		label: 'TON Lite Server',
		sources: [
			{
				provider: SourceProvider.TonLiteServer,
				source: Source.TonLiteServer_Adnl,
				label: 'TON Lite Server ADNL',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TonLiteServer,
				source: Source.TonLiteServer_Adnl,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'ton:-239',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:TON_LITE_SERVER_ADDRESS',
					},
				],
				wireProtocol: WireProtocol.Adnl,
				apiFamily: ApiFamily.TonLiteServerAdnl,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TonVerifier,
		label: 'TON Verifier',
		sources: [
			{
				provider: SourceProvider.TonVerifier,
				source: Source.TonVerifier_Rest,
				label: 'TON Verifier REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TonVerifier,
				source: Source.TonVerifier_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'ton-verifier',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{ton-verifier-api-host}',
						origin: 'https://{ton-verifier-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TradingView,
		label: 'TradingView',
		sources: [
			{
				provider: SourceProvider.TradingView,
				source: Source.TradingView_Rest,
				label: 'TradingView REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TradingView,
				source: Source.TradingView_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'crypto-scanner',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://scanner.tradingview.com',
						origin: 'https://scanner.tradingview.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'TradingView_Rest-308',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TradingView/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Transmission,
		label: 'Transmission',
		sources: [
			{
				provider: SourceProvider.Transmission,
				source: Source.TransmissionRpc_JsonRpc,
				label: 'Transmission RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Transmission,
				source: Source.TransmissionRpc_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'transmission-client',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:9091/transmission/rpc',
						origin: 'http://127.0.0.1:9091',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.BitTorrentClient,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronFullNode,
		label: 'TRON FullNode',
		env: arktype({
			'[string]': 'string',
		}),
		sources: [
			{
				provider: SourceProvider.TronFullNode,
				source: Source.TronFullNode_Rest,
				label: 'TRON FullNode REST',
				env: arktype({
					'[string]': 'string',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronFullNode,
				source: Source.TronFullNode_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tron-full-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8090',
						origin: 'http://127.0.0.1:8090',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'TronFullNode_Rest-310',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TronGrid/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronGrid,
		label: 'TronGrid',
		sources: [
			{
				provider: SourceProvider.TronGrid,
				source: Source.TronGrid_Rest,
				label: 'TronGrid REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronGrid,
				source: Source.TronGrid_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tron:0x2b6653dc',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.trongrid.io',
						origin: 'https://api.trongrid.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'TronGrid_Rest-311',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TronGrid/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronLink,
		label: 'TronLink',
		sources: [
			{
				provider: SourceProvider.TronLink,
				source: Source.TronLink_WalletApi,
				label: 'TronLink wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronLink,
				source: Source.TronLink_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tronlink',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'tronLink',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronScan,
		label: 'TRONSCAN',
		sources: [
			{
				provider: SourceProvider.TronScan,
				source: Source.TronScan_Rest,
				label: 'TRONSCAN REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronScan,
				source: Source.TronScan_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tron:0x2b6653dc',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://apilist.tronscanapi.com',
						origin: 'https://apilist.tronscanapi.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TronScan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronSolidityNode,
		label: 'TRON SolidityNode',
		env: arktype({
			'[string]': 'string',
		}),
		sources: [
			{
				provider: SourceProvider.TronSolidityNode,
				source: Source.TronSolidityNode_Rest,
				label: 'TRON SolidityNode REST',
				env: arktype({
					'[string]': 'string',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronSolidityNode,
				source: Source.TronSolidityNode_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tron-solidity-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8091',
						origin: 'http://127.0.0.1:8091',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'TronSolidityNode_Rest-314',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/TronGrid/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronTip1193,
		label: 'TRON TIP-1193',
		sources: [
			{
				provider: SourceProvider.TronTip1193,
				source: Source.TronTip1193_WalletApi,
				label: 'TRON TIP-1193 wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronTip1193,
				source: Source.TronTip1193_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tron-tip1193',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'tron-tip1193',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TronTip6963,
		label: 'TRON TIP-6963',
		sources: [
			{
				provider: SourceProvider.TronTip6963,
				source: Source.TronTip6963_WalletApi,
				label: 'TRON TIP-6963 wallet API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronTip6963,
				source: Source.TronTip6963_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'tron-tip6963',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'tron-tip6963',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.TrustWalletAssets,
		label: 'Trust Wallet Assets',
		sources: [
			{
				provider: SourceProvider.TrustWalletAssets,
				source: Source.TrustWalletAssets_Github,
				label: 'Trust Wallet Assets GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TrustWalletAssets,
				source: Source.TrustWalletAssets_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'trustwallet/assets@master:blockchains',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Tzkt,
		label: 'TzKT',
		sources: [
			{
				provider: SourceProvider.Tzkt,
				source: Source.Tzkt_Rest,
				label: 'TzKT REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Tzkt,
				source: Source.Tzkt_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tezos:NetXdQprcVkpaWU',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.tzkt.io',
						origin: 'https://api.tzkt.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Tzkt_Rest-318',
			},
		],
		origins: [
			{
				origin: 'https://api.tzkt.io',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.Voltaire,
		label: 'Voltaire',
		sources: [
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				label: 'Voltaire JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum.publicnode.com',
						origin: 'https://ethereum.publicnode.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.drpc.org',
						origin: 'https://eth.drpc.org',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://eth.llamarpc.com',
						origin: 'https://eth.llamarpc.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet.rpc.buidlguidl.com',
						origin: 'https://mainnet.rpc.buidlguidl.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://evm.stupidtech.net',
						origin: 'https://evm.stupidtech.net',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-319',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://ethereum.publicnode.com',
					},
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'ws://localhost:8545',
					},
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://eth.llamarpc.com',
					},
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://mainnet.rpc.buidlguidl.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet.optimism.io',
						origin: 'https://mainnet.optimism.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-321',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://mainnet.optimism.io',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '50',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://erpc.xinfin.network',
						origin: 'https://erpc.xinfin.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-323',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '50',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://erpc.xinfin.network',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '51',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.apothem.network',
						origin: 'https://rpc.apothem.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-325',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '51',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.apothem.network',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '56',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://binance.llamarpc.com',
						origin: 'https://binance.llamarpc.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-327',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '56',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://binance.llamarpc.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '130',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://unichain-rpc.publicnode.com',
						origin: 'https://unichain-rpc.publicnode.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-329',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '130',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://unichain-rpc.publicnode.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '137',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://polygon-rpc.com',
						origin: 'https://polygon-rpc.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-331',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '137',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://polygon-rpc.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '143',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.monad.xyz',
						origin: 'https://rpc.monad.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-333',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '143',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.monad.xyz',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '146',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.soniclabs.com',
						origin: 'https://rpc.soniclabs.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-335',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '146',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.soniclabs.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '300',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia.era.zksync.dev',
						origin: 'https://sepolia.era.zksync.dev',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-337',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '300',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://sepolia.era.zksync.dev',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '324',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet.era.zksync.io',
						origin: 'https://mainnet.era.zksync.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-339',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '324',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://mainnet.era.zksync.io',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '480',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://worldchain-mainnet.g.alchemy.com/public',
						origin: 'https://worldchain-mainnet.g.alchemy.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-341',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '480',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://worldchain-mainnet.g.alchemy.com/public',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '998',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hyperliquid-testnet.drpc.org',
						origin: 'https://hyperliquid-testnet.drpc.org',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '998',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://hyperliquid-testnet.drpc.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '999',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hyperliquid.drpc.org',
						origin: 'https://hyperliquid.drpc.org',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '999',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://hyperliquid.drpc.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1301',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia.unichain.org',
						origin: 'https://sepolia.unichain.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-347',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1301',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://sepolia.unichain.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1328',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://evm-rpc-testnet.sei-apis.com',
						origin: 'https://evm-rpc-testnet.sei-apis.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-349',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1328',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://evm-rpc-testnet.sei-apis.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1329',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://evm-rpc.sei-apis.com',
						origin: 'https://evm-rpc.sei-apis.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-351',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '1329',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://evm-rpc.sei-apis.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '4801',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://worldchain-sepolia.g.alchemy.com/public',
						origin: 'https://worldchain-sepolia.g.alchemy.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-353',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '4801',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://worldchain-sepolia.g.alchemy.com/public',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '8453',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mainnet.base.org',
						origin: 'https://mainnet.base.org',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://base.llamarpc.com',
						origin: 'https://base.llamarpc.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-355',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '8453',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://mainnet.base.org',
					},
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://base.llamarpc.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10143',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://testnet-rpc.monad.xyz',
						origin: 'https://testnet-rpc.monad.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-357',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '10143',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://testnet-rpc.monad.xyz',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '14601',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.testnet.soniclabs.com',
						origin: 'https://rpc.testnet.soniclabs.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-359',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '14601',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.testnet.soniclabs.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42161',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://arb1.arbitrum.io/rpc',
						origin: 'https://arb1.arbitrum.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-361',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42161',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://arb1.arbitrum.io/rpc',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42220',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://forno.celo.org',
						origin: 'https://forno.celo.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-363',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '42220',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://forno.celo.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '43113',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.avax-test.network/ext/bc/C/rpc',
						origin: 'https://api.avax-test.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-365',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '43113',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://api.avax-test.network/ext/bc/C/rpc',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '43114',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.avax.network/ext/bc/C/rpc',
						origin: 'https://api.avax.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-367',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '43114',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://api.avax.network/ext/bc/C/rpc',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '57073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc-gel.inkonchain.com',
						origin: 'https://rpc-gel.inkonchain.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-369',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '57073',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc-gel.inkonchain.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '59141',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.sepolia.linea.build',
						origin: 'https://rpc.sepolia.linea.build',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-371',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '59141',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.sepolia.linea.build',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '59144',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.linea.build',
						origin: 'https://rpc.linea.build',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-373',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '59144',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.linea.build',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '80002',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc-amoy.polygon.technology',
						origin: 'https://rpc-amoy.polygon.technology',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-375',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '80002',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc-amoy.polygon.technology',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '81224',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.codex.xyz',
						origin: 'https://rpc.codex.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-377',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '81224',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.codex.xyz',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '84532',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia.base.org',
						origin: 'https://sepolia.base.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-379',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '84532',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://sepolia.base.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '98866',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.plume.org',
						origin: 'https://rpc.plume.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-381',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '98866',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.plume.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '98867',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://testnet-rpc.plume.org',
						origin: 'https://testnet-rpc.plume.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-383',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '98867',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://testnet-rpc.plume.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '421614',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia-rollup.arbitrum.io/rpc',
						origin: 'https://sepolia-rollup.arbitrum.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-385',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '421614',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://sepolia-rollup.arbitrum.io/rpc',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '763373',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc-gel-sepolia.inkonchain.com',
						origin: 'https://rpc-gel-sepolia.inkonchain.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-387',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '763373',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc-gel-sepolia.inkonchain.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '812242',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.codex-stg.xyz',
						origin: 'https://rpc.codex-stg.xyz',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-389',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '812242',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.codex-stg.xyz',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '5042002',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.testnet.arc.network',
						origin: 'https://rpc.testnet.arc.network',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-391',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '5042002',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://rpc.testnet.arc.network',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11142220',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://forno.celo-sepolia.celo-testnet.org',
						origin: 'https://forno.celo-sepolia.celo-testnet.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-393',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11142220',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://forno.celo-sepolia.celo-testnet.org',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum-sepolia-rpc.publicnode.com',
						origin: 'https://ethereum-sepolia-rpc.publicnode.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-395',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://ethereum-sepolia-rpc.publicnode.com',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155420',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia.optimism.io',
						origin: 'https://sepolia.optimism.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Voltaire_JsonRpc-397',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '11155420',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://sepolia.optimism.io',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Voyager,
		label: 'Voyager',
		sources: [
			{
				provider: SourceProvider.Voyager,
				source: Source.Voyager_Rest,
				label: 'Voyager REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Voyager,
				source: Source.Voyager_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'voyager-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{voyager-api-host}',
						origin: 'https://{voyager-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://{voyager-api-host}',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.WakuNode,
		label: 'Waku node',
		sources: [
			{
				provider: SourceProvider.WakuNode,
				source: Source.WakuNode_Rest,
				label: 'Waku node REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.WakuNode,
				source: Source.WakuNode_Rest,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'waku-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8645',
						origin: 'http://127.0.0.1:8645',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.WalletConnect,
		label: 'WalletConnect',
		sources: [
			{
				provider: SourceProvider.WalletConnect,
				source: Source.WalletConnect_SignClient,
				label: 'WalletConnect sign client',
			},
		],
		bindings: [
			{
				provider: SourceProvider.WalletConnect,
				source: Source.WalletConnect_SignClient,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'walletconnect-sign-client',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'walletconnect',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.WalletStandard,
		label: 'Wallet Standard',
		sources: [
			{
				provider: SourceProvider.WalletStandard,
				source: Source.WalletStandard_WalletApi,
				label: 'Wallet Standard API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.WalletStandard,
				source: Source.WalletStandard_WalletApi,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'wallet-standard',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'wallet-standard',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.WebTorrent,
		label: 'WebTorrent',
		sources: [
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Client,
				label: 'WebTorrent client',
			},
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Dht,
				label: 'WebTorrent DHT',
			},
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Tracker,
				label: 'WebTorrent tracker',
			},
		],
		bindings: [
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Client,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'webtorrent-client',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'webtorrent-client',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.WebTorrentApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.BitTorrentAnnounce,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Dht,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'webtorrent-dht',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'webtorrent-dht',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.BitTorrentDht,
				operationGroups: [
					SourceOperationGroup.BitTorrentDhtLookup,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.WebTorrent,
				source: Source.WebTorrent_Tracker,
				target: {
					kind: SourceTargetKind.TorrentSwarm,
					key: 'webtorrent-tracker',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'env:WEBTORRENT_TRACKER_WS_URL',
					},
				],
				wireProtocol: WireProtocol.WebSocketMessages,
				apiFamily: ApiFamily.BitTorrentTracker,
				operationGroups: [
					SourceOperationGroup.BitTorrentAnnounce,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Wormholescan,
		label: 'Wormholescan',
		sources: [
			{
				provider: SourceProvider.Wormholescan,
				source: Source.Wormholescan_Rest,
				label: 'Wormholescan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Wormholescan,
				source: Source.Wormholescan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'wormholescan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{wormholescan-api-host}',
						origin: 'https://{wormholescan-api-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.X,
		label: 'X',
		env: arktype({
			'PUBLIC_X_API_BEARER': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.X,
				source: Source.X_Rest,
				label: 'X API v2',
				env: arktype({
					'PUBLIC_X_API_BEARER': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.X,
				source: Source.X_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'api-v2',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.x.com',
						origin: 'https://api.x.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_X_API_BEARER': 'string > 0',
						}),
						keys: [
							'PUBLIC_X_API_BEARER',
						],
					},
				],
				proxyId: 'X_Rest-407',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/X/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.X402,
		label: 'x402',
		sources: [
			{
				provider: SourceProvider.X402,
				source: Source.X402_Http,
				label: 'x402 HTTP',
			},
		],
		bindings: [
			{
				provider: SourceProvider.X402,
				source: Source.X402_Http,
				target: {
					kind: SourceTargetKind.Global,
					key: 'x402-http',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{origin}/{resource-path}',
						origin: 'https://{origin}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.RawHttp,
				apiFamily: ApiFamily.X402Protocol,
				operationGroups: [
					SourceOperationGroup.PaymentNegotiation,
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Xaman,
		label: 'Xaman',
		sources: [
			{
				provider: SourceProvider.Xaman,
				source: Source.Xaman_Api,
				label: 'Xaman API',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Xaman,
				source: Source.Xaman_Api,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'xaman',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.BrowserWalletProvider,
						locator: 'xaman',
					},
				],
				wireProtocol: WireProtocol.WalletProvider,
				apiFamily: ApiFamily.WalletApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Xmtp,
		label: 'XMTP',
		sources: [
			{
				provider: SourceProvider.Xmtp,
				source: Source.Xmtp_BrowserSdk,
				label: 'XMTP browser SDK',
			},
			{
				provider: SourceProvider.Xmtp,
				source: Source.Xmtp_NodeSdk,
				label: 'XMTP Node SDK',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Xmtp,
				source: Source.Xmtp_BrowserSdk,
				target: {
					kind: SourceTargetKind.Global,
					key: 'xmtp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'xmtp-browser-sdk',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.XmtpClientApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.UserDelegated,
					},
				],
			},
			{
				provider: SourceProvider.Xmtp,
				source: Source.Xmtp_NodeSdk,
				target: {
					kind: SourceTargetKind.Global,
					key: 'xmtp',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.InProcess,
						locator: 'xmtp-node-sdk',
					},
				],
				wireProtocol: WireProtocol.InProcess,
				apiFamily: ApiFamily.XmtpClientApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Xrpl,
		label: 'XRPL rippled',
		sources: [
			{
				provider: SourceProvider.Xrpl,
				source: Source.Xrpl_Rippled,
				label: 'XRPL rippled JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Xrpl,
				source: Source.Xrpl_Rippled,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'xrpl:0',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://s1.ripple.com:51234',
						origin: 'https://s1.ripple.com:51234',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'Xrpl_Rippled-412',
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Xrpl/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.XrplClio,
		label: 'XRPL Clio',
		sources: [
			{
				provider: SourceProvider.XrplClio,
				source: Source.XrplClio_JsonRpc,
				label: 'XRPL Clio JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.XrplClio,
				source: Source.XrplClio_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'xrpl:0',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://{xrpl-clio-host}',
						origin: 'https://{xrpl-clio-host}',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.RemoteQuery,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
			{
				provider: SourceProvider.XrplClio,
				source: Source.XrplClio_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'xrpl:0',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://{xrpl-clio-host}',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.GenericSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.XrpScan,
		label: 'XRPScan',
		sources: [
			{
				provider: SourceProvider.XrpScan,
				source: Source.XrpScan_Rest,
				label: 'XRPScan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.XrpScan,
				source: Source.XrpScan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'xrpscan-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.xrpscan.com',
						origin: 'https://api.xrpscan.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'XrpScan_Rest-415',
			},
		],
	},
	{
		provider: SourceProvider.Youtube,
		label: 'YouTube',
		env: arktype({
			'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
		}),
		sources: [
			{
				provider: SourceProvider.Youtube,
				source: Source.Youtube_Rest,
				label: 'YouTube Data API v3',
				env: arktype({
					'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
				}),
			},
		],
		bindings: [
			{
				provider: SourceProvider.Youtube,
				source: Source.Youtube_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'data-api-v3',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://www.googleapis.com',
						origin: 'https://www.googleapis.com',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.PublicConfig,
						env: arktype({
							'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_YOUTUBE_API_KEY',
						],
					},
				],
				proxyId: 'Youtube_Rest-416',
				artifacts: [
					{
						kind: SourceArtifactKind.GoogleDiscovery,
						path: 'src/sources/Youtube/Discovery/youtube-v3.json',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Youtube/Discovery/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ZcashClientBackend,
		label: 'zcash_client_backend',
		sources: [
			{
				provider: SourceProvider.ZcashClientBackend,
				source: Source.ZcashClientBackend_Local,
				label: 'zcash_client_backend local store',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ZcashClientBackend,
				source: Source.ZcashClientBackend_Local,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'zcash-client-backend',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.LocalFilePath,
						locator: 'env:ZCASH_CLIENT_BACKEND_PATH',
					},
				],
				wireProtocol: WireProtocol.LocalFile,
				apiFamily: ApiFamily.LocalStateStore,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.Zcashd,
		label: 'zcashd',
		sources: [
			{
				provider: SourceProvider.Zcashd,
				source: Source.Zcashd_JsonRpc,
				label: 'zcashd JSON-RPC',
			},
			{
				provider: SourceProvider.Zcashd,
				source: Source.ZcashdWallet_JsonRpc,
				label: 'zcashd wallet JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Zcashd,
				source: Source.Zcashd_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:00040fe8ec8471911baa1db1266ea15',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8232',
						origin: 'http://127.0.0.1:8232',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
			{
				provider: SourceProvider.Zcashd,
				source: Source.ZcashdWallet_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'wallet-rpc',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8232',
						origin: 'http://127.0.0.1:8232',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.WalletAccountRead,
					SourceOperationGroup.WalletSign,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ZcashLightwalletd,
		label: 'Zcash lightwalletd',
		sources: [
			{
				provider: SourceProvider.ZcashLightwalletd,
				source: Source.ZcashLightwalletd_Grpc,
				label: 'Zcash lightwalletd gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ZcashLightwalletd,
				source: Source.ZcashLightwalletd_Grpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:00040fe8ec8471911baa1db1266ea15',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.TcpAddress,
						locator: 'env:ZCASH_LIGHTWALLETD_GRPC_ENDPOINT',
					},
				],
				wireProtocol: WireProtocol.Grpc,
				apiFamily: ApiFamily.GrpcService,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.Proto,
						path: 'src/sources/ZcashLightwalletd/Grpc/proto',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/ZcashLightwalletd/Grpc/schema-source.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ZcashZips,
		label: 'Zcash ZIPs',
		sources: [
			{
				provider: SourceProvider.ZcashZips,
				source: Source.ZcashZips_Github,
				label: 'Zcash ZIPs GitHub',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ZcashZips,
				source: Source.ZcashZips_Github,
				target: {
					kind: SourceTargetKind.GitRepository,
					key: 'zcash/zips@master:zips',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.github.com',
						origin: 'https://api.github.com',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://raw.githubusercontent.com',
						origin: 'https://raw.githubusercontent.com',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.GithubContentsApi,
				operationGroups: [
					SourceOperationGroup.GithubRepositoryContents,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
			},
		],
		origins: [
			{
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
	},
	{
		provider: SourceProvider.Zebra,
		label: 'Zebra',
		sources: [
			{
				provider: SourceProvider.Zebra,
				source: Source.Zebra_JsonRpc,
				label: 'Zebra JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Zebra,
				source: Source.Zebra_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:00040fe8ec8471911baa1db1266ea15',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:8232',
						origin: 'http://127.0.0.1:8232',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.BitcoinJsonRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
			},
		],
		origins: [
			{
				origin: 'http://127.0.0.1:8232',
				corsEnabled: false,
			},
		],
	},
	{
		provider: SourceProvider.ZeroExSwap,
		label: '0x Swap',
		sources: [
			{
				provider: SourceProvider.ZeroExSwap,
				source: Source.ZeroExSwap_Rest,
				label: '0x Swap REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ZeroExSwap,
				source: Source.ZeroExSwap_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'zero-ex-swap-api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.0x.org',
						origin: 'https://api.0x.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.ServerOnly,
				credentials: [
					{
						scope: SourceCredentialScope.RuntimeSecret,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.ZeroG,
		label: '0G',
		sources: [
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGChain_JsonRpc,
				label: '0G Chain JSON-RPC',
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGStorageNode_JsonRpc,
				label: '0G Storage node JSON-RPC',
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGChainScan_Rest,
				label: '0G ChainScan REST',
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGStorageScan_Rest,
				label: '0G StorageScan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGChain_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '16661',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://evmrpc.0g.ai',
						origin: 'https://evmrpc.0g.ai',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				proxyId: 'ZeroGChain_JsonRpc-424',
				artifacts: [
					{
						kind: SourceArtifactKind.OpenRpcSpec,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGStorageNode_JsonRpc,
				target: {
					kind: SourceTargetKind.LocalDevice,
					key: 'local-0g-storage-node',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'http://127.0.0.1:5678',
						origin: 'http://127.0.0.1:5678',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.JsonRpcApi,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.LocalOnly,
				credentials: [
					{
						scope: SourceCredentialScope.LocalSecret,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/ZeroG/StorageNode/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGChainScan_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '16661',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://chainscan.0g.ai',
						origin: 'https://chainscan.0g.ai',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/ZeroG/ChainScan/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGStorageScan_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: '0g-storage-scan',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://storagescan.0g.ai',
						origin: 'https://storagescan.0g.ai',
						corsEnabled: true,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.RestJson,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.BrowserDirect,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/ZeroG/StorageScan/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
]

export const sourceProviders = sourceProviderDefinitions
