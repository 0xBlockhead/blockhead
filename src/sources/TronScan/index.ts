// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronScan/bindings.ts'

export default {
	provider: SourceProvider.TronScan,
	label: 'TRONSCAN',
	sources: [
		{
			source: Source.TronScan_Rest,
			label: 'TRONSCAN REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
