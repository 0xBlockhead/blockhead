import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { cosmosChainRegistryBindings } from '$/sources/CosmosChainRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const cosmosChainRegistryOrigins = sourceOriginsFromBindings(cosmosChainRegistryBindings)

const cosmosChainRegistrySourceProviderDefinition = {
	provider: SourceProvider.CosmosChainRegistry,
	label: 'Cosmos Chain Registry name',
	sources: [
		{
			provider: SourceProvider.CosmosChainRegistry,
			source: Source.CosmosChainRegistry_Github,
			label: 'Cosmos Chain Registry name GitHub',
		},
	],
	bindings: cosmosChainRegistryBindings,
	origins: cosmosChainRegistryOrigins,
} satisfies SourceProviderDefinition

export default cosmosChainRegistrySourceProviderDefinition
