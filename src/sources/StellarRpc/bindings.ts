// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.StellarRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'stellar',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:STELLAR_RPC_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.StellarRpc_JsonRpc]: typeof bindings[0] }>(bindings)
