// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
