// Generated from APP.ts.

import bindings from '$/sources/AptosAip62/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AptosAip62,
	label: 'Aptos AIP-62',
	sources: [
		{
			source: Source.AptosAip62_WalletApi,
			label: 'Aptos AIP-62 wallet API',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
