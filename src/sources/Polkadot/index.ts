import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'


// Constants

export const polkadotMainnetRpcEndpoints = [
	{
		url: 'https://rpc.polkadot.io',
		transportType: TransportType.Http,
		providerName: 'Parity',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	origins: polkadotMainnetRpcEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: true,
	})),
	sources: [
		{
			provider: SourceProvider.Polkadot,
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
} as const satisfies SourceProviderDefinition
