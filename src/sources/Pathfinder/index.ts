// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Pathfinder,
	label: 'Pathfinder',
	sources: [
		{
			source: Source.Pathfinder_JsonRpc,
			label: 'Pathfinder JSON-RPC',
		},
	],
	bindings: [bindings[Source.Pathfinder_JsonRpc]],
} satisfies SourceProviderDefinition
