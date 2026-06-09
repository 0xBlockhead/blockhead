import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import LotusJsonRpc from '$/sources/Lotus/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Lotus,
	label: 'Lotus',
	origins: [
		{
			origin: 'http://127.0.0.1:1234',
			corsEnabled: false,
		},
		{
			origin: 'https://api.node.glif.io',
			corsEnabled: true,
		},
	],
	sources: [
		LotusJsonRpc,
	],
} as const satisfies SourceProviderDefinition
