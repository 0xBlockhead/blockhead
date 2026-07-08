import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { eigenLayerSubgraphBindings } from '$/sources/EigenLayerSubgraph/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const eigenLayerSubgraphOrigins = sourceOriginsFromBindings(eigenLayerSubgraphBindings)

const eigenLayerSubgraphSourceProviderDefinition = {
	provider: SourceProvider.EigenLayerSubgraph,
	label: 'EigenLayer subgraph',
	sources: [
		{
			provider: SourceProvider.EigenLayerSubgraph,
			source: Source.EigenLayerSubgraph_Graphql,
			label: 'EigenLayer subgraph GraphQL',
		},
	],
	bindings: eigenLayerSubgraphBindings,
	origins: eigenLayerSubgraphOrigins,
} satisfies SourceProviderDefinition

export default eigenLayerSubgraphSourceProviderDefinition
