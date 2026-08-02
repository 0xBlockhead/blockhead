// Generated from APP.ts.

import bindings from '$/sources/Leap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Leap,
	label: 'Leap',
	sources: [
		{
			source: Source.Leap_WalletApi,
			label: 'Leap wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
