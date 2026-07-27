// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/PublicNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.PublicNode,
	label: 'PublicNode',
	sources: [
		{
			source: Source.Solana_JsonRpc,
			label: 'Solana JSON-RPC',
		},
	],
	bindings: bindings[Source.Solana_JsonRpc],
} satisfies SourceProviderDefinition
