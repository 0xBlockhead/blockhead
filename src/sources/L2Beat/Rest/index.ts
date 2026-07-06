// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const l2BeatRestSourceDefinition = {
	provider: SourceProvider.L2Beat,
	source: Source.L2Beat_Rest,
	label: 'L2Beat REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default l2BeatRestSourceDefinition
