// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AlgorandIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AlgorandIndexer,
	label: 'Algorand Indexer',
	sources: [
		{
			source: Source.AlgorandIndexer_Rest,
			label: 'Algorand Indexer REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
