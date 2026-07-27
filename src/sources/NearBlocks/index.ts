// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearBlocks/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearBlocks,
	label: 'NearBlocks',
	sources: [
		{
			source: Source.NearBlocks_Rest,
			label: 'NearBlocks REST',
		},
	],
	bindings: [bindings[Source.NearBlocks_Rest]],
} satisfies SourceProviderDefinition
