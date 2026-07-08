import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { cosmosAdrsBindings } from '$/sources/CosmosAdrs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const cosmosAdrsOrigins = sourceOriginsFromBindings(cosmosAdrsBindings)

const cosmosAdrsSourceProviderDefinition = {
	provider: SourceProvider.CosmosAdrs,
	label: 'Cosmos ADRs',
	sources: [
		{
			provider: SourceProvider.CosmosAdrs,
			source: Source.CosmosAdrs_Github,
			label: 'Cosmos ADRs GitHub',
		},
	],
	bindings: cosmosAdrsBindings,
	origins: cosmosAdrsOrigins,
} satisfies SourceProviderDefinition

export default cosmosAdrsSourceProviderDefinition
