// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Dexscreener_OpenApi]: typeof bindings[0] }>(bindings)
