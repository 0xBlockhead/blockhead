import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { gatewayUrls } from '$/sources/Swarm/Rest/constants.ts'

export const swarmBindings = [
	{
		provider: SourceProvider.Swarm,
		source: Source.Swarm_Rest,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'swarm',
		},
		endpoints: gatewayUrls.map((origin) => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: origin,
			origin,
			corsEnabled: false,
		})),
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.SwarmGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
