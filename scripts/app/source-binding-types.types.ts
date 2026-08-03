import {
	ApiFamily,
	Source,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceProvider,
	SourceTargetKind,
	WireProtocol,
	defineSources,
	type _SourceArtifact,
	type _SourceBinding,
} from '../../APP.ts'

const validHttpBinding = {
	target: {
		kind: SourceTargetKind.Global,
		key: 'fixture',
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://example.com',
			corsEnabled: true,
		},
	],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} as const satisfies _SourceBinding

const validEip155Target = {
	...validHttpBinding,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: '1',
	},
} as const satisfies _SourceBinding

const invalidEip155Target = {
	...validHttpBinding,
	// @ts-expect-error Eip155Chain keys are positive decimal integers.
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: 'arbitrary',
	},
} as const satisfies _SourceBinding

defineSources([
	{
		provider: SourceProvider.Across,
		label: 'Fixture',
	},
])([
	{
		source: Source.Across_Rest,
		provider: SourceProvider.Across,
		label: 'Valid fixture',
		binding: validHttpBinding,
	},
	{
		source: Source.Allium_Rest,
		// @ts-expect-error Source rows must reference a captured provider identifier.
		provider: 'Missing',
		label: 'Invalid provider fixture',
		binding: validHttpBinding,
	},
	{
		// @ts-expect-error Source rows must use a declared Source identifier.
		source: 'Unknown_Source',
		provider: SourceProvider.Across,
		label: 'Invalid source fixture',
		binding: validHttpBinding,
	},
])

defineSources([
	{
		provider: SourceProvider.Across,
		label: 'Invalid provider env fixture',
		// @ts-expect-error Environment requirements belong to executable binding credentials.
		env: {
			keys: [],
		},
	},
])([])

defineSources([
	{
		provider: SourceProvider.Across,
		label: 'Fixture',
	},
])([
	{
		source: Source.Across_Rest,
		provider: SourceProvider.Across,
		label: 'Invalid source env fixture',
		binding: validHttpBinding,
		// @ts-expect-error Environment requirements belong to executable binding credentials.
		env: {
			keys: [],
		},
	},
])

const invalidProtocolFamily = {
	...validHttpBinding,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.RestJson,
	// @ts-expect-error RestJson is incompatible with JsonRpc2.
} as const satisfies _SourceBinding

const invalidProtocolEndpoint = {
	...validHttpBinding,
	endpoints: [
		{
			endpointKind: SourceEndpointKind.TcpAddress,
			locator: '127.0.0.1:50051',
		},
	],
	// @ts-expect-error HttpRest requires HTTP endpoints.
} as const satisfies _SourceBinding

const validGrpcTcpEndpoint = {
	...validHttpBinding,
	endpoints: [
		{
			endpointKind: SourceEndpointKind.TcpAddress,
			locator: 'mainnet-public.mirrornode.hedera.com:443',
		},
	],
	wireProtocol: WireProtocol.Grpc,
	apiFamily: ApiFamily.GrpcService,
	delivery: SourceDelivery.RemoteQuery,
} as const satisfies _SourceBinding

const invalidGrpcWebSocketEndpoint = {
	...validGrpcTcpEndpoint,
	endpoints: [
		{
			endpointKind: SourceEndpointKind.WebSocketUrl,
			locator: 'wss://example.test/grpc',
		},
	],
	// @ts-expect-error GrpcService accepts HTTP and TCP endpoints, not WebSocket endpoints.
} as const satisfies _SourceBinding

const validSqdPortalRawHttp = {
	...validHttpBinding,
	wireProtocol: WireProtocol.RawHttp,
	apiFamily: ApiFamily.SqdPortalStream,
} as const satisfies _SourceBinding

const invalidSqdPortalHttpRest = {
	...validSqdPortalRawHttp,
	wireProtocol: WireProtocol.HttpRest,
	// @ts-expect-error SqdPortalStream requires RawHttp.
} as const satisfies _SourceBinding

const invalidBencodeDhtTcp = {
	...validGrpcTcpEndpoint,
	wireProtocol: WireProtocol.Bencode,
	apiFamily: ApiFamily.BitTorrentDht,
	// @ts-expect-error BitTorrentDht over Bencode uses UDP endpoints.
} as const satisfies _SourceBinding

const invalidCardanoInProcessEndpoint = {
	...validGrpcTcpEndpoint,
	endpoints: [{
		endpointKind: SourceEndpointKind.InProcess,
		locator: 'cardano-local-state-query',
	}],
	wireProtocol: WireProtocol.InProcess,
	apiFamily: ApiFamily.CardanoLocalStateQuery,
	// @ts-expect-error CardanoLocalStateQuery uses a local process endpoint.
} as const satisfies _SourceBinding

const invalidBitcoinWebSocketEndpoint = {
	...validGrpcTcpEndpoint,
	endpoints: [{
		endpointKind: SourceEndpointKind.WebSocketUrl,
		locator: 'wss://example.test/bitcoin',
	}],
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.BitcoinJsonRpc,
	// @ts-expect-error BitcoinJsonRpc uses HTTP endpoints.
} as const satisfies _SourceBinding

