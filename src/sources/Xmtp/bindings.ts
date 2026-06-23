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

export const xmtpBindings = [
	{
		provider: SourceProvider.Xmtp,
		source: Source.Xmtp_BrowserSdk,
		target: {
			kind: SourceTargetKind.Global,
			key: 'xmtp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'xmtp-browser-sdk',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.XmtpClientApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
		provider: SourceProvider.Xmtp,
		source: Source.Xmtp_NodeSdk,
		target: {
			kind: SourceTargetKind.Global,
			key: 'xmtp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'xmtp-node-sdk',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.XmtpClientApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
