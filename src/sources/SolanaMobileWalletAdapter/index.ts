// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SolanaMobileWalletAdapter/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.SolanaMobileWalletAdapter,
	label: 'Solana Mobile Wallet Adapter',
	sources: [
		{
			source: Source.SolanaMobileWalletAdapter_WalletApi,
			label: 'Solana Mobile Wallet Adapter API',
		},
	],
	bindings: [bindings[Source.SolanaMobileWalletAdapter_WalletApi]],
} satisfies SourceProviderDefinition
