// Generated from APP.ts.

import bindings from '$/sources/NearRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NearRpc,
	label: 'NEAR RPC',
	sources: [
		{
			source: Source.NearRpc_JsonRpc,
			label: 'NEAR JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
