import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.Rss2Json,
	source: Source.Rss2Json_Rest,
	label: 'RSS2JSON API',
} satisfies SourceDefinition
