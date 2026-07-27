// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.TronTip1193_WalletApi]],
} satisfies SourceProviderDefinition
