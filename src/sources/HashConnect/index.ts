// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HashConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HashConnect,
	label: 'HashConnect',
	sources: [
		{
			source: Source.HashConnect_WalletApi,
			label: 'HashConnect wallet API',
		},
	],
	bindings: [bindings[Source.HashConnect_WalletApi]],
} satisfies SourceProviderDefinition
