// Generated from APP.ts.

import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Nodely,
	label: 'Nodely',
	sources: {
		[Source.Nodely]: {
			label: 'Nodely',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
