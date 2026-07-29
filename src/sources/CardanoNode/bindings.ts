// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.CardanoNode_LocalStateQuery,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cip34:1-764824073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'env:CARDANO_NODE_SOCKET_PATH',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.CardanoLocalStateQuery,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.CardanoNode_LocalStateQuery]: typeof bindings[0] }>(bindings)
