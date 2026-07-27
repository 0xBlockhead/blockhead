// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LitecoinWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LitecoinWalletRpc,
	label: 'Litecoin wallet RPC',
	sources: [
		{
			source: Source.LitecoinWalletRpc_JsonRpc,
			label: 'Litecoin wallet JSON-RPC',
		},
	],
	bindings: [bindings[Source.LitecoinWalletRpc_JsonRpc]],
} satisfies SourceProviderDefinition
