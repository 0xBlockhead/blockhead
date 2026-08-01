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

const beaconRestEthereumBeaconRestBrowserDirectBindingAxes = {
	source: Source.Beacon_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.EthereumBeaconRest,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.OpenApiSpec,
			path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
		},
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/Beacon/OpenApi/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.OpenApiTypes,
			path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
			generated: true,
		},
	],
} as const

const bindings = [
	{
		...beaconRestEthereumBeaconRestBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
	},
	{
		...beaconRestEthereumBeaconRestBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-sepolia-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
	},
	{
		...beaconRestEthereumBeaconRestBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '17000',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-holesky-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
