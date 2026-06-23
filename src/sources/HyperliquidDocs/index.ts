import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hyperliquidDocsBindings } from '$/sources/HyperliquidDocs/bindings.ts'

export default {
	provider: SourceProvider.HyperliquidDocs,
	label: 'Hyperliquid docs',
	sources: [
		{
			provider: SourceProvider.HyperliquidDocs,
			source: Source.HyperliquidDocs_Rest,
			label: 'Hyperliquid docs',
		},
	],
	bindings: hyperliquidDocsBindings,
} satisfies SourceProviderDefinition
