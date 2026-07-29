// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const xrplClioJsonRpcCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

const bindings = [
	{
		source: Source.XrplClio_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'xrpl:0',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{xrpl-clio-host}',
				origin: 'https://{xrpl-clio-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: xrplClioJsonRpcCredentials,
	},
	{
		source: Source.XrplClio_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'xrpl:0',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://{xrpl-clio-host}',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: xrplClioJsonRpcCredentials,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.XrplClio_JsonRpc]: readonly [typeof bindings[0], typeof bindings[1]] }>(bindings)
