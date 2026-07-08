import { type as arktype } from 'arktype'

import { mastodonInstances } from '$/constants/Mastodon.ts'
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

export const mastodonPublicEnv = arktype({
	PUBLIC_MASTODON_ACCESS_TOKEN: 'string > 0?',
})

export const mastodonBindings = [
	{
		provider: SourceProvider.Mastodon,
		source: Source.Mastodon_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'mastodon-compatible-activitypub',
		},
		endpoints: mastodonInstances.map((instance) => (
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: instance.origin,
				origin: instance.origin,
				corsEnabled: false,
			}
		)),
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: mastodonPublicEnv,
				keys: [
					'PUBLIC_MASTODON_ACCESS_TOKEN',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Mastodon/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
