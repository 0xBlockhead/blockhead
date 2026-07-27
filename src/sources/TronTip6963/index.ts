// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TronTip6963/bindings.ts'

export default {
	provider: SourceProvider.TronTip6963,
	label: 'TRON TIP-6963',
	sources: [
		{
			source: Source.TronTip6963_WalletApi,
			label: 'TRON TIP-6963 wallet API',
		},
	],
	bindings: [bindings[Source.TronTip6963_WalletApi]],
} satisfies SourceProviderDefinition
