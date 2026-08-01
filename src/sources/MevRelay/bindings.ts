// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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

const mevRelayRestTargets = [
	{
		key: 'boost-relay.flashbots.net',
		locator: 'https://boost-relay.flashbots.net',
	},
	{
		key: 'relay.ultrasound.money',
		locator: 'https://relay.ultrasound.money',
	},
	{
		key: 'builder-relay-sepolia.flashbots.net',
		locator: 'https://builder-relay-sepolia.flashbots.net',
	},
] as const

const bindings = mevRelayRestTargets.map(({
	key,
	locator,
}) => ({
		...mevRelayRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
} satisfies SourceBinding))

export default indexSourceBindings(bindings)
