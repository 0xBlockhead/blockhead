import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SolanaJsonRpc from '$/sources/Solana/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Solana,
	label: 'Solana',
	origins: [
		{
			origin: 'https://api.mainnet-beta.solana.com',
			corsEnabled: true,
		},
	],
	sources: [
		SolanaJsonRpc,
	],
} as const satisfies SourceProviderDefinition
