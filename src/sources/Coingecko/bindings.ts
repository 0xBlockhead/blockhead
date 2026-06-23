import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const coingeckoHttpEndpoint = {
	endpointKind: SourceEndpointKind.HttpUrl,
	locator: 'https://api.coingecko.com/api/v3',
	origin: 'https://api.coingecko.com',
	corsEnabled: false,
} as const

const coingeckoCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		keys: [
			'PUBLIC_COINGECKO_DEMO_API_KEY',
			'PUBLIC_COINGECKO_PRO_API_KEY',
		],
	},
] as const

export const coingeckoBindings = [
	{
		provider: SourceProvider.Coingecko,
		source: Source.Coingecko_OpenApi,
		target: {
			kind: SourceTargetKind.Global,
			key: 'coingecko-demo',
		},
		endpoints: [
			coingeckoHttpEndpoint,
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: coingeckoCredentials,
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
			coingeckoHttpEndpoint,
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: coingeckoCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Coingecko/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
