// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Subscan/bindings.ts'

export default {
	provider: SourceProvider.Subscan,
	label: 'Subscan',
	sources: {
		[Source.Subscan_Rest]: {
			label: 'Subscan REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
