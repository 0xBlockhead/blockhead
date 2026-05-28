import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import LitecoinCoreJsonRpc from '$/sources/LitecoinCore/JsonRpc/index.ts'

export default {
	provider: SourceProvider.LitecoinCore,
	label: 'Litecoin Core',
	origins: [
		{
			origin: 'http://127.0.0.1:9332',
			corsEnabled: false,
		},
	],
	sources: [
		LitecoinCoreJsonRpc,
	],
} as const satisfies SourceProviderDefinition
