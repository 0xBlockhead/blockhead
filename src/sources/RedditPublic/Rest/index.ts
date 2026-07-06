// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const redditPublicJsonSourceDefinition = {
	provider: SourceProvider.RedditPublic,
	source: Source.Reddit_PublicJson,
	label: 'Reddit public JSON',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default redditPublicJsonSourceDefinition
