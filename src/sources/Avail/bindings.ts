// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Avail_JsonRpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'avail',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{avail-rpc-host}',
				origin: 'https://{avail-rpc-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SubstrateJsonRpc,
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

export default indexSourceBindings<{ readonly [Source.Avail_JsonRpc]: typeof bindings[0] }>(bindings)
