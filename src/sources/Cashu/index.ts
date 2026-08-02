// Generated from APP.ts.

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
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
