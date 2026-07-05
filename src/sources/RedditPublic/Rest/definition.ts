import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

export default {
	provider: SourceProvider.RedditPublic,
	source: Source.Reddit_PublicJson,
	label: 'Reddit public JSON (www.reddit.com, no OAuth)',
} satisfies SourceDefinition
