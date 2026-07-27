// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TonConnect/bindings.ts'

export default {
	provider: SourceProvider.TonConnect,
	label: 'TonConnect',
	sources: [
		{
			source: Source.TonConnect_WalletApi,
			label: 'TonConnect wallet API',
		},
	],
	bindings: [bindings[Source.TonConnect_WalletApi]],
} satisfies SourceProviderDefinition
