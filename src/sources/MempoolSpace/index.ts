import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MempoolSpace,
	label: 'mempool.space',
	origins: [
		{
			origin: 'https://mempool.space',
			corsEnabled: true,
		},
	],
	sources: [
		{
			provider: SourceProvider.MempoolSpace,
			source: Source.MempoolSpace_Rest,
			label: 'mempool.space REST',
		},
	],
} as const satisfies SourceProviderDefinition
