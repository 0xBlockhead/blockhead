// Generated from APP.ts.

import bindings from '$/sources/Blockchair/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Blockchair,
	label: 'Blockchair',
	sources: {
		[Source.Blockchair_Rest]: {
			label: 'Blockchair REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
