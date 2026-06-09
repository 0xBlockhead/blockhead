import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.LitecoinLips,
	label: 'Litecoin LIPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.LitecoinLips,
			source: Source.LitecoinLips_Github,
			label: 'Litecoin LIPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
