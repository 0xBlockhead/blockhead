// Generated from APP.ts.

import bindings from '$/sources/Compound/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Compound,
	label: 'Compound',
	sources: {
		[Source.Compound_Rest]: {
			label: 'Compound comet deployments',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
