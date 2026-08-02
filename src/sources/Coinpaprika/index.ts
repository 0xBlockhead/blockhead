// Generated from APP.ts.

import bindings from '$/sources/Coinpaprika/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Coinpaprika,
	label: 'Coinpaprika',
	sources: {
		[Source.Coinpaprika_Rest]: {
			label: 'Coinpaprika REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
