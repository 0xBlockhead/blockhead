import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SolanaJsonRpc from '$/sources/Solana/JsonRpc/index.ts'

/** Official Solana Labs shared mainnet RPC endpoints; rate-limited and not intended as production-dedicated infrastructure. */
export const solanaMainnetRpcEndpoints = [
	{
		url: 'https://api.mainnet.solana.com',
		transportType: TransportType.Http,
		providerName: 'Solana Labs',
	},
	{
		url: 'wss://api.mainnet.solana.com',
		transportType: TransportType.WebSocket,
		providerName: 'Solana Labs',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export default {
	provider: SourceProvider.Solana,
	label: 'Solana',
	origins: [
		...new Set(
			solanaMainnetRpcEndpoints
				.filter((endpoint) => endpoint.transportType === TransportType.Http)
				.map((endpoint) => new URL(endpoint.url).origin)
		),
	]
		.map((origin) => ({
			origin,
			corsEnabled: false,
		})),
	sources: [
		SolanaJsonRpc,
	],
} as const satisfies SourceProviderDefinition
