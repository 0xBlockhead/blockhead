// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Youtube_Rest]: {
		source: Source.Youtube_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'data-api-v3',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://www.googleapis.com',
				origin: 'https://www.googleapis.com',
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
				env: arktype({
					'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
				}),
				keys: [
					'PUBLIC_YOUTUBE_API_KEY',
				],
			},
		],
		proxyId: '["Youtube_Rest","Global","data-api-v3","HttpProxy","RestJson"]',
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
} as const satisfies SourceBindingIndex
