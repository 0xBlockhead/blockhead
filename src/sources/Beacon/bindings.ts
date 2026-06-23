import { ChainId } from '$/constants/ChainId.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const beaconRestEndpoints = [
	{
		chainId: ChainId.Ethereum,
		restBaseUrl: 'https://ethereum-beacon-api.publicnode.com',
		corsEnabled: true,
	},
	{
		chainId: ChainId.EthereumSepolia,
		restBaseUrl: 'https://ethereum-sepolia-beacon-api.publicnode.com',
		corsEnabled: true,
	},
	{
		chainId: 17_000,
		restBaseUrl: 'https://ethereum-holesky-beacon-api.publicnode.com',
		corsEnabled: true,
	},
] as const

export const beaconRestEndpointByExecutionChainId = Object.fromEntries(
	beaconRestEndpoints.map((beaconRestEndpoint) => [
		beaconRestEndpoint.chainId,
		beaconRestEndpoint,
	])
)

export const beaconBindings = beaconRestEndpoints.map((beaconRestEndpoint): SourceBinding => ({
	provider: SourceProvider.Beacon,
	source: Source.Beacon_Rest,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: String(beaconRestEndpoint.chainId),
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: beaconRestEndpoint.restBaseUrl,
			origin: new URL(beaconRestEndpoint.restBaseUrl).origin,
			corsEnabled: beaconRestEndpoint.corsEnabled,
		},
	],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.EthereumBeaconRest,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [
		{
			scope: SourceCredentialScope.None,
		},
	],
	artifacts: [
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
	],
}))
