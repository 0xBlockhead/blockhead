// Generated from APP.ts.

import bindings from '$/sources/KaswareWallet/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaswareWallet,
	label: 'Kasware Wallet',
	sources: [
		{
			source: Source.KaswareWallet_WalletApi,
			label: 'Kasware Wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
