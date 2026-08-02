// Generated from APP.ts.

import bindings from '$/sources/Juno/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Juno,
	label: 'Juno',
	sources: [
		{
			source: Source.Juno_JsonRpc,
			label: 'Juno JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
