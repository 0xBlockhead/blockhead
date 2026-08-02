// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const xmtpGenericReadGenericSubscribeOperationGroups = [
	SourceOperationGroup.GenericRead,
	SourceOperationGroup.GenericSubscribe,
] as const

export default indexSourceBindings([
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
])
