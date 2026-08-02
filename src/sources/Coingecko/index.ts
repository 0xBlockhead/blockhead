// Generated from APP.ts.

import bindings from '$/sources/Coingecko/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Coingecko,
	label: 'Coingecko',
	sources: [
		{
			source: Source.Coingecko_Rest,
			label: 'Coingecko REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
