import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import HyperliquidJsonRpc from '$/sources/Hyperliquid/JsonRpc/index.ts'
import HyperliquidRest from '$/sources/Hyperliquid/Rest/index.ts'


// Constants

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
		restBaseUrl: 'https://api.hyperliquid.xyz',
		url: 'https://api.hyperliquid.xyz/info',
		transportType: TransportType.Http,
		providerName: 'Hyperliquid info API',
	},
] as const satisfies readonly {
	restBaseUrl: string
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.Hyperliquid,
	label: 'Hyperliquid',
	origins: [
		...hyperliquidMainnetRestEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.restBaseUrl).origin,
			corsEnabled: true,
		})),
		...hyperliquidMainnetRpcEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
	],
	sources: [
		HyperliquidRest,
		HyperliquidJsonRpc,
	],
} as const satisfies SourceProviderDefinition
