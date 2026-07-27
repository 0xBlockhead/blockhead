// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Cashu/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Cashu,
	label: 'Cashu',
	sources: [
		{
			source: Source.CashuMint_Rest,
			label: 'Cashu mint REST',
		},
	],
	bindings: [bindings[Source.CashuMint_Rest]],
} satisfies SourceProviderDefinition
