// Generated from APP.ts.

import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LitecoinCore,
	label: 'Litecoin Core',
	sources: [
		{
			source: Source.LitecoinCore_JsonRpc,
			label: 'Litecoin Core JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
