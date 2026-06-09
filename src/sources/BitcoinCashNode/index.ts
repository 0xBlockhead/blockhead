import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import BitcoinCashNodeJsonRpc from '$/sources/BitcoinCashNode/JsonRpc/index.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	label: 'Bitcoin Cash Node',
	origins: [
		{
			origin: 'http://127.0.0.1:8332',
			corsEnabled: false,
		},
	],
	sources: [
		BitcoinCashNodeJsonRpc,
	],
} as const satisfies SourceProviderDefinition
