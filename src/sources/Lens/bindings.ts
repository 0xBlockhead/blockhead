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

export const lensPublicEnv = arktype({
	PUBLIC_LENS_API_KEY: 'string',
})

const lensApiOrigin = 'https://api.lens.xyz' as const

export const lensBindings = [
	{
		provider: SourceProvider.Lens,
		source: Source.Lens_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lens-protocol',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: `${lensApiOrigin}/graphql`,
				origin: lensApiOrigin,
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					PUBLIC_LENS_API_KEY: 'string > 0?',
				}),
				keys: [
					'PUBLIC_LENS_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Lens/Graphql/schema.graphql',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Lens/Graphql/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Lens/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
