import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.Lens,
	source: Source.Lens_Graphql,
	label: 'Lens Protocol (GraphQL)',
} satisfies SourceDefinition
