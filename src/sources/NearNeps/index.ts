import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.NearNeps,
	label: 'NEAR NEPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.NearNeps,
			source: Source.NearNeps_Github,
			label: 'NEAR NEPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
