// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.SpaceAndTime_MakeInfinite]: {
		source: Source.SpaceAndTime_MakeInfinite,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'eip155:1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://proxy.api.makeinfinite.dev',
				origin: 'https://proxy.api.makeinfinite.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		proxyId: '["SpaceAndTime_MakeInfinite","Caip2Network","eip155:1","HttpProxy","RestJson"]',
		serverCredentialId: '["SpaceAndTime_MakeInfinite","Caip2Network","eip155:1","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/SpaceAndTime/MakeInfinite/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
