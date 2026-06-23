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
import { youtubeApiOrigin } from '$/sources/Youtube/Rest/constants.ts'

export const youtubePublicEnv = arktype({
	PUBLIC_YOUTUBE_API_KEY: 'string > 0',
})

export const youtubeBindings = [
	{
		provider: SourceProvider.Youtube,
		source: Source.Youtube_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'data-api-v3',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: youtubeApiOrigin,
				origin: youtubeApiOrigin,
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
				keys: [
					'PUBLIC_YOUTUBE_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GoogleDiscovery,
				path: 'src/sources/Youtube/Discovery/youtube-v3.json',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Youtube/Discovery/schema-source.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
