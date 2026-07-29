// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronTip1193/bindings.ts'

export default {
	provider: SourceProvider.TronTip1193,
	label: 'TRON TIP-1193',
	sources: [
		{
			source: Source.TronTip1193_WalletApi,
			label: 'TRON TIP-1193 wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
