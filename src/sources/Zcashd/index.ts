import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import ZcashdJsonRpc from '$/sources/Zcashd/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Zcashd,
	label: 'zcashd',
	origins: [
		{
			origin: 'http://127.0.0.1:8232',
			corsEnabled: false,
		},
	],
	sources: [
		ZcashdJsonRpc,
	],
} as const satisfies SourceProviderDefinition
