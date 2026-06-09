
import { type SourceProviderDefinition, SourceProvider } from '$/sources/SourceProvider.ts'
import EthereumEipsGithubSource from '$/sources/EthereumEips/Github/index.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.EthereumEips,
	label: 'Ethereum Eips',
	origins: githubHttpAllowedOrigins,
	sources: [
		EthereumEipsGithubSource,
	],
} satisfies SourceProviderDefinition
