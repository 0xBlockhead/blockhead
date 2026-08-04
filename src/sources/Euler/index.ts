// Generated from APP.ts.

import bindings from '$/sources/Euler/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Euler,
	label: 'Euler',
	sources: {
		[Source.Euler_Rest]: {
			label: 'Euler v3 API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
