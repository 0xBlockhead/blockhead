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

export const tonLiteServerBindings = [
	{
		provider: SourceProvider.TonLiteServer,
		source: Source.TonLiteServer_Adnl,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton',
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
