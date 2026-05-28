import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.DogecoinDips,
	label: 'Dogecoin DIPs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.DogecoinDips,
			source: Source.DogecoinDips_Github,
			label: 'Dogecoin DIPs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
