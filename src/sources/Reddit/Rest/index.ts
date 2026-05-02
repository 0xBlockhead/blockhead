import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.Reddit,
	source: Source.Reddit_Rest,
	label: 'Reddit API (REST, application-only OAuth)',
} satisfies SourceDefinition
