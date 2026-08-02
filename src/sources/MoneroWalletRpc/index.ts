// Generated from APP.ts.

import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MoneroWalletRpc,
	label: 'Monero wallet RPC',
	sources: [
		{
			source: Source.MoneroWalletRpc_JsonRpc,
			label: 'Monero wallet JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
