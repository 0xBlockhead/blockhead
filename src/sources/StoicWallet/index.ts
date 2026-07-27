// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.StoicWallet_WalletApi]],
} satisfies SourceProviderDefinition
