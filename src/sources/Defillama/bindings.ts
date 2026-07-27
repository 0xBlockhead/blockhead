// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Defillama_OpenApi]: {
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
		proxyId: '["Defillama_OpenApi","Global","coins-openapi","HttpProxy","OpenApiHttp"]',
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
	[Source.Defillama_Rest]: {
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
		proxyId: '["Defillama_Rest","Global","coins-pro-rest","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Defillama/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
