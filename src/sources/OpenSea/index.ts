// Generated from APP.ts.

import bindings from '$/sources/OpenSea/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OpenSea,
	label: 'OpenSea',
	sources: {
		[Source.OpenSea_Rest]: {
			label: 'OpenSea REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
