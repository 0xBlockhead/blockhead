import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const TheGraphGraphqlSource = {
	provider: SourceProvider.TheGraph,
	source: Source.TheGraph_Graphql,
	label: 'The Graph Graphql',
} satisfies SourceDefinition

export default TheGraphGraphqlSource
