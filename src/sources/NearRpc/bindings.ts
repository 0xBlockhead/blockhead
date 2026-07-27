// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.NearRpc_JsonRpc]: {
		source: Source.NearRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'near',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.mainnet.near.org',
				origin: 'https://rpc.mainnet.near.org',
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
		proxyId: '["NearRpc_JsonRpc","NetworkSlug","near","HttpProxy","JsonRpcApi"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NearRpc/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
