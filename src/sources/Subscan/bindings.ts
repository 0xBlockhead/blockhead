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

const subscanOrigin = 'https://polkadot.api.subscan.io' as const

export const subscanPublicEnv = arktype({
	PUBLIC_SUBSCAN_API_KEY: 'string',
})

export const subscanBindings = [
	{
		provider: SourceProvider.Subscan,
		source: Source.Subscan_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: subscanOrigin,
				origin: subscanOrigin,
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
					'PUBLIC_SUBSCAN_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Subscan/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
