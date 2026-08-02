// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const beaconRestBindingAxes = {
	source: Source.Beacon_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.EthereumBeaconRest,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/Beacon/OpenApi/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.OpenApiSpec,
			path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
		},
		{
			kind: SourceArtifactKind.OpenApiTypes,
			path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
			generated: true,
		},
	],
} as const

const beaconRestTargets = [
	{
		key: '1',
		locator: 'https://ethereum-beacon-api.publicnode.com',
	},
	{
		key: '11155111',
		locator: 'https://ethereum-sepolia-beacon-api.publicnode.com',
	},
	{
		key: '17000',
		locator: 'https://ethereum-holesky-beacon-api.publicnode.com',
	},
] as const

export default indexSourceBindings(beaconRestTargets.map(({
	key,
	locator,
}) => ({
		...beaconRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: true,
			},
		],
} satisfies SourceBinding)))
