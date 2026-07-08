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
import { origin } from '$/sources/Neynar/Rest/constants.ts'

export const neynarPublicEnv = arktype({
	PUBLIC_NEYNAR_API_KEY: 'string > 0?',
})

export const neynarBindings = [
	{
		provider: SourceProvider.Neynar,
		source: Source.Neynar_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: origin,
				origin,
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
				env: neynarPublicEnv,
				keys: [
					'PUBLIC_NEYNAR_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Neynar/OpenApi/openapi.yaml',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Neynar/OpenApi/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Neynar/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
