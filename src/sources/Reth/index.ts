// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Reth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Reth,
	label: 'Reth',
	sources: [
		{
			source: Source.Reth_JsonRpc,
			label: 'Reth JSON-RPC',
		},
	],
	bindings: [bindings[Source.Reth_JsonRpc]],
} satisfies SourceProviderDefinition
