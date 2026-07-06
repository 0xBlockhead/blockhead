// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const voyagerRestSourceDefinition = {
	provider: SourceProvider.Voyager,
	source: Source.Voyager_Rest,
	label: 'Voyager REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default voyagerRestSourceDefinition
