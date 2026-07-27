// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AlgorandIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AlgorandIndexer,
	label: 'Algorand Indexer',
	sources: [
		{
			source: Source.AlgorandIndexer_Rest,
			label: 'Algorand Indexer REST',
		},
	],
	bindings: [bindings[Source.AlgorandIndexer_Rest]],
} satisfies SourceProviderDefinition
