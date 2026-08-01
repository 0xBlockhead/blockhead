// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const coinpaprikaRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

const bindings = [
	{
		source: Source.Coinpaprika_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'free-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.coinpaprika.com/v1',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: coinpaprikaRestGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Coinpaprika/OpenApi/openapi.yml',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Coinpaprika/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Coinpaprika/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.Coinpaprika_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pro-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api-pro.coinpaprika.com/v1',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: coinpaprikaRestGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_COINPAPRIKA_API_KEY': 'string > 0?',
				}),
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
