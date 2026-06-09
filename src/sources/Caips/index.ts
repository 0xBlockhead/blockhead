
import { type SourceProviderDefinition, SourceProvider } from '$/sources/SourceProvider.ts'
import CaipsGithubSource from '$/sources/Caips/Github/index.ts'
import CaipNamespacesGithubSource from '$/sources/Caips/Namespaces/Github/index.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.Caips,
	label: 'Caips',
	origins: githubHttpAllowedOrigins,
	sources: [
		CaipsGithubSource,
		CaipNamespacesGithubSource,
	],
} satisfies SourceProviderDefinition
