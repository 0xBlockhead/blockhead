// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AlgorandWallet/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AlgorandWallet,
	label: 'Algorand wallet',
	sources: [
		{
			source: Source.AlgorandWallet_WalletApi,
			label: 'Algorand wallet API',
		},
	],
	bindings: [bindings[Source.AlgorandWallet_WalletApi]],
} satisfies SourceProviderDefinition
