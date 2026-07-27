// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SolanaSimds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.SolanaSimds,
	label: 'Solana SIMDs',
	sources: [
		{
			source: Source.SolanaSimds_Github,
			label: 'Solana SIMDs GitHub',
		},
	],
	bindings: [bindings[Source.SolanaSimds_Github]],
} satisfies SourceProviderDefinition
