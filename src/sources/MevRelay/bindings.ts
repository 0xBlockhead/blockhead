// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const mevRelayRestRestJsonHttpProxyBindingAxes = {
	source: Source.MevRelay_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/MevRelay/Rest/types.ts',
		},
	],
} as const

const bindings = [
	{
		...mevRelayRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'boost-relay.flashbots.net',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://boost-relay.flashbots.net',
				corsEnabled: false,
			},
		],
	},
	{
		...mevRelayRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'relay.ultrasound.money',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.ultrasound.money',
				corsEnabled: false,
			},
		],
	},
	{
		...mevRelayRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'builder-relay-sepolia.flashbots.net',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://builder-relay-sepolia.flashbots.net',
				corsEnabled: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
