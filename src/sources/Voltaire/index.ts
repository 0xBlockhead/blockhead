// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Voltaire/bindings.ts'

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	sources: [
		{
			source: Source.Voltaire_JsonRpc,
			label: 'Voltaire JSON-RPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