const invalidNostrHttpEndpoint = {
	...validHttpBinding,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.NostrRelay,
	// @ts-expect-error NostrRelay over JsonRpc2 uses WebSocket endpoints.
} as const satisfies _SourceBinding

const invalidXrpcLexiconWebSocketEndpoint = {
	...invalidBitcoinWebSocketEndpoint,
	wireProtocol: WireProtocol.Xrpc,
	apiFamily: ApiFamily.XrpcLexicon,
	// @ts-expect-error XrpcLexicon uses HTTP endpoints.
} as const satisfies _SourceBinding

const invalidRemoteLiveDelivery = {
	...validHttpBinding,
	delivery: SourceDelivery.RemoteLive,
	// @ts-expect-error RemoteLive requires a WebSocket endpoint.
} as const satisfies _SourceBinding

const validManagedGrpcRemoteLive = {
	...validHttpBinding,
	wireProtocol: WireProtocol.Grpc,
	apiFamily: ApiFamily.GrpcService,
	delivery: SourceDelivery.RemoteLive,
} as const satisfies _SourceBinding

const invalidManagedGrpcTcpRemoteLive = {
	...validGrpcTcpEndpoint,
	delivery: SourceDelivery.RemoteLive,
	// @ts-expect-error Managed gRPC RemoteLive requires HTTP endpoints.
} as const satisfies _SourceBinding

const invalidEmptyEndpoints = {
	...validHttpBinding,
	// @ts-expect-error Source bindings require at least one endpoint.
	endpoints: [],
} as const satisfies _SourceBinding

const invalidEmptyOperationGroups = {
	...validHttpBinding,
	// @ts-expect-error Source bindings require at least one operation group.
	operationGroups: [],
} as const satisfies _SourceBinding

const invalidBrowserCredential = {
	...validHttpBinding,
	credentials: [
		{
			scope: SourceCredentialScope.RuntimeSecret,
		},
	],
	// @ts-expect-error Browser delivery cannot carry runtime secrets.
} as const satisfies _SourceBinding

const validRuntimeSecretProxyHeader = {
	...validHttpBinding,
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		injection: {
			header: {
				name: 'Authorization',
				prefix: 'Bearer ',
			},
		},
	}],
} as const satisfies _SourceBinding

const validRuntimeSecretProxyQuery = {
	...validRuntimeSecretProxyHeader,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		injection: {
			query: {
				name: 'api_key',
			},
		},
	}],
} as const satisfies _SourceBinding

