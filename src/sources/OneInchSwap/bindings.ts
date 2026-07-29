// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.OneInchSwap_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'one-inch-swap-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.1inch.dev',
				origin: 'https://api.1inch.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.OneInchSwap_Rest]: typeof bindings[0] }>(bindings)
