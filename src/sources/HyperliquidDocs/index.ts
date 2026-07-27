// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HyperliquidDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HyperliquidDocs,
	label: 'Hyperliquid docs',
	sources: [
		{
			source: Source.HyperliquidDocs_Rest,
			label: 'Hyperliquid docs REST',
		},
	],
	bindings: [bindings[Source.HyperliquidDocs_Rest]],
} satisfies SourceProviderDefinition
