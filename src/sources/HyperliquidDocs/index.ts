import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { hyperliquidDocsBindings } from '$/sources/HyperliquidDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const hyperliquidDocsOrigins = sourceOriginsFromBindings(hyperliquidDocsBindings)

const hyperliquidDocsSourceProviderDefinition = {
	provider: SourceProvider.HyperliquidDocs,
	label: 'Hyperliquid docs',
	sources: [
		{
			provider: SourceProvider.HyperliquidDocs,
			source: Source.HyperliquidDocs_Rest,
			label: 'Hyperliquid docs REST',
		},
	],
	bindings: hyperliquidDocsBindings,
	origins: hyperliquidDocsOrigins,
} satisfies SourceProviderDefinition

export default hyperliquidDocsSourceProviderDefinition
