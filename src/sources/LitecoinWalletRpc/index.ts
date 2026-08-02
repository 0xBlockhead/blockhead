// Generated from APP.ts.

import bindings from '$/sources/LitecoinWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LitecoinWalletRpc,
	label: 'Litecoin wallet RPC',
	sources: [
		{
			source: Source.LitecoinWalletRpc_JsonRpc,
			label: 'Litecoin wallet JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
