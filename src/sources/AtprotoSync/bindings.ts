// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.AtprotoSync_Xrpc]: typeof bindings[0] }>(bindings)
