// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Nitro_ClientStore,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'nitro-client-store',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'nitro-client-store',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.LocalStateStore,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
	{
		source: Source.Nitro_NodeRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'nitro-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:NITRO_NODE_RPC_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Nitro_ClientStore]: typeof bindings[0]
	readonly [Source.Nitro_NodeRpc]: typeof bindings[1]
}>(bindings)
