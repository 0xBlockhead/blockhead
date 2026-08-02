// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/X/bindings.ts'

export default {
	provider: SourceProvider.X,
	label: 'X',
	sources: [
		{
			source: Source.X_Rest,
			label: 'X API v2',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
