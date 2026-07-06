// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const dydxIndexerRestSourceDefinition = {
	provider: SourceProvider.Dydx,
	source: Source.DydxIndexer_Rest,
	label: 'dYdX Indexer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default dydxIndexerRestSourceDefinition
