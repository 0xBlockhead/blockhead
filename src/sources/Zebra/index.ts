import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	origins: [
		{
			origin: 'http://127.0.0.1:8232',
			corsEnabled: false,
		},
	],
	sources: [
		{
			provider: SourceProvider.Zebra,
			source: Source.Zebra_JsonRpc,
			label: 'Zebra JSON-RPC',
		},
	],
} as const satisfies SourceProviderDefinition
