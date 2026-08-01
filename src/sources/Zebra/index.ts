// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Zebra/bindings.ts'

export default {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	sources: [
		{
			source: Source.Zebra_JsonRpc,
			label: 'Zebra JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
