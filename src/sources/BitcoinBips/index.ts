import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.BitcoinBips,
	label: 'Bitcoin BIPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.BitcoinBips,
			source: Source.BitcoinBips_Github,
			label: 'Bitcoin BIPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
