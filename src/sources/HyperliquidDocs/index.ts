import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.HyperliquidDocs,
	label: 'Hyperliquid docs',
	origins: [
		{
			origin: 'https://hyperliquid.gitbook.io',
			corsEnabled: true,
		},
	],
	sources: [
		{
			provider: SourceProvider.HyperliquidDocs,
			source: Source.HyperliquidDocs_Rest,
			label: 'Hyperliquid docs',
		},
	],
} as const satisfies SourceProviderDefinition
