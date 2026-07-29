// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Reservoir/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Reservoir,
	label: 'Reservoir',
	sources: [
		{
			source: Source.Reservoir_Rest,
			label: 'Reservoir REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
