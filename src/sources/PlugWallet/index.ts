// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/PlugWallet/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.PlugWallet,
	label: 'Plug Wallet',
	sources: [
		{
			source: Source.PlugWallet_WalletApi,
			label: 'Plug Wallet API',
		},
	],
	bindings: [bindings[Source.PlugWallet_WalletApi]],
} satisfies SourceProviderDefinition
