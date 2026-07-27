// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Xmtp_BrowserSdk]: {
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
	[Source.Xmtp_NodeSdk]: {
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
} as const satisfies SourceBindingIndex
