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
import { origin } from '$/sources/Allium/Rest/constants.ts'

export const alliumPublicEnv = arktype({
	PUBLIC_ALLIUM_API_KEY: 'string > 0',
})

const alliumCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		env: alliumPublicEnv,
		keys: [
			'PUBLIC_ALLIUM_API_KEY',
		],
	},
] as const

export const alliumBindings = [
	{
		provider: SourceProvider.Allium,
		source: Source.Allium_Rest,
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
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: alliumCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Allium/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
