// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.OpenSea_Rest]: typeof bindings[0] }>(bindings)
