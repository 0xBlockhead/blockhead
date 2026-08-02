// Generated from APP.ts.

import bindings from '$/sources/Chainlist/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Chainlist,
	label: 'Chainlist',
	sources: {
		[Source.Chainlist_Rest]: {
			label: 'Chainlist REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
