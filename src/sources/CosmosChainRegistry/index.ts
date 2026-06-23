import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cosmosChainRegistryBindings } from '$/sources/CosmosChainRegistry/bindings.ts'

export default {
	provider: SourceProvider.CosmosChainRegistry,
	label: 'Cosmos Chain Registry',
	sources: [
		{
			provider: SourceProvider.CosmosChainRegistry,
			source: Source.CosmosChainRegistry_Github,
			label: 'Cosmos Chain Registry GitHub',
		},
	],
	bindings: cosmosChainRegistryBindings,
} satisfies SourceProviderDefinition
