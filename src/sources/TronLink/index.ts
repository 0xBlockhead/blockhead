// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronLink/bindings.ts'

export default {
	provider: SourceProvider.TronLink,
	label: 'TronLink',
	sources: [
		{
			source: Source.TronLink_WalletApi,
			label: 'TronLink wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
