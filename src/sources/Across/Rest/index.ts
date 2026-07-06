// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const acrossRestSourceDefinition = {
	provider: SourceProvider.Across,
	source: Source.Across_Rest,
	label: 'Across REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default acrossRestSourceDefinition
