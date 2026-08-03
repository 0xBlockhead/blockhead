// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const mevRelayRestBindingAxes = {
	source: Source.MevRelay_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
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

export default indexSourceBindings(mapSourceBindings(
	mevRelayRestTargets,
	({
		key,
		locator,
	}) => ({
		...mevRelayRestBindingAxes,
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
	})
))
