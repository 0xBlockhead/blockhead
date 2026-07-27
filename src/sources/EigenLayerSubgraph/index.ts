// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EigenLayerSubgraph/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EigenLayerSubgraph,
	label: 'EigenLayer subgraph',
	sources: [
		{
			source: Source.EigenLayerSubgraph_Graphql,
			label: 'EigenLayer subgraph GraphQL',
		},
	],
	bindings: [bindings[Source.EigenLayerSubgraph_Graphql]],
} satisfies SourceProviderDefinition
