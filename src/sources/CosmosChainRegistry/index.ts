// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cosmosChainRegistryGithubSourceDefinition = {
	provider: SourceProvider.CosmosChainRegistry,
	source: Source.CosmosChainRegistry_Github,
	label: 'Cosmos Chain Registry GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cosmosChainRegistryGithubSourceDefinition
