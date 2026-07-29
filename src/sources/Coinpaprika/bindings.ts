// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Coinpaprika_OpenApi]: typeof bindings[0] }>(bindings)
