// Generated from APP.ts.

import bindings from '$/sources/OpenSea/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OpenSea,
	label: 'OpenSea',
	sources: [
		{
			source: Source.OpenSea_Rest,
			label: 'OpenSea REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
