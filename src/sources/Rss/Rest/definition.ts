import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

export default {
	provider: SourceProvider.Rss,
	source: Source.Rss_Rest,
	label: 'RSS / Atom (direct fetch)',
} satisfies SourceDefinition
