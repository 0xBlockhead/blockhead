// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pipedRestSourceDefinition = {
	provider: SourceProvider.Piped,
	source: Source.Piped_Rest,
	label: 'Piped REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pipedRestSourceDefinition
