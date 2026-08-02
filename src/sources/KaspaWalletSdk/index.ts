// Generated from APP.ts.

import bindings from '$/sources/KaspaWalletSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaspaWalletSdk,
	label: 'Kaspa wallet SDK',
	sources: [
		{
			source: Source.KaspaWalletSdk_WalletApi,
			label: 'Kaspa wallet SDK API',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
