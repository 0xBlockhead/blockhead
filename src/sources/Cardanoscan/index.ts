// Generated from APP.ts.

import bindings from '$/sources/Cardanoscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Cardanoscan,
	label: 'Cardanoscan',
	sources: [
		{
			source: Source.Cardanoscan_Rest,
			label: 'Cardanoscan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
