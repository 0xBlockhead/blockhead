import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.Amboss,
	source: Source.Amboss_Graphql,
	label: 'Amboss Space GraphQL',
} satisfies SourceDefinition
