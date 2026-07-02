// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol } from '$/sources/SourceBinding.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { type } from 'arktype'

export const sourceProviderDefinitions: readonly SourceProviderDefinition[] = [
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
		provider: SourceProvider.Local,
		label: 'Local device',
		sources: [
			{
				provider: SourceProvider.Local,
				source: Source.Local_Internal,
				label: 'Local user state',
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
						locator: 'src/sources/Local/Internal/catalog.ts',
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
		provider: SourceProvider.AtprotoBsky,
		label: 'AT Protocol public appview',
		sources: [
			{
				provider: SourceProvider.AtprotoBsky,
				source: Source.Atproto_Xrpc,
				label: 'AT Protocol public XRPC',
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
		label: 'Bluesky social appview',
		sources: [
			{
				provider: SourceProvider.AtprotoBskySocial,
				source: Source.Atproto_BskySocial_Xrpc,
				label: 'Bluesky social XRPC',
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
	},
	{
		provider: SourceProvider.Allium,
		label: 'Allium',
		sources: [
			{
				provider: SourceProvider.Allium,
				source: Source.Allium_Rest,
				label: 'Allium REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Allium,
				source: Source.Allium_Rest,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: '*',
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
						env: type({
							'PUBLIC_ALLIUM_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_ALLIUM_API_KEY',
						],
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
					kind: SourceTargetKind.Caip2Network,
					key: 'tezos:*',
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
		sources: [
			{
				provider: SourceProvider.BeaconchaIn,
				source: Source.BeaconchaIn_Rest,
				label: 'Beaconcha.in REST',
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
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
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
					key: '11155111',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://sepolia.beaconcha.in/api/v1',
						origin: 'https://sepolia.beaconcha.in',
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
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
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
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
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
						keys: [
							'PUBLIC_BEACONCHAIN_API_KEY',
						],
					},
				],
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
	},
	{
		provider: SourceProvider.BitcoinCashBcmr,
		label: 'Bitcoin Cash BCMR',
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
					kind: SourceTargetKind.Caip2Network,
					key: 'bittensor:finney',
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
						keys: [
							'PUBLIC_BLOCKCHAIR_API_KEY',
						],
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Blockchair/Rest/types.ts',
						generated: false,
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
		provider: SourceProvider.Caips,
		label: 'CAIPs',
		sources: [
			{
				provider: SourceProvider.Caips,
				source: Source.Caips_Github,
				label: 'CAIPs GitHub',
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
						keys: [
							'PUBLIC_COINGECKO_DEMO_API_KEY',
							'PUBLIC_COINGECKO_PRO_API_KEY',
						],
					},
				],
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
						keys: [
							'PUBLIC_COINGECKO_DEMO_API_KEY',
							'PUBLIC_COINGECKO_PRO_API_KEY',
						],
					},
				],
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
		label: 'CoinMarketCap',
		sources: [
			{
				provider: SourceProvider.CoinMarketCap,
				source: Source.CoinMarketCap_Rest,
				label: 'CoinMarketCap REST',
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
						env: type({
							'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_COINMARKETCAP_API_KEY',
						],
					},
				],
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
						keys: [
							'PUBLIC_COINPAPRIKA_API_KEY',
						],
					},
				],
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
	},
	{
		provider: SourceProvider.CosmosChainRegistry,
		label: 'Cosmos Chain Registry',
		sources: [
			{
				provider: SourceProvider.CosmosChainRegistry,
				source: Source.CosmosChainRegistry_Github,
				label: 'Cosmos Chain Registry GitHub',
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
						locator: 'https://cosmos-rest.publicnode.com',
						origin: 'https://cosmos-rest.publicnode.com',
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
		provider: SourceProvider.Defillama,
		label: 'Defillama',
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
						env: type({
							'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_DEFILLAMA_PRO_API_KEY',
						],
					},
				],
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
						locator: 'https://api.dexscreener.com/latest/dex',
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
	},
	{
		provider: SourceProvider.Dune,
		label: 'Dune',
		sources: [
			{
				provider: SourceProvider.Dune,
				source: Source.Dune_Rest,
				label: 'Dune REST',
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
						keys: [
							'PUBLIC_DUNE_API_KEY',
						],
					},
				],
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
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Esplora/Rest/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Esplora,
				source: Source.Esplora_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
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
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Esplora/Rest/types.ts',
						generated: false,
					},
				],
			},
		],
	},
	{
		provider: SourceProvider.EthereumLists,
		label: 'Ethereum Lists',
		sources: [
			{
				provider: SourceProvider.EthereumLists,
				source: Source.EthereumLists_Rest,
				label: 'Ethereum Lists REST',
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
						locator: 'https://chainid.network/chains.json',
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
						env: type({
							'PUBLIC_ETHERSCAN_API_KEY': 'string',
						}),
						keys: [
							'PUBLIC_ETHERSCAN_API_KEY',
						],
					},
				],
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
					key: 'solana:mainnet',
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
						env: type({
							'PUBLIC_HELIUS_API_KEY': 'string > 0',
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
	},
	{
		provider: SourceProvider.Ipfs,
		label: 'IPFS',
		sources: [
			{
				provider: SourceProvider.Ipfs,
				source: Source.Ipfs_Rest,
				label: 'IPFS gateway',
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
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Ipfs/Rest/types.ts',
						generated: false,
					},
				],
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
					key: 'configured-lnd-node',
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
						keys: [
							'PUBLIC_LND_MACAROON_HEX',
							'PUBLIC_LND_REST_BASE_URL',
						],
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/LightningLnd/Rest/types.ts',
						generated: false,
					},
				],
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
					kind: SourceTargetKind.Caip2Network,
					key: 'lightning:mainnet',
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
	},
	{
		provider: SourceProvider.MetadataVision,
		label: 'Metadata Vision',
		sources: [
			{
				provider: SourceProvider.MetadataVision,
				source: Source.MetadataVision_Rest,
				label: 'Metadata Vision REST',
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
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://staging.li.quest',
						origin: 'https://staging.li.quest',
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
				artifacts: [
					{
						kind: SourceArtifactKind.OpenApiSpec,
						path: 'src/sources/Lifi/OpenApi/openapi.yaml',
						generated: false,
					},
					{
						kind: SourceArtifactKind.GenerationManifest,
						path: 'src/sources/Lifi/OpenApi/schema-source.ts',
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
					key: 'fil:mainnet',
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
		provider: SourceProvider.LogosDocs,
		label: 'Logos docs',
		sources: [
			{
				provider: SourceProvider.LogosDocs,
				source: Source.LogosDocs_Rest,
				label: 'Logos docs REST',
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
		provider: SourceProvider.Lens,
		label: 'Lens',
		sources: [
			{
				provider: SourceProvider.Lens,
				source: Source.Lens_Graphql,
				label: 'Lens GraphQL',
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
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.hey.xyz/graphql',
						origin: 'https://api.hey.xyz',
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
		provider: SourceProvider.MevRelay,
		label: 'MEV relay',
		sources: [
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				label: 'MEV relay REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.MevRelay,
				source: Source.MevRelay_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mev-relay',
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
					key: 'monero:mainnet',
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
					kind: SourceTargetKind.Caip2Network,
					key: 'near:mainnet',
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
					kind: SourceTargetKind.Caip2Network,
					key: 'near:mainnet',
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
		provider: SourceProvider.Neynar,
		label: 'Neynar',
		sources: [
			{
				provider: SourceProvider.Neynar,
				source: Source.Neynar_Rest,
				label: 'Neynar REST',
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
						keys: [
							'PUBLIC_NEYNAR_API_KEY',
						],
					},
				],
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
		provider: SourceProvider.Mastodon,
		label: 'Mastodon',
		sources: [
			{
				provider: SourceProvider.Mastodon,
				source: Source.Mastodon_Rest,
				label: 'Mastodon REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Mastodon,
				source: Source.Mastodon_Rest,
				target: {
					kind: SourceTargetKind.Global,
					key: 'mastodon-social',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://mastodon.social/api/v1',
						origin: 'https://mastodon.social',
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
					kind: SourceTargetKind.Global,
					key: 'fosstodon',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://fosstodon.org/api/v1',
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
						scope: SourceCredentialScope.None,
					},
				],
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
						origin: 'wss://{relay-host}',
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
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
					key: 'api',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.openchain.xyz',
						origin: 'https://api.openchain.xyz',
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
		provider: SourceProvider.Payjoin,
		label: 'Payjoin',
		sources: [
			{
				provider: SourceProvider.Payjoin,
				source: Source.PayjoinDirectory_Rest,
				label: 'Payjoin directory REST',
			},
		],
		bindings: [
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
		provider: SourceProvider.Piped,
		label: 'Piped',
		sources: [
			{
				provider: SourceProvider.Piped,
				source: Source.Piped_Rest,
				label: 'Piped REST',
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
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Piped/Rest/types.ts',
						generated: false,
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
	},
	{
		provider: SourceProvider.QuilibriumNodeRpc,
		label: 'Quilibrium node RPC',
		sources: [
			{
				provider: SourceProvider.QuilibriumNodeRpc,
				source: Source.QuilibriumNodeRpc_Grpc,
				label: 'Quilibrium node RPC gRPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.QuilibriumNodeRpc,
				source: Source.QuilibriumNodeRpc_Grpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
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
		provider: SourceProvider.Reddit,
		label: 'Reddit',
		sources: [
			{
				provider: SourceProvider.Reddit,
				source: Source.Reddit_Rest,
				label: 'Reddit REST',
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
						env: type({
							'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
							'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
						}),
						keys: [
							'PUBLIC_REDDIT_CLIENT_ID',
							'PUBLIC_REDDIT_CLIENT_SECRET',
						],
					},
				],
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
					kind: SourceTargetKind.Feed,
					key: 'reddit-public-json',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://www.reddit.com',
						origin: 'https://www.reddit.com',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://old.reddit.com',
						origin: 'https://old.reddit.com',
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
			},
		],
	},
	{
		provider: SourceProvider.Rss,
		label: 'RSS',
		sources: [
			{
				provider: SourceProvider.Rss,
				source: Source.Rss_Rest,
				label: 'RSS REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Rss,
				source: Source.Rss_Rest,
				target: {
					kind: SourceTargetKind.Feed,
					key: 'rss-feed',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://hnrss.org',
						origin: 'https://hnrss.org',
						corsEnabled: false,
					},
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
		label: 'rss2json',
		sources: [
			{
				provider: SourceProvider.Rss2Json,
				source: Source.Rss2Json_Rest,
				label: 'rss2json REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Rss2Json,
				source: Source.Rss2Json_Rest,
				target: {
					kind: SourceTargetKind.Feed,
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
						scope: SourceCredentialScope.PublicConfig,
						keys: [
							'PUBLIC_RSS2JSON_API_KEY',
						],
					},
				],
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
		provider: SourceProvider.Superchain,
		label: 'Superchain Registry',
		sources: [
			{
				provider: SourceProvider.Superchain,
				source: Source.Superchain_Github,
				label: 'Superchain Registry GitHub',
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
		provider: SourceProvider.Solana,
		label: 'Solana',
		sources: [
			{
				provider: SourceProvider.Solana,
				source: Source.Solana_JsonRpc,
				label: 'Solana JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Solana,
				source: Source.Solana_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:mainnet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://api.mainnet.solana.com',
						origin: 'https://api.mainnet.solana.com',
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
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Solana/JsonRpc/types.ts',
						generated: false,
					},
				],
			},
			{
				provider: SourceProvider.Solana,
				source: Source.Solana_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'solana:mainnet',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: 'wss://api.mainnet.solana.com',
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
		provider: SourceProvider.Subscan,
		label: 'Subscan',
		sources: [
			{
				provider: SourceProvider.Subscan,
				source: Source.Subscan_Rest,
				label: 'Subscan REST',
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
						keys: [
							'PUBLIC_SUBSCAN_API_KEY',
						],
					},
				],
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
		label: 'Substrate Sidecar',
		sources: [
			{
				provider: SourceProvider.SubstrateSidecar,
				source: Source.SubstrateSidecar_Rest,
				label: 'Substrate Sidecar REST',
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
						scope: SourceCredentialScope.PublicConfig,
						keys: [
							'PUBLIC_SUBSTRATE_SIDECAR_REST_BASE_URL',
						],
					},
				],
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
		provider: SourceProvider.Swarm,
		label: 'Swarm',
		sources: [
			{
				provider: SourceProvider.Swarm,
				source: Source.Swarm_Rest,
				label: 'Swarm gateway',
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
						locator: 'https://api.gateway.ethswarm.org',
						origin: 'https://api.gateway.ethswarm.org',
						corsEnabled: false,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://gateway.ethswarm.org',
						origin: 'https://gateway.ethswarm.org',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.HttpRest,
				apiFamily: ApiFamily.SwarmGateway,
				operationGroups: [
					SourceOperationGroup.ContentGatewayRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: [
					{
						kind: SourceArtifactKind.HandwrittenTypes,
						path: 'src/sources/Swarm/Rest/types.ts',
						generated: false,
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
					key: 'tezos-dappetizer',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.PostgresDsn,
						locator: 'TEZOS_DAPPETIZER_DATABASE_URL',
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
					key: 'tezos:*',
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://rpc.tzkt.io',
						origin: 'https://rpc.tzkt.io',
						corsEnabled: false,
					},
				],
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.TezosNodeRpc,
				operationGroups: [
					SourceOperationGroup.GenericRead,
				],
				delivery: SourceDelivery.HttpProxy,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
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
				label: 'The Graph ENS GraphQL',
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
						keys: [
							'PUBLIC_THEGRAPH_API_KEY',
						],
					},
				],
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
		provider: SourceProvider.TronFullNode,
		label: 'TRON full node',
		sources: [
			{
				provider: SourceProvider.TronFullNode,
				source: Source.TronFullNode_Rest,
				label: 'TRON full node REST',
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
						scope: SourceCredentialScope.PublicConfig,
						keys: [
							'PUBLIC_TRON_FULL_NODE_REST_BASE_URL',
						],
					},
				],
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
					key: 'tron:mainnet',
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
		provider: SourceProvider.TronScan,
		label: 'TronScan',
		sources: [
			{
				provider: SourceProvider.TronScan,
				source: Source.TronScan_Rest,
				label: 'TronScan REST',
			},
		],
		bindings: [
			{
				provider: SourceProvider.TronScan,
				source: Source.TronScan_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tron:mainnet',
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
		label: 'TRON solidity node',
		sources: [
			{
				provider: SourceProvider.TronSolidityNode,
				source: Source.TronSolidityNode_Rest,
				label: 'TRON solidity node REST',
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
						scope: SourceCredentialScope.PublicConfig,
						keys: [
							'PUBLIC_TRON_SOLIDITY_NODE_REST_BASE_URL',
						],
					},
				],
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
		provider: SourceProvider.TrustWalletAssets,
		label: 'Trust Wallet assets',
		sources: [
			{
				provider: SourceProvider.TrustWalletAssets,
				source: Source.TrustWalletAssets_Github,
				label: 'Trust Wallet assets GitHub',
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
					key: 'tezos:*',
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
						locator: 'https://eth.drpc.org',
						origin: 'https://eth.drpc.org',
						corsEnabled: true,
					},
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: 'https://ethereum.publicnode.com',
						origin: 'https://ethereum.publicnode.com',
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
				source: Source.ZeroGChainScan_Rest,
				label: '0G ChainScan REST',
			},
			{
				provider: SourceProvider.ZeroG,
				source: Source.ZeroGStorageNode_JsonRpc,
				label: '0G Storage node JSON-RPC',
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
	{
		provider: SourceProvider.X,
		label: 'X',
		sources: [
			{
				provider: SourceProvider.X,
				source: Source.X_Rest,
				label: 'X REST',
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
						env: type({
							'PUBLIC_X_API_BEARER': 'string > 0',
						}),
						keys: [
							'PUBLIC_X_API_BEARER',
						],
					},
				],
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
		provider: SourceProvider.Youtube,
		label: 'YouTube',
		sources: [
			{
				provider: SourceProvider.Youtube,
				source: Source.Youtube_Rest,
				label: 'YouTube REST',
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
						env: type({
							'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
						}),
						keys: [
							'PUBLIC_YOUTUBE_API_KEY',
						],
					},
				],
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
		provider: SourceProvider.Zcashd,
		label: 'zcashd',
		sources: [
			{
				provider: SourceProvider.Zcashd,
				source: Source.Zcashd_JsonRpc,
				label: 'zcashd JSON-RPC',
			},
		],
		bindings: [
			{
				provider: SourceProvider.Zcashd,
				source: Source.Zcashd_JsonRpc,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'bip122:00040fe8ec8471911baa1db1266ea15d',
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
					key: 'bip122:00040fe8ec8471911baa1db1266ea15d',
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
	},
]

export const sourceProviders = sourceProviderDefinitions