const validRuntimeSecretProxyTemplate = {
	...validRuntimeSecretProxyHeader,
	endpoints: [{
		...validHttpBinding.endpoints[0],
		locator: 'https://example.com/{apiKey}',
	}],
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'apiKey',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidRuntimeSecretProxyMissingEnvKey = {
	...validRuntimeSecretProxyHeader,
	// @ts-expect-error Runtime-secret proxy credentials require an environment key.
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		injection: {
			header: {
				name: 'Authorization',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidRuntimeSecretProxyMissingInjection = {
	...validRuntimeSecretProxyHeader,
	// @ts-expect-error Runtime-secret proxy credentials require an injection placement.
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
	}],
} as const satisfies _SourceBinding

const invalidRuntimeSecretProxyMixedPlacement = {
	...validRuntimeSecretProxyHeader,
	// @ts-expect-error Runtime-secret proxy credentials use one injection placement.
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		injection: {
			header: {
				name: 'Authorization',
			},
			query: {
				name: 'api_key',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidRuntimeSecretProxyLiteral = {
	...validRuntimeSecretProxyHeader,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		// @ts-expect-error Runtime-secret proxy declarations cannot contain literal values.
		value: 'literal-secret',
		injection: {
			header: {
				name: 'Authorization',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidRuntimeSecretProxyMultiple = {
	...validRuntimeSecretProxyHeader,
	credentials: [
		...validRuntimeSecretProxyHeader.credentials,
		...validRuntimeSecretProxyHeader.credentials,
	],
// @ts-expect-error HttpProxy accepts at most one runtime-secret credential.
} as const satisfies _SourceBinding

const invalidPublicProxyInjection = {
	...validRuntimeSecretProxyHeader,
	credentials: [{
		scope: SourceCredentialScope.PublicConfig,
		// @ts-expect-error Public credentials cannot declare trusted proxy injection.
		envKey: 'PUBLIC_FIXTURE_API_KEY',
		injection: {
			header: {
				name: 'Authorization',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidServerOnlyProxyInjection = {
	...validRuntimeSecretProxyHeader,
	delivery: SourceDelivery.ServerOnly,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		// @ts-expect-error Injection placement belongs only to managed HttpProxy/RemoteLive runtime secrets.
		envKey: 'FIXTURE_API_KEY',
		injection: {
			header: {
				name: 'Authorization',
			},
		},
	}],
} as const satisfies _SourceBinding

const invalidManagedRuntimeSecretKeys = {
	...validRuntimeSecretProxyHeader,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'FIXTURE_API_KEY',
		injection: {
			header: {
				name: 'Authorization',
			},
		},
		// @ts-expect-error Managed runtime secrets cannot also declare requirement keys.
		keys: ['FIXTURE_API_KEY'],
	}],
} as const satisfies _SourceBinding

const invalidWalletOperation = {
	...validHttpBinding,
	wireProtocol: WireProtocol.WalletProvider,
	apiFamily: ApiFamily.WalletApi,
	endpoints: [
		{
			endpointKind: SourceEndpointKind.BrowserWalletProvider,
			locator: 'browser:wallet',
		},
	],
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	// @ts-expect-error WalletApi only exposes wallet operation groups.
} as const satisfies _SourceBinding

const invalidOpenApiArtifact = {
	...validHttpBinding,
	apiFamily: ApiFamily.OpenApiHttp,
	artifacts: [
		{
			kind: SourceArtifactKind.GraphqlSchema,
			path: 'schema.graphql',
		},
	],
	// @ts-expect-error OpenApiHttp cannot own GraphQL artifacts.
} as const satisfies _SourceBinding

const invalidEvmOperation = {
	...validHttpBinding,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	// @ts-expect-error EvmExecutionJsonRpc only exposes EVM RPC operation groups.
} as const satisfies _SourceBinding

const invalidEvmArtifact = {
	...validHttpBinding,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	artifacts: [
		{
			kind: SourceArtifactKind.OpenApiSpec,
			path: 'openapi.json',
		},
	],
	// @ts-expect-error EvmExecutionJsonRpc only owns OpenRPC artifacts and generation manifests.
} as const satisfies _SourceBinding

const invalidHandwrittenOfficialArtifact = {
	kind: SourceArtifactKind.HandwrittenTypes,
	path: 'types.ts',
	// @ts-expect-error Handwritten types cannot declare an official artifact URL.
	officialUrl: 'https://example.test/openapi.json',
} as const satisfies _SourceArtifact<SourceArtifactKind.HandwrittenTypes>

const invalidFalseGeneratedArtifact = {
	...validHttpBinding,
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'types.ts',
			// @ts-expect-error Absence denotes handwritten; generated only records true.
			generated: false,
		},
	],
} as const satisfies _SourceBinding

const invalidPublicConfigKeys = {
	...validHttpBinding,
	credentials: [
		{
			scope: SourceCredentialScope.PublicConfig,
			env: {
				keys: [{
					name: 'PUBLIC_FIXTURE_KEY',
					type: 'string',
				}],
			},
			// @ts-expect-error Public config keys derive from the env schema.
			keys: ['PUBLIC_FIXTURE_KEY'],
		},
	],
} as const satisfies _SourceBinding

const validPublicConfigEnv = {
	...validHttpBinding,
	credentials: [{
		scope: SourceCredentialScope.PublicConfig,
		env: {
			keys: [{
				name: 'PUBLIC_FIXTURE_KEY',
				type: 'string',
			}],
		},
	}],
} as const satisfies _SourceBinding

const invalidGeneratedReferenceArtifact = {
	kind: SourceArtifactKind.OpenApiTypes,
	path: 'openapi.d.ts',
	generated: true,
	// @ts-expect-error Generated official artifacts cannot declare a documentation reference URL.
	referenceUrl: 'https://example.test/docs',
} as const satisfies _SourceArtifact<SourceArtifactKind.OpenApiTypes>

void [
	invalidProtocolFamily,
	invalidProtocolEndpoint,
	validGrpcTcpEndpoint,
	invalidGrpcWebSocketEndpoint,
	validSqdPortalRawHttp,
	invalidSqdPortalHttpRest,
	invalidBencodeDhtTcp,
	invalidCardanoInProcessEndpoint,
	invalidBitcoinWebSocketEndpoint,
	invalidNostrHttpEndpoint,
	invalidXrpcLexiconWebSocketEndpoint,
	invalidRemoteLiveDelivery,
	validManagedGrpcRemoteLive,
	invalidManagedGrpcTcpRemoteLive,
	invalidEmptyEndpoints,
	invalidEmptyOperationGroups,
	invalidBrowserCredential,
	validRuntimeSecretProxyHeader,
	validRuntimeSecretProxyQuery,
	validRuntimeSecretProxyTemplate,
	invalidRuntimeSecretProxyMissingEnvKey,
	invalidRuntimeSecretProxyMissingInjection,
	invalidRuntimeSecretProxyMixedPlacement,
	invalidRuntimeSecretProxyLiteral,
	invalidRuntimeSecretProxyMultiple,
	invalidPublicProxyInjection,
	invalidServerOnlyProxyInjection,
	invalidManagedRuntimeSecretKeys,
	invalidWalletOperation,
	invalidOpenApiArtifact,
	invalidEvmOperation,
	invalidEvmArtifact,
	invalidHandwrittenOfficialArtifact,
	invalidGeneratedReferenceArtifact,
	validPublicConfigEnv,
]
