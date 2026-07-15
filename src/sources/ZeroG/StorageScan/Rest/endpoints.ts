import { TransportType } from '$/constants/TransportType.ts'

export const zeroGMainnetStorageEndpoints = [
	{
		url: 'https://storagescan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G StorageScan',
		origin: 'https://storagescan.0g.ai',
		corsEnabled: true,
	},
] as const

export const zeroGOrigins = zeroGMainnetStorageEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
