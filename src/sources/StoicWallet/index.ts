// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StoicWallet/bindings.ts'

export default {
	provider: SourceProvider.StoicWallet,
	label: 'Stoic Wallet',
	sources: [
		{
			source: Source.StoicWallet_WalletApi,
			label: 'Stoic Wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
