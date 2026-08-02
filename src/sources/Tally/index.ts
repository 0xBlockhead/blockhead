// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Tally/bindings.ts'

export default {
	provider: SourceProvider.Tally,
	label: 'Tally',
	sources: [
		{
			source: Source.Tally,
			label: 'Tally',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
