import { TransportType } from '$/constants/TransportType.ts'

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
