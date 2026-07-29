// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Bittensor/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Bittensor_JsonRpc]: typeof bindings[0] }>(bindings)
