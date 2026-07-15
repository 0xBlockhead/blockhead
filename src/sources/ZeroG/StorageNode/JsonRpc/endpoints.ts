import { TransportType } from '$/constants/TransportType.ts'

export const zeroGStorageNodeRpcEndpoints = [
	{
		url: 'http://127.0.0.1:5678',
		transportType: TransportType.Http,
		providerName: 'Local 0G storage node',
		origin: 'http://127.0.0.1:5678',
		corsEnabled: true,
	},
] as const

export const zeroGOrigins = zeroGStorageNodeRpcEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
