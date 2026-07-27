// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const xrplClioJsonRpcCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

export default {
	[Source.XrplClio_JsonRpc]: [
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
	],
} as const satisfies SourceBindingIndex
