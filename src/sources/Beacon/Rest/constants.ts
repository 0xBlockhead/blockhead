import { ChainId } from '$/constants/ChainId.ts'

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

export const beaconOrigins = beaconRestEndpoints.map((beaconRestEndpoint) => ({
	origin: new URL(beaconRestEndpoint.restBaseUrl).origin,
	corsEnabled: beaconRestEndpoint.corsEnabled,
}))

export const beaconRestEndpointByExecutionChainId = Object.fromEntries(
	beaconRestEndpoints.map((beaconRestEndpoint) => [
		beaconRestEndpoint.chainId,
		beaconRestEndpoint,
	])
)
