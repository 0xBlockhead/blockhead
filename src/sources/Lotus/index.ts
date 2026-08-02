// Generated from APP.ts.

import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lotus,
	label: 'Lotus',
	sources: [
		{
			source: Source.Lotus_JsonRpc,
			label: 'Lotus JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
