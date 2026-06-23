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

export const cardanoNodeBindings = [
	{
		provider: SourceProvider.CardanoNode,
		source: Source.CardanoNode_LocalStateQuery,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cardano',
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
