import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.ZcashZips,
	label: 'Zcash ZIPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.ZcashZips,
			source: Source.ZcashZips_Github,
			label: 'Zcash ZIPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
