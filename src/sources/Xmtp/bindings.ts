// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const xmtpGenericReadGenericSubscribeOperationGroups = [
	SourceOperationGroup.GenericRead,
	SourceOperationGroup.GenericSubscribe,
] as const

const bindings = [
	{
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
		operationGroups: xmtpGenericReadGenericSubscribeOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
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
		operationGroups: xmtpGenericReadGenericSubscribeOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
