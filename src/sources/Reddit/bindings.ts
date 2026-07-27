// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Reddit_Rest]: {
		source: Source.Reddit_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'oauth-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://oauth.reddit.com',
				origin: 'https://oauth.reddit.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://www.reddit.com',
				origin: 'https://www.reddit.com',
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
					'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
					'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
				}),
				keys: [
					'PUBLIC_REDDIT_CLIENT_ID',
					'PUBLIC_REDDIT_CLIENT_SECRET',
				],
			},
		],
		proxyId: '["Reddit_Rest","Global","oauth-api","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Reddit/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
