// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MoneroDaemonRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MoneroDaemonRpc,
	label: 'Monero daemon RPC',
	sources: [
		{
			source: Source.MoneroDaemonRpc_JsonRpc,
			label: 'Monero daemon JSON-RPC',
		},
	],
	bindings: bindings[Source.MoneroDaemonRpc_JsonRpc],
} satisfies SourceProviderDefinition
