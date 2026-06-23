import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { solanaSimdsBindings } from '$/sources/SolanaSimds/bindings.ts'

export default {
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
} satisfies SourceProviderDefinition
