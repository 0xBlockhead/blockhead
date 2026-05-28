import { TransportType } from '$/constants/TransportType.ts'

export const nearMainnetRpcEndpoints = [
	{
		url: 'https://rpc.mainnet.near.org',
		transportType: TransportType.Http,
		providerName: 'NEAR',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]
