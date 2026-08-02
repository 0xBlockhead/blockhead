// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronTip6963/bindings.ts'

export default {
	provider: SourceProvider.TronTip6963,
	label: 'TRON TIP-6963',
	sources: {
		[Source.TronTip6963_WalletApi]: {
			label: 'TRON TIP-6963 wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
