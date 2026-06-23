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
	redditOauthOrigin,
	redditWwwOrigin,
} from '$/sources/Reddit/Rest/constants.ts'

export const redditPublicEnv = arktype({
	PUBLIC_REDDIT_CLIENT_ID: 'string > 0',
	PUBLIC_REDDIT_CLIENT_SECRET: 'string > 0',
})

export const redditBindings = [
	{
		provider: SourceProvider.Reddit,
		source: Source.Reddit_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'oauth-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: redditOauthOrigin,
				origin: redditOauthOrigin,
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: redditWwwOrigin,
				origin: redditWwwOrigin,
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
					'PUBLIC_REDDIT_CLIENT_ID',
					'PUBLIC_REDDIT_CLIENT_SECRET',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Reddit/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
