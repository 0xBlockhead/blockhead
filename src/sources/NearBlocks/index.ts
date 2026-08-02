// Generated from APP.ts.

import bindings from '$/sources/NearBlocks/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NearBlocks,
	label: 'NearBlocks',
	sources: [
		{
			source: Source.NearBlocks_Rest,
			label: 'NearBlocks REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
