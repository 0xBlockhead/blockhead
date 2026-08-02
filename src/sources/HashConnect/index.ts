// Generated from APP.ts.

import bindings from '$/sources/HashConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HashConnect,
	label: 'HashConnect',
	sources: [
		{
			source: Source.HashConnect_WalletApi,
			label: 'HashConnect wallet API',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
