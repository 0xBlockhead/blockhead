// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AptosAip62/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AptosAip62,
	label: 'Aptos AIP-62',
	sources: [
		{
			source: Source.AptosAip62_WalletApi,
			label: 'Aptos AIP-62 wallet API',
		},
	],
	bindings: [bindings[Source.AptosAip62_WalletApi]],
} satisfies SourceProviderDefinition
