// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const rss2JsonRestSourceDefinition = {
	provider: SourceProvider.Rss2Json,
	source: Source.Rss2Json_Rest,
	label: 'rss2json REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default rss2JsonRestSourceDefinition
