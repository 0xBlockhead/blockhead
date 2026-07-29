// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HyperliquidDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HyperliquidDocs,
	label: 'Hyperliquid docs',
	sources: [
		{
			source: Source.HyperliquidDocs_Rest,
			label: 'Hyperliquid docs REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
