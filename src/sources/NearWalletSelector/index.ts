// Generated from APP.ts.

import bindings from '$/sources/NearWalletSelector/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NearWalletSelector,
	label: 'NEAR Wallet Selector',
	sources: [
		{
			source: Source.NearWalletSelector_WalletApi,
			label: 'NEAR Wallet Selector API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
