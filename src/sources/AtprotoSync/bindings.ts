// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.AtprotoSync_Xrpc]: {
		source: Source.AtprotoSync_Xrpc,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'atproto-sync',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{pds-host}',
				origin: 'https://{pds-host}',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://{pds-host}/xrpc/com.atproto.sync.subscribeRepos',
			},
		],
		wireProtocol: WireProtocol.Xrpc,
		apiFamily: ApiFamily.AtprotoSync,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
} as const satisfies SourceBindingIndex
