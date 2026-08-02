// Generated from APP.ts.

import bindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Piped,
	label: 'Piped',
	sources: {
		[Source.Piped_Rest]: {
			label: 'Piped API REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
