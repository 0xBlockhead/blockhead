import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.FilecoinFips,
	label: 'Filecoin FIPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.FilecoinFips,
			source: Source.FilecoinFips_Github,
			label: 'Filecoin FIPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
