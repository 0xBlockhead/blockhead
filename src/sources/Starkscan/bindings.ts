// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.Starkscan,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'starknet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.starkscan.co',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Starkscan/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Starkscan/OpenApi/openapi.yaml',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Starkscan/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[])
