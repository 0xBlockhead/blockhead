// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const redditRestSourceDefinition = {
	provider: SourceProvider.Reddit,
	source: Source.Reddit_Rest,
	label: 'Reddit REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default redditRestSourceDefinition
