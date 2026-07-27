// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.StellarHorizon_Rest]: {
		source: Source.StellarHorizon_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'stellar-public-horizon',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://horizon.stellar.org',
				origin: 'https://horizon.stellar.org',
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
		proxyId: '["StellarHorizon_Rest","Global","stellar-public-horizon","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
