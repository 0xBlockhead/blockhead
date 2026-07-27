// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Xrpl_Rippled]: {
		source: Source.Xrpl_Rippled,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'xrpl:0',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://s1.ripple.com:51234',
				origin: 'https://s1.ripple.com:51234',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["Xrpl_Rippled","Caip2Network","xrpl:0","HttpProxy","JsonRpcApi"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Xrpl/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
