import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.CosmosAdrs,
	label: 'Cosmos SDK ADRs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.CosmosAdrs,
			source: Source.CosmosAdrs_Github,
			label: 'Cosmos SDK ADRs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
