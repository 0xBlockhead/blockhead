import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	origins: [
		{
			origin: 'https://rpc.polkadot.io',
			corsEnabled: true,
		},
	],
	sources: [
		{
			provider: SourceProvider.Polkadot,
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
} as const satisfies SourceProviderDefinition
