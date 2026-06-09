import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.CosmosChainRegistry,
	label: 'Cosmos chain registry',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.CosmosChainRegistry,
			source: Source.CosmosChainRegistry_Github,
			label: 'Cosmos chain registry GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
