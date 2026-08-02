// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TonCenter/bindings.ts'

export default {
	provider: SourceProvider.TonCenter,
	label: 'TON Center',
	sources: {
		[Source.TonCenter]: {
			label: 'TON Center',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
