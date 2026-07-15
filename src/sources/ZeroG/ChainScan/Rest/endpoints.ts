import { TransportType } from '$/constants/TransportType.ts'

export const zeroGMainnetExplorerEndpoints = [
	{
		url: 'https://chainscan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G ChainScan',
		origin: 'https://chainscan.0g.ai',
		corsEnabled: true,
	},
] as const

export const zeroGOrigins = zeroGMainnetExplorerEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
