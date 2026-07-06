// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const coingeckoRestSourceDefinition = {
	provider: SourceProvider.Coingecko,
	source: Source.Coingecko_Rest,
	label: 'Coingecko REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default coingeckoRestSourceDefinition
