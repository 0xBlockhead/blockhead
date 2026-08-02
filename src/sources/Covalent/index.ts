// Generated from APP.ts.

import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Covalent,
	label: 'Covalent',
	sources: [
		{
			source: Source.GoldRushFoundational_Rest,
			label: 'GoldRush Foundational API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
