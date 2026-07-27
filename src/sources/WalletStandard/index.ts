// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/WalletStandard/bindings.ts'

export default {
	provider: SourceProvider.WalletStandard,
	label: 'Wallet Standard',
	sources: [
		{
			source: Source.WalletStandard_WalletApi,
			label: 'Wallet Standard API',
		},
	],
	bindings: [bindings[Source.WalletStandard_WalletApi]],
} satisfies SourceProviderDefinition
