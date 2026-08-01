// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
		source: Source.Bithomp,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'xrpl:0',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://bithomp.com/api/v2/',
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
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_BITHOMP_API_KEY': 'string > 0',
				}),
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Bithomp/OpenApi/openapi.yaml',
				generated: true,
				officialUrl: 'https://raw.githubusercontent.com/Bithomp/slate/master/source/bithomp-dhali.yaml',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Bithomp/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Bithomp/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
