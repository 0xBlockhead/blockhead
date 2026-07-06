// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const theGraphGraphqlSourceDefinition = {
	provider: SourceProvider.TheGraph,
	source: Source.TheGraph_Graphql,
	label: 'The Graph ENS GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default theGraphGraphqlSourceDefinition
