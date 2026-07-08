import { type as arktype } from 'arktype'

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
import {
	freeBaseUrl,
	freeOrigin,
	proBaseUrl,
	proOrigin,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'

export const coinpaprikaPublicEnv = arktype({
	PUBLIC_COINPAPRIKA_API_KEY: 'string > 0?',
})

export const coinpaprikaBindings = [
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
				locator: freeBaseUrl,
				origin: freeOrigin,
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: proBaseUrl,
				origin: proOrigin,
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
				env: coinpaprikaPublicEnv,
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
