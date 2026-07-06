// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nodelyAlgorandIndexerRestSourceDefinition = {
	provider: SourceProvider.Nodely,
	source: Source.Nodely_AlgorandIndexer_Rest,
	label: 'Nodely Algorand Indexer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nodelyAlgorandIndexerRestSourceDefinition
