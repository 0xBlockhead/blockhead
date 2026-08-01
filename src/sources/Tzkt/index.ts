// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Tzkt/bindings.ts'

export default {
	provider: SourceProvider.Tzkt,
	label: 'TzKT',
	sources: [
		{
			source: Source.Tzkt_Rest,
			label: 'TzKT REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
