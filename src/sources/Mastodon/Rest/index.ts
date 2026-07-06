// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mastodonRestSourceDefinition = {
	provider: SourceProvider.Mastodon,
	source: Source.Mastodon_Rest,
	label: 'Mastodon REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mastodonRestSourceDefinition
