import { TransportType } from '$/constants/TransportType.ts'


// Constants

export const hyperliquidMainnetRestBaseUrl = 'https://api.hyperliquid.xyz'

export const hyperliquidMainnetRpcEndpoints = [
	{
		url: 'https://rpc.hyperliquid.xyz/evm',
		transportType: TransportType.Http,
		providerName: 'Hyperliquid HyperEVM JSON-RPC',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const hyperliquidMainnetRestEndpoints = [
	{
		url: `${hyperliquidMainnetRestBaseUrl}/info`,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid info API',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]
