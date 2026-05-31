import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.Hey,
	source: Source.Hey_Graphql,
	label: 'Hey (Lens GraphQL)',
} satisfies SourceDefinition
