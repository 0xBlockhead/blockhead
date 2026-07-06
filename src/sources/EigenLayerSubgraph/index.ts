// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const eigenLayerSubgraphGraphqlSourceDefinition = {
	provider: SourceProvider.EigenLayerSubgraph,
	source: Source.EigenLayerSubgraph_Graphql,
	label: 'EigenLayer subgraph GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default eigenLayerSubgraphGraphqlSourceDefinition
