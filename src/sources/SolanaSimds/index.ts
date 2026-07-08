import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { solanaSimdsBindings } from '$/sources/SolanaSimds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const solanaSimdsOrigins = sourceOriginsFromBindings(solanaSimdsBindings)

const solanaSimdsSourceProviderDefinition = {
	provider: SourceProvider.SolanaSimds,
	label: 'Solana SIMDs',
	sources: [
		{
			provider: SourceProvider.SolanaSimds,
			source: Source.SolanaSimds_Github,
			label: 'Solana SIMDs GitHub',
		},
	],
	bindings: solanaSimdsBindings,
	origins: solanaSimdsOrigins,
} satisfies SourceProviderDefinition

export default solanaSimdsSourceProviderDefinition
