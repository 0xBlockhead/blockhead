// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Across/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Across,
	label: 'Across',
	sources: [
		{
			source: Source.Across_Rest,
			label: 'Across REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
