// Generated from APP.ts.

import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Hyperliquid,
	label: 'Hyperliquid',
	sources: {
		[Source.Hyperliquid]: {
			label: 'Hyperliquid',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
