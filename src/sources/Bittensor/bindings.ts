// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Bittensor_JsonRpc]: {
		source: Source.Bittensor_JsonRpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'bittensor',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://entrypoint-finney.opentensor.ai',
				origin: 'https://entrypoint-finney.opentensor.ai',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://lite.chain.opentensor.ai',
				origin: 'https://lite.chain.opentensor.ai',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SubstrateJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["Bittensor_JsonRpc","NetworkSlug","bittensor","HttpProxy","SubstrateJsonRpc"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Bittensor/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
