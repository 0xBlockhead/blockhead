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

const bnbBeaconArchiveOrigin = 'https://archive-api.binance.org' as const

export const bnbBeaconArchiveBindings = [
	{
		provider: SourceProvider.BnbBeaconArchive,
		source: Source.BnbBeaconArchive_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'bnb-beacon-archive',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: bnbBeaconArchiveOrigin,
				origin: bnbBeaconArchiveOrigin,
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
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
