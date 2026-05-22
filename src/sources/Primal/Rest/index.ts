import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.Primal,
	source: Source.Primal_Rest,
	label: 'Primal API (REST, public cache HTTP mirror)',
} satisfies SourceDefinition
