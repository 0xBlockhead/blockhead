// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const metaplexDASRestSourceDefinition = {
	provider: SourceProvider.MetaplexDAS,
	source: Source.MetaplexDAS_Rest,
	label: 'Metaplex DAS REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default metaplexDASRestSourceDefinition
