// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pythPriceFeedsCatalogRestSourceDefinition = {
	provider: SourceProvider.Pyth,
	source: Source.PythPriceFeedsCatalog_Rest,
	label: 'Pyth price feeds catalog REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pythPriceFeedsCatalogRestSourceDefinition
