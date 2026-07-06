// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const rssRestSourceDefinition = {
	provider: SourceProvider.Rss,
	source: Source.Rss_Rest,
	label: 'RSS REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default rssRestSourceDefinition
