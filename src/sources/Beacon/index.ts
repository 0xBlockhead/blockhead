import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { ChainId } from '$/constants/ChainId.ts'
import BeaconRestSource from '$/sources/Beacon/Rest/index.ts'

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
] as const satisfies readonly {
	chainId: number
	restBaseUrl: string
	corsEnabled: boolean
}[]

export const beaconRestEndpointByExecutionChainId = Object.fromEntries(
	beaconRestEndpoints.map((beaconRestEndpoint) => [
		beaconRestEndpoint.chainId,
		beaconRestEndpoint,
	])
)

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	origins: beaconRestEndpoints.map((beaconRestEndpoint) => ({
		origin: new URL(beaconRestEndpoint.restBaseUrl).origin,
		corsEnabled: beaconRestEndpoint.corsEnabled,
	})),
	sources: [
		BeaconRestSource,
	],
} satisfies SourceProviderDefinition
