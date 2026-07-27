// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.BnbBeaconArchive_Rest]: {
		source: Source.BnbBeaconArchive_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'bnb-beacon-archive',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://archive-api.binance.org',
				origin: 'https://archive-api.binance.org',
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
		proxyId: '["BnbBeaconArchive_Rest","Global","bnb-beacon-archive","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
