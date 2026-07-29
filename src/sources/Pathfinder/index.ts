// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pathfinder,
	label: 'Pathfinder',
	sources: [
		{
			source: Source.Pathfinder_JsonRpc,
			label: 'Pathfinder JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
