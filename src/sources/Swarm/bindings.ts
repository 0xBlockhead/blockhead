// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Swarm_Rest,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'swarm',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://gateway.ethswarm.org',
				origin: 'https://gateway.ethswarm.org',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://bzz.link',
				origin: 'https://bzz.link',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.SwarmGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Swarm_Rest]: typeof bindings[0] }>(bindings)
