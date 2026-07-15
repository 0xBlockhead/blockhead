import { TransportType } from '$/constants/TransportType.ts'

export const zeroGMainnetRpcEndpoints = [
	{
		url: 'https://evmrpc.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G',
		origin: 'https://evmrpc.0g.ai',
		corsEnabled: false,
	},
] as const

export const zeroGOrigins = zeroGMainnetRpcEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
