// Generated from APP.ts.

import bindings from '$/sources/Kabila/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Kabila,
	label: 'Kabila',
	sources: {
		[Source.Kabila_WalletConnect]: {
			label: 'Kabila WalletConnect',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
