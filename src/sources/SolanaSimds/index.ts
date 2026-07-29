// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SolanaSimds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SolanaSimds,
	label: 'Solana SIMDs',
	sources: [
		{
			source: Source.SolanaSimds_Github,
			label: 'Solana SIMDs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
