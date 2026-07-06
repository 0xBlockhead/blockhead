// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const youtubeRestSourceDefinition = {
	provider: SourceProvider.Youtube,
	source: Source.Youtube_Rest,
	label: 'YouTube REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default youtubeRestSourceDefinition
