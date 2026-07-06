// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const defillamaRestSourceDefinition = {
	provider: SourceProvider.Defillama,
	source: Source.Defillama_Rest,
	label: 'Defillama REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default defillamaRestSourceDefinition
