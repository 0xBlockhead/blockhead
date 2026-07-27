// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MoneroWalletRpc,
	label: 'Monero wallet RPC',
	sources: [
		{
			source: Source.MoneroWalletRpc_JsonRpc,
			label: 'Monero wallet JSON-RPC',
		},
	],
	bindings: [bindings[Source.MoneroWalletRpc_JsonRpc]],
} satisfies SourceProviderDefinition
