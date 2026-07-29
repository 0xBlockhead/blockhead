// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Avail,
	label: 'Avail',
	sources: [
		{
			source: Source.Avail_JsonRpc,
			label: 'Avail JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
