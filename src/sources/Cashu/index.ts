// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Cashu/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Cashu,
	label: 'Cashu',
	sources: [
		{
			source: Source.CashuMint_Rest,
			label: 'Cashu mint REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
