// Generated from APP.ts.

import bindings from '$/sources/PublicNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.PublicNode,
	label: 'PublicNode',
	sources: [
		{
			source: Source.Solana_JsonRpc,
			label: 'Solana JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
