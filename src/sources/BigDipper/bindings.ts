// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.BigDipper_Rest]: {
		source: Source.BigDipper_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'big-dipper-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.bigdipper.live',
				origin: 'https://api.bigdipper.live',
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
		proxyId: '["BigDipper_Rest","Global","big-dipper-api","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
