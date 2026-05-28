import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'
import BitcoinCashBcmrGithub from '$/sources/BitcoinCashBcmr/Github/index.ts'

export default {
	provider: SourceProvider.BitcoinCashBcmr,
	label: 'Bitcoin Cash Metadata Registries',
	origins: githubHttpAllowedOrigins,
	sources: [
		BitcoinCashBcmrGithub,
	],
} as const satisfies SourceProviderDefinition
