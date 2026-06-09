import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import BitcoinCoreJsonRpc from '$/sources/BitcoinCore/JsonRpc/index.ts'

export default {
	provider: SourceProvider.BitcoinCore,
	label: 'Bitcoin Core',
	origins: [
		{
			origin: 'http://127.0.0.1:8332',
			corsEnabled: false,
		},
	],
	sources: [
		BitcoinCoreJsonRpc,
	],
} as const satisfies SourceProviderDefinition
