// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const farcasterRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

const bindings = [
	{
		source: Source.Farcaster_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'client-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.farcaster.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: farcasterRestGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Farcaster/Rest/types.ts',
			},
		],
	},
	{
		source: Source.Farcaster_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'web-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://farcaster.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: farcasterRestGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
