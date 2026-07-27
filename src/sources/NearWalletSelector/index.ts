// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearWalletSelector/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearWalletSelector,
	label: 'NEAR Wallet Selector',
	sources: [
		{
			source: Source.NearWalletSelector_WalletApi,
			label: 'NEAR Wallet Selector API',
		},
	],
	bindings: [bindings[Source.NearWalletSelector_WalletApi]],
} satisfies SourceProviderDefinition
