import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import NearRpcJsonRpc from '$/sources/NearRpc/JsonRpc/index.ts'


// Constants

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


// Provider

export default {
	provider: SourceProvider.NearRpc,
	label: 'NEAR RPC',
	origins: nearMainnetRpcEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: true,
	})),
	sources: [
		NearRpcJsonRpc,
	],
} as const satisfies SourceProviderDefinition
