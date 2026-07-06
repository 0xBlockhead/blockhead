import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const fediPublicEnv = arktype({
	PUBLIC_FEDI_ORIGIN: 'string.url?',
	PUBLIC_FEDI_ACCESS_TOKEN: 'string > 0?',
})

export const fediBindings = [
	{
		provider: SourceProvider.Fedi,
		source: Source.Fedi_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'configured-fedi-rest',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:PUBLIC_FEDI_ORIGIN',
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
					'PUBLIC_FEDI_ORIGIN',
					'PUBLIC_FEDI_ACCESS_TOKEN',
				],
			},
		],
	},
] as const satisfies readonly SourceBinding[]
