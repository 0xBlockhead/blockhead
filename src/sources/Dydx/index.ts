// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Dydx,
	label: 'dYdX',
	sources: [
		{
			source: Source.DydxIndexer_Rest,
			label: 'dYdX Indexer REST',
		},
		{
			source: Source.DydxValidator_Rest,
			label: 'dYdX Validator REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
