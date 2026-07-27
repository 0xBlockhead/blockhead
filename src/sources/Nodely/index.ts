// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Nodely,
	label: 'Nodely',
	sources: [
		{
			source: Source.Nodely_Algod_Rest,
			label: 'Nodely Algod REST',
		},
		{
			source: Source.Nodely_AlgorandIndexer_Rest,
			label: 'Nodely Algorand Indexer REST',
		},
	],
	bindings: [
		bindings[Source.Nodely_Algod_Rest],
		bindings[Source.Nodely_AlgorandIndexer_Rest],
	],
} satisfies SourceProviderDefinition
