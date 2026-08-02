// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Voyager/bindings.ts'

export default {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: {
		[Source.Voyager]: {
			label: 'Voyager',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
