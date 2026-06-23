import { type as arktype } from 'arktype'

import { fediInstanceBySlug } from '$/constants/Fedi.ts'
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

export const fediPublicEnv = arktype({
	PUBLIC_FEDI_ACCESS_TOKEN: 'string > 0?',
})

export const fediBindings = [
	{
		provider: SourceProvider.Fedi,
		source: Source.Fedi_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'fosstodon',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: fediInstanceBySlug.fosstodon.origin,
				origin: fediInstanceBySlug.fosstodon.origin,
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
					'PUBLIC_FEDI_ACCESS_TOKEN',
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
