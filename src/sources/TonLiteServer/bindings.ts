// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.TonLiteServer_Adnl,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton:-239',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:TON_LITE_SERVER_ADDRESS',
			},
		],
		wireProtocol: WireProtocol.Adnl,
		apiFamily: ApiFamily.TonLiteServerAdnl,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.TonLiteServer_Adnl]: typeof bindings[0] }>(bindings)
