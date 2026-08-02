// Generated from APP.ts.

import bindings from '$/sources/Martian/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Martian,
	label: 'Martian',
	sources: {
		[Source.Martian_WalletApi]: {
			label: 'Martian wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
