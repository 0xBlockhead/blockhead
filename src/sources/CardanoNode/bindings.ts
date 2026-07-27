// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.CardanoNode_LocalStateQuery]: {
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
} as const satisfies SourceBindingIndex
