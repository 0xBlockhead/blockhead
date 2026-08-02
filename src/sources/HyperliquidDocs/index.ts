// Generated from APP.ts.

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
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
