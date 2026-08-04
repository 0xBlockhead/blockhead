// Generated from APP.ts.

import bindings from '$/sources/Pendle/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pendle,
	label: 'Pendle',
	sources: {
		[Source.Pendle_Rest]: {
			label: 'Pendle API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
