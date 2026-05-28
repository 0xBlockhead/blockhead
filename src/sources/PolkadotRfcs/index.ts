import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'

export default {
	provider: SourceProvider.PolkadotRfcs,
	label: 'Polkadot Fellowship RFCs',
	origins: githubHttpAllowedOrigins,
	sources: [
		{
			provider: SourceProvider.PolkadotRfcs,
			source: Source.PolkadotRfcs_Github,
			label: 'Polkadot Fellowship RFCs GitHub',
		},
	],
} as const satisfies SourceProviderDefinition
