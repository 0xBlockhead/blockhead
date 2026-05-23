
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import EnsipsGithubSource from '$/sources/Ensips/Github/index.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'Ensips',
	origins: githubHttpAllowedOrigins,
	sources: [
		EnsipsGithubSource,
	],
} satisfies SourceProviderDefinition
