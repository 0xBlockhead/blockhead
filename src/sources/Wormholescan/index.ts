// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'

export default {
	provider: SourceProvider.Wormholescan,
	label: 'Wormholescan',
	sources: [
		{
			source: Source.Wormholescan,
			label: 'Wormholescan',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
