// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const beaconRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const beaconRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const beaconRestArtifacts = [
	{
		kind: SourceArtifactKind.OpenApiSpec,
		path: 'src/sources/Beacon/OpenApi/beacon-node-oapi.yaml',
		generated: false,
	},
	{
		kind: SourceArtifactKind.GenerationManifest,
		path: 'src/sources/Beacon/OpenApi/schema-source.ts',
		generated: false,
	},
	{
		kind: SourceArtifactKind.OpenApiTypes,
		path: 'src/sources/Beacon/OpenApi/openapi.d.ts',
		generated: true,
	},
] as const

const bindings = [
	{
		source: Source.Beacon_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-beacon-api.publicnode.com',
				origin: 'https://ethereum-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.EthereumBeaconRest,
		operationGroups: beaconRestGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: beaconRestCredentials,
		artifacts: beaconRestArtifacts,
	},
	{
		source: Source.Beacon_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-sepolia-beacon-api.publicnode.com',
				origin: 'https://ethereum-sepolia-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.EthereumBeaconRest,
		operationGroups: beaconRestGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: beaconRestCredentials,
		artifacts: beaconRestArtifacts,
	},
	{
		source: Source.Beacon_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '17000',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-holesky-beacon-api.publicnode.com',
				origin: 'https://ethereum-holesky-beacon-api.publicnode.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.EthereumBeaconRest,
		operationGroups: beaconRestGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: beaconRestCredentials,
		artifacts: beaconRestArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Beacon_Rest]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]] }>(bindings)
