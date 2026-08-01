// Generated from APP.ts.

import bindings from '$/sources/PlugWallet/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.PlugWallet,
	label: 'Plug Wallet',
	sources: [
		{
			source: Source.PlugWallet_WalletApi,
			label: 'Plug Wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
