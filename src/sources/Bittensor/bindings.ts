import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const bittensorEndpointOrigins = [
	'https://entrypoint-finney.opentensor.ai',
	'https://lite.chain.opentensor.ai',
] as const

export const bittensorBindings = [
	{
		provider: SourceProvider.Bittensor,
		source: Source.Bittensor_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bittensor:finney',
		},
		endpoints: bittensorEndpointOrigins.map((origin) => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: origin,
			origin,
			corsEnabled: false,
		})),
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
