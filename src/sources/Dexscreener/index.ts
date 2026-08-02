// Generated from APP.ts.

import bindings from '$/sources/Dexscreener/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Dexscreener,
	label: 'Dexscreener',
	sources: [
		{
			source: Source.Dexscreener_Rest,
			label: 'Dexscreener REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
