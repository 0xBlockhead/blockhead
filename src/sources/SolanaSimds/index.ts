import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.SolanaSimds,
	label: 'Solana SIMDs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.SolanaSimds,
			source: Source.SolanaSimds_Github,
			label: 'Solana SIMDs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
