import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.FxEmbed,
	source: Source.X_FxEmbed_Rest,
	label: 'FxTwitter / FxEmbed API (REST)',
} satisfies SourceDefinition
