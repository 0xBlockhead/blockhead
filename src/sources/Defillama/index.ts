// Generated from APP.ts.

import bindings from '$/sources/Defillama/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	sources: [
		{
			source: Source.Defillama_Rest,
			label: 'Defillama REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
