// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const esploraRestSourceDefinition = {
	provider: SourceProvider.Esplora,
	source: Source.Esplora_Rest,
	label: 'Esplora REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default esploraRestSourceDefinition
